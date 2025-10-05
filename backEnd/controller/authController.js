const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sql } = require('../connectionDb');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { name, email, password, roleId, departmentId } = req.body;

    if (!name || !email || !password || !roleId) {
      return res.status(400).json({
        message: 'Name, email, password, and roleId are required.',
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

    // Insert employee record
    const result = await sql.query`
      INSERT INTO Employees (Name, Email, PasswordHash, RoleId, DepartmentId, CreatedAt, UpdatedAt, IsActive)
      VALUES (${name}, ${email}, ${hash}, ${roleId}, ${departmentId || null}, GETDATE(), GETDATE(), 1);
      SELECT SCOPE_IDENTITY() AS Id;
    `;

    const newId = result.recordset[0]?.Id;

    res.status(201).json({
      message: 'Registration successful.',
      userId: newId,
    });
  } catch (err) {
    console.error('Register error:', err);
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

    // Fetch user from Employees
    const result = await sql.query`
      SELECT Id, Name, Email, RoleId, DepartmentId, PasswordHash, IsActive
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

    // JWT Payload
    const payload = {
      id: user.Id,
      name: user.Name,
      email: user.Email,
      roleId: user.RoleId,
      departmentId: user.DepartmentId,
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