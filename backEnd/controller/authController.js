const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sql } = require('../connectionDb');
require('dotenv').config();

// Default values (using environment variables is still best practice)
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    // Removed roleId and departmentId from destructuring
    const { name, email, password } = req.body;

    // Validation updated
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email, and password are required.',
      });
    }

    // Check if email already exists
    const existing = await sql.query`
            SELECT Id FROM Employees WHERE Email = ${email};
        `;
    if (existing.recordset.length > 0) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Insert employee record (RoleId and DepartmentId columns removed from INSERT statement)
    const result = await sql.query`
            INSERT INTO Employees (Name, Email, PasswordHash, CreatedAt, UpdatedAt, IsActive)
            VALUES (${name}, ${email}, ${hash}, GETDATE(), GETDATE(), 1);
            SELECT SCOPE_IDENTITY() AS Id;
        `;

    const newId = result.recordset[0]?.Id;

    res.status(201).json({
      message: 'Registration successful.',
      userId: newId,
    });
  } catch (err) {
    console.error('Register error:', err);
    // Using 23000 as a common SQL Server error code for unique violations, though the text check is often safer.
    if (err.message.includes('UNIQUE KEY')) {
      return res.status(409).json({ message: 'Email already registered.' });
    }
    res.status(500).json({
      message: 'Server error during registration.',
      error: err.message,
    });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ message: 'Email and password are required.' });

    // Fetch user from Employees (RoleId and DepartmentId columns removed from SELECT)
    const result = await sql.query`
            SELECT Id, Name, Email, PasswordHash, IsActive
            FROM Employees
            WHERE Email = ${email};
        `;

    const user = result.recordset[0];
    if (!user) return res.status(401).json({ message: 'Invalid credentials.' });
    if (!user.IsActive)
      return res.status(403).json({ message: 'User is inactive.' });

    // Validate password
    const validPassword = await bcrypt.compare(password, user.PasswordHash);
    if (!validPassword)
      return res.status(401).json({ message: 'Invalid credentials.' });

    // JWT Payload (RoleId and DepartmentId removed)
    const payload = {
      id: user.Id,
      name: user.Name,
      email: user.Email,
    };

    // Sign JWT
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({
      message: 'Login successful.',
      token,
      expiresIn: JWT_EXPIRES_IN,
      user: payload,
    });
  } catch (err) {
    console.error('Login error:', err);
    res
      .status(500)
      .json({ message: 'Server error during login.', error: err.message });
  }
};
