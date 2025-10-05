const { sql } = require('../connectionDb');

// 📍 Get all tasks
exports.getTasks = async (req, res) => {
  try {
    const result = await sql.query`
      SELECT 
        t.*, 
        e.Name AS AssignedTo, 
        p.Name AS ProjectName
      FROM Tasks t
      LEFT JOIN Employees e ON t.EmployeeId = e.Id
      LEFT JOIN Projects p ON t.ProjectId = p.Id
      ORDER BY t.CreatedAt DESC
    `;
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📍 Get a single task by ID
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await sql.query`
      SELECT 
        t.*, 
        e.Name AS AssignedTo, 
        p.Name AS ProjectName
      FROM Tasks t
      LEFT JOIN Employees e ON t.EmployeeId = e.Id
      LEFT JOIN Projects p ON t.ProjectId = p.Id
      WHERE t.Id = ${id}
    `;

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📍 Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, projectId, employeeId, status, priority, dueDate } = req.body;

    if (!title || !projectId || !status) {
      return res.status(400).json({ message: 'Title, Project, and Status are required' });
    }

    await sql.query`
      INSERT INTO Tasks (Title, Description, ProjectId, EmployeeId, Status, Priority, DueDate, CreatedAt)
      VALUES (${title}, ${description}, ${projectId}, ${employeeId}, ${status}, ${priority}, ${dueDate}, GETDATE())
    `;
    res.status(201).json({ message: '✅ Task created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📍 Update an existing task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, projectId, employeeId, status, priority, dueDate } = req.body;

    const result = await sql.query`
      UPDATE Tasks
      SET 
        Title = ${title},
        Description = ${description},
        ProjectId = ${projectId},
        EmployeeId = ${employeeId},
        Status = ${status},
        Priority = ${priority},
        DueDate = ${dueDate},
        UpdatedAt = GETDATE()
      WHERE Id = ${id}
    `;

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Task not found or not updated' });
    }

    res.json({ message: '✅ Task updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📍 Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await sql.query`DELETE FROM Tasks WHERE Id = ${id}`;

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: '🗑️ Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📍 Filter tasks by employee, project, or status
exports.filterTasks = async (req, res) => {
  try {
    const { filterType, filterValue } = req.params;
    let query;

    switch (filterType.toLowerCase()) {
      case 'employee':
        query = sql.query`
          SELECT * FROM Tasks WHERE EmployeeId = ${filterValue}
        `;
        break;
      case 'project':
        query = sql.query`
          SELECT * FROM Tasks WHERE ProjectId = ${filterValue}
        `;
        break;
      case 'status':
        query = sql.query`
          SELECT * FROM Tasks WHERE Status = ${filterValue}
        `;
        break;
      default:
        return res.status(400).json({ message: 'Invalid filter type' });
    }

    const result = await query;
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
