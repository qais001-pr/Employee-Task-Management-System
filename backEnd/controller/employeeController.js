const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sql } = require('../connectionDb');

// Secret key for JWT (store this securely, e.g., in .env)
const JWT_SECRET = process.env.JWT_SECRET || 'yourSuperSecretKey';

// =======================
// 📘 Get all employees
// =======================
exports.getEmployees = async (req, res) => {
  try {
    const result = await sql.query`
      SELECT 
        e.Id, 
        e.Name, 
        e.Email, 
        e.RoleId, 
        e.DepartmentId, 
        e.CreatedAt,
        e.UpdatedAt,
        e.IsActive,
        r.Name AS RoleName, 
        d.Name AS DepartmentName
      FROM Employees e
      LEFT JOIN Roles r ON e.RoleId = r.Id
      LEFT JOIN Departments d ON e.DepartmentId = d.Id
      ORDER BY e.CreatedAt DESC
    `;
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: error.message });
  }
};

// =======================
// 📘 Get employee by ID
// =======================
exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await sql.query`
      SELECT 
        e.Id, 
        e.Name, 
        e.Email, 
        e.RoleId, 
        e.DepartmentId, 
        e.CreatedAt,
        e.UpdatedAt,
        e.IsActive,
        r.Name AS RoleName, 
        d.Name AS DepartmentName
      FROM Employees e
      LEFT JOIN Roles r ON e.RoleId = r.Id
      LEFT JOIN Departments d ON e.DepartmentId = d.Id
      WHERE e.Id = ${id}
    `;

    if (result.recordset.length === 0)
      return res.status(404).json({ message: 'Employee not found' });

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error('Error fetching employee by ID:', error);
    res.status(500).json({ error: error.message });
  }
};

// =======================
// 🟢 Create new employee
// =======================
exports.createEmployee = async (req, res) => {
  try {
    const { name, email, password, roleId, departmentId } = req.body;

    if (!name || !email || !password || !roleId)
      return res
        .status(400)
        .json({ message: 'Name, Email, Password, and RoleId are required.' });

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    await sql.query`
      INSERT INTO Employees (Name, Email, PasswordHash, RoleId, DepartmentId, CreatedAt, UpdatedAt, IsActive)
      VALUES (${name}, ${email}, ${passwordHash}, ${roleId}, ${departmentId}, GETDATE(), GETDATE(), 1)
    `;

    res.status(201).json({ message: 'Employee created successfully' });
  } catch (error) {
    console.error('Error creating employee:', error);
    if (error.message.includes('UNIQUE KEY'))
      return res.status(400).json({ message: 'Email already exists' });
    res.status(500).json({ error: error.message });
  }
};

// =======================
// 🟡 Update employee
// =======================
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, roleId, departmentId, isActive } = req.body;

    // Build dynamic update
    let passwordClause = '';
    if (password) {
      const passwordHash = await bcrypt.hash(password, 10);
      passwordClause = `, PasswordHash = '${passwordHash}'`;
    }

    const query = `
      UPDATE Employees
      SET 
        Name = @name,
        Email = @email,
        RoleId = @roleId,
        DepartmentId = @departmentId,
        IsActive = @isActive,
        UpdatedAt = GETDATE()
        ${passwordClause}
      WHERE Id = @id
    `;

    const request = new sql.Request();
    request.input('id', sql.Int, id);
    request.input('name', sql.VarChar(100), name);
    request.input('email', sql.VarChar(150), email);
    request.input('roleId', sql.Int, roleId);
    request.input('departmentId', sql.Int, departmentId);
    request.input('isActive', sql.Bit, isActive ?? 1);

    const result = await request.query(query);

    if (result.rowsAffected[0] === 0)
      return res.status(404).json({ message: 'Employee not found' });

    res.status(200).json({ message: 'Employee updated successfully' });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: error.message });
  }
};

// =======================
// 🔴 Soft delete employee
// =======================
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await sql.query`
      UPDATE Employees SET IsActive = 0, UpdatedAt = GETDATE() WHERE Id = ${id}
    `;

    if (result.rowsAffected[0] === 0)
      return res.status(404).json({ message: 'Employee not found' });

    res.status(200).json({ message: 'Employee deactivated successfully' });
  } catch (error) {
    console.error('Error deactivating employee:', error);
    res.status(500).json({ error: error.message });
  }
};

// =======================
// 🔐 Employee Login
// =======================
exports.loginEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and Password are required.' });

    const result = await sql.query`
      SELECT Id, Name, Email, PasswordHash, RoleId, IsActive 
      FROM Employees 
      WHERE Email = ${email}
    `;

    if (result.recordset.length === 0)
      return res.status(401).json({ message: 'Invalid email or password.' });

    const employee = result.recordset[0];

    if (!employee.IsActive)
      return res.status(403).json({ message: 'Account is deactivated.' });

    // Compare password
    const isMatch = await bcrypt.compare(password, employee.PasswordHash);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid email or password.' });

    // Generate JWT token
    const token = jwt.sign(
      {
        id: employee.Id,
        email: employee.Email,
        roleId: employee.RoleId,
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      employee: {
        id: employee.Id,
        name: employee.Name,
        email: employee.Email,
        roleId: employee.RoleId,
      },
    });
  } catch (error) {
    console.error('Error logging in employee:', error);
    res.status(500).json({ error: error.message });
  }
};

// =======================
// 🔒 Token Verification Middleware
// =======================
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer token

  if (!token) return res.status(401).json({ message: 'Access denied. Token missing.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token.' });
    req.user = user;
    next();
  });
};
