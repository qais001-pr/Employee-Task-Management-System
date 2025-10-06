const { sql } = require('../connectionDb');

// ==================== GET all projects ====================
exports.getProjects = async (req, res) => {
  try {
    const result = await sql.query`
      SELECT 
        Id,
        Name,
        Description,
        StartDate,
        EndDate,
        Budget,
        Progress,
        Status,
        CreatedAt,
        UpdatedAt
      FROM Projects
      ORDER BY CreatedAt DESC;
    `;

    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ error: err.message });
  }
};

// ==================== GET project by ID ====================
exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await sql.query`
      SELECT 
        Id,
        Name,
        Description,
        StartDate,
        EndDate,
        Budget,
        Progress,
        Status,
        CreatedAt,
        UpdatedAt
      FROM Projects
      WHERE Id = ${id};
    `;

    if (result.recordset.length === 0)
      return res.status(404).json({ message: 'Project not found.' });

    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error fetching project by ID:', err);
    res.status(500).json({ error: err.message });
  }
};

// ==================== CREATE project ====================
exports.createProject = async (req, res) => {
  try {
    const {
      name,
      description,
      startDate,
      endDate,
      budget,
      progress,
      status
    } = req.body; // departmentId removed

    if (!name) {
      return res.status(400).json({ message: 'Project name is required.' });
    }

    // 🔍 Check if project name already exists
    const nameExists = await sql.query`
      SELECT Id FROM Projects WHERE LOWER(Name) = LOWER(${name});
    `;
    if (nameExists.recordset.length > 0) {
      return res.status(409).json({ message: 'Project name already exists. Please choose another name.' });
    }

    const result = await sql.query`
      INSERT INTO Projects
      (Name, Description, StartDate, EndDate, Budget, Progress, Status, CreatedAt, UpdatedAt)
      VALUES (
        ${name},
        ${description || null},
        ${startDate || null},
        ${endDate || null},
        ${budget || 0},
        ${progress || 0},
        ${status || 'Pending'},
        GETDATE(),
        GETDATE()
      );
      SELECT SCOPE_IDENTITY() AS Id;
    `;

    const newId = result.recordset[0]?.Id;

    res.status(201).json({
      message: 'Project created successfully.',
      projectId: newId
    });
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({ error: err.message });
  }
};

// ==================== UPDATE project ====================
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      startDate,
      endDate,
      budget,
      progress,
      status
    } = req.body; // departmentId removed

    // Check if project exists
    const existing = await sql.query`SELECT Id, Name FROM Projects WHERE Id = ${id}`;
    if (existing.recordset.length === 0) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    // 🔍 Check if new name (if provided) conflicts with another project
    if (name) {
      const nameCheck = await sql.query`
        SELECT Id FROM Projects WHERE LOWER(Name) = LOWER(${name}) AND Id != ${id};
      `;
      if (nameCheck.recordset.length > 0) {
        return res.status(409).json({ message: 'Another project already uses this name. Choose a different name.' });
      }
    }

    await sql.query`
      UPDATE Projects
      SET 
        Name = ${name || existing.recordset[0].Name},
        Description = ${description || null},
        StartDate = ${startDate || null},
        EndDate = ${endDate || null},
        Budget = ${budget || 0},
        Progress = ${progress || 0},
        Status = ${status || 'Pending'},
        UpdatedAt = GETDATE()
      WHERE Id = ${id};
    `;

    res.json({ message: 'Project updated successfully.' });
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).json({ error: err.message });
  }
};

// ==================== DELETE project ====================
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await sql.query`SELECT Id FROM Projects WHERE Id = ${id}`;
    if (result.recordset.length === 0)
      return res.status(404).json({ message: 'Project not found.' });

    // Note: Deleting a project will fail if there are existing tasks referencing it.
    // In a real application, you would either soft-delete or cascade delete related tasks.
    await sql.query`DELETE FROM Projects WHERE Id = ${id};`;

    res.json({ message: 'Project deleted successfully.' });
  } catch (err) {
    console.error('Error deleting project:', err);
    // Error will likely be 'Foreign key violation' if tasks exist
    res.status(500).json({ error: err.message });
  }
};
