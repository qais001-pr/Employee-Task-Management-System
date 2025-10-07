const { sql } = require('../connectionDb');

// 📍 Get all tasks
exports.getTasks = async (req, res) => {
  try {
    const result = await sql.query`
      SELECT 
        t.*, 
        e.Name AS AssignedToName, 
        cb.Name AS CreatedByName,
        p.Name AS ProjectName
      FROM Tasks t
      LEFT JOIN Employees e ON t.EmployeeId = e.Id
      LEFT JOIN Employees cb ON t.CreatedBy = cb.Id -- Join for CreatedBy name
      LEFT JOIN Projects p ON t.ProjectId = p.Id
      ORDER BY t.CreatedAt DESC
    `;
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching tasks:', error.message);
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
        e.Name AS AssignedToName, 
        cb.Name AS CreatedByName,
        p.Name AS ProjectName
      FROM Tasks t
      LEFT JOIN Employees e ON t.EmployeeId = e.Id
      LEFT JOIN Employees cb ON t.CreatedBy = cb.Id -- Join for CreatedBy name
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
    const {
      title,
      description,
      projectId,
      employeeId,
      createdBy, // Important: should typically come from req.user.id (auth token)
      status,
      priority,
      dueDate,
      progress
    } = req.body;

    if (!title || !projectId || !createdBy) {
      return res.status(400).json({ message: 'Title, ProjectId, and CreatedBy are required' });
    }

    const result = await sql.query`
      INSERT INTO Tasks (Title, Description, ProjectId, EmployeeId, CreatedBy, Status, Priority, DueDate, Progress, CreatedAt, UpdatedAt)
      VALUES (
        ${title}, 
        ${description || null}, 
        ${projectId}, 
        ${employeeId || null}, 
        ${createdBy},
        ${status || 'Pending'}, 
        ${priority || 'Medium'}, 
        ${dueDate || null}, 
        ${progress || 0},
        GETDATE(), 
        GETDATE()
      );
      SELECT SCOPE_IDENTITY() AS Id;
    `;

    const newId = result.recordset[0]?.Id;

    res.status(201).json({ message: '✅ Task created successfully', taskId: newId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📍 Update an existing task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      projectId,
      employeeId,
      status,
      priority,
      dueDate,
      progress
    } = req.body;

    // Fetch existing task to ensure it exists and get current values for partial update
    const existingTaskResult = await sql.query`SELECT * FROM Tasks WHERE Id = ${id}`;
    if (existingTaskResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    const existingTask = existingTaskResult.recordset[0];

    // Use nullish coalescing (??) to retain the existing value if the new value is undefined or null
    const newTitle = title ?? existingTask.Title;
    const newDescription = description ?? existingTask.Description;
    const newProjectId = projectId ?? existingTask.ProjectId;
    const newEmployeeId = employeeId ?? existingTask.EmployeeId;
    const newStatus = status ?? existingTask.Status;
    const newPriority = priority ?? existingTask.Priority;
    const newDueDate = dueDate ?? existingTask.DueDate;
    const newProgress = progress ?? existingTask.Progress;


    const result = await sql.query`
      UPDATE Tasks
      SET 
        Title = ${newTitle},
        Description = ${newDescription},
        ProjectId = ${newProjectId},
        EmployeeId = ${newEmployeeId},
        Status = ${newStatus},
        Priority = ${newPriority},
        DueDate = ${newDueDate},
        Progress = ${newProgress},
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
    console.error('Error deleting task:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// 📍 Filter tasks by employee, project, or status
exports.filterTasks = async (req, res) => {
  try {
    const { filterType, filterValue } = req.params;
    let result;
    let columnName;
    let inputType;

    switch (filterType.toLowerCase()) {
      case 'employee':
        columnName = 't.EmployeeId';
        inputType = sql.Int;
        break;
      case 'project':
        columnName = 't.ProjectId';
        inputType = sql.Int;
        break;
      case 'status':
        columnName = 't.Status';
        inputType = sql.VarChar(50);
        break;
      default:
        return res.status(400).json({ message: 'Invalid filter type. Must be employee, project, or status.' });
    }

    const finalQuery = `
        SELECT 
            t.*, 
            e.Name AS AssignedToName, 
            cb.Name AS CreatedByName,
            p.Name AS ProjectName
        FROM Tasks t
        LEFT JOIN Employees e ON t.EmployeeId = e.Id
        LEFT JOIN Employees cb ON t.CreatedBy = cb.Id
        LEFT JOIN Projects p ON t.ProjectId = p.Id
        WHERE ${columnName} = @filterValue
        ORDER BY t.CreatedAt DESC
    `;
    const request = new sql.Request();
    request.input('filterValue', inputType, filterValue);

    result = await request.query(finalQuery);

    res.json(result.recordset);
  } catch (error) {
    console.error('Error filtering tasks:', error.message);
    res.status(500).json({ error: error.message });
  }
};
