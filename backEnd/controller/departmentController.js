const { sql } = require('../connectionDb');

// ==================== GET all departments ====================
exports.getDepartments = async (req, res) => {
  try {
    const result = await sql.query`
      SELECT Id, Name, Description, CreatedAt, UpdatedAt
      FROM Departments
      ORDER BY Name ASC
    `;
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ error: error.message });
  }
};

// ==================== GET department by ID ====================
exports.getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await sql.query`
      SELECT Id, Name, Description, CreatedAt, UpdatedAt
      FROM Departments
      WHERE Id = ${id}
    `;

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Department not found.' });
    }

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error('Error fetching department by ID:', error);
    res.status(500).json({ error: error.message });
  }
};

// ==================== CREATE department ====================
exports.createDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Department name is required.' });
    }

    // Check for duplicate department name
    const existing = await sql.query`
      SELECT Id FROM Departments WHERE LOWER(Name) = LOWER(${name})
    `;
    if (existing.recordset.length > 0) {
      return res.status(400).json({ message: 'Department name already exists.' });
    }

    // Insert new department
    await sql.query`
      INSERT INTO Departments (Name, Description, CreatedAt, UpdatedAt)
      VALUES (${name}, ${description || null}, GETDATE(), GETDATE())
    `;

    res.status(201).json({ message: 'Department created successfully.' });
  } catch (error) {
    console.error('Error creating department:', error);
    res.status(500).json({ error: error.message });
  }
};

// ==================== UPDATE department ====================
exports.updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // Check if department exists
    const dept = await sql.query`SELECT * FROM Departments WHERE Id = ${id}`;
    if (dept.recordset.length === 0) {
      return res.status(404).json({ message: 'Department not found.' });
    }

    // Check for duplicate name (excluding current department)
    const duplicate = await sql.query`
      SELECT Id FROM Departments 
      WHERE LOWER(Name) = LOWER(${name}) AND Id != ${id}
    `;
    if (duplicate.recordset.length > 0) {
      return res.status(400).json({ message: 'Another department with the same name already exists.' });
    }

    await sql.query`
      UPDATE Departments
      SET 
        Name = ${name},
        Description = ${description || null},
        UpdatedAt = GETDATE()
      WHERE Id = ${id}
    `;

    res.json({ message: 'Department updated successfully.' });
  } catch (error) {
    console.error('Error updating department:', error);
    res.status(500).json({ error: error.message });
  }
};

// ==================== DELETE department ====================
exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await sql.query`SELECT * FROM Departments WHERE Id = ${id}`;
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Department not found.' });
    }

    await sql.query`DELETE FROM Departments WHERE Id = ${id}`;
    res.json({ message: 'Department deleted successfully.' });
  } catch (error) {
    console.error('Error deleting department:', error);
    res.status(500).json({ error: error.message });
  }
};
