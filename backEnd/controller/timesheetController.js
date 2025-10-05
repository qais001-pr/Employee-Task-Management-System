const { sql } = require('../connectionDb');

// ✅ GET all timesheets
exports.getAllTimesheets = async (req, res) => {
  try {
    const result = await sql.query(`
      SELECT 
        ts.Id,
        ts.EmployeeId,
        e.Name AS EmployeeName,
        ts.TaskId,
        t.Title AS TaskTitle,
        ts.HoursWorked,
        ts.Date,
        ts.Remarks
      FROM Timesheets ts
      LEFT JOIN Employees e ON ts.EmployeeId = e.Id
      LEFT JOIN Tasks t ON ts.TaskId = t.Id
      ORDER BY ts.Date DESC
    `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ GET timesheets by employee
exports.getTimesheetsByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const result = await sql.query`
      SELECT 
        ts.Id,
        ts.EmployeeId,
        e.Name AS EmployeeName,
        ts.TaskId,
        t.Title AS TaskTitle,
        ts.HoursWorked,
        ts.Date,
        ts.Remarks
      FROM Timesheets ts
      LEFT JOIN Employees e ON ts.EmployeeId = e.Id
      LEFT JOIN Tasks t ON ts.TaskId = t.Id
      WHERE ts.EmployeeId = ${employeeId}
      ORDER BY ts.Date DESC
    `;
    if (result.recordset.length === 0)
      return res.status(404).json({ message: 'No timesheets found for this employee.' });

    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ GET timesheets by task
exports.getTimesheetsByTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const result = await sql.query`
      SELECT 
        ts.Id,
        ts.EmployeeId,
        e.Name AS EmployeeName,
        ts.TaskId,
        t.Title AS TaskTitle,
        ts.HoursWorked,
        ts.Date,
        ts.Remarks
      FROM Timesheets ts
      LEFT JOIN Employees e ON ts.EmployeeId = e.Id
      LEFT JOIN Tasks t ON ts.TaskId = t.Id
      WHERE ts.TaskId = ${taskId}
      ORDER BY ts.Date DESC
    `;
    if (result.recordset.length === 0)
      return res.status(404).json({ message: 'No timesheets found for this task.' });

    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ CREATE a new timesheet entry
exports.createTimesheet = async (req, res) => {
  try {
    const { employeeId, taskId, hoursWorked, remarks } = req.body;

    if (!employeeId || !taskId || !hoursWorked) {
      return res.status(400).json({ error: 'employeeId, taskId, and hoursWorked are required.' });
    }

    await sql.query`
      INSERT INTO Timesheets (EmployeeId, TaskId, HoursWorked, Date, Remarks)
      VALUES (${employeeId}, ${taskId}, ${hoursWorked}, GETDATE(), ${remarks})
    `;

    res.status(201).json({ message: 'Timesheet entry added successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ UPDATE existing timesheet record
exports.updateTimesheet = async (req, res) => {
  try {
    const { id } = req.params;
    const { hoursWorked, remarks } = req.body;

    const result = await sql.query`
      UPDATE Timesheets
      SET 
        HoursWorked = ${hoursWorked},
        Remarks = ${remarks}
      WHERE Id = ${id}
    `;

    if (result.rowsAffected[0] === 0)
      return res.status(404).json({ message: 'Timesheet record not found.' });

    res.json({ message: 'Timesheet updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ DELETE a timesheet record
exports.deleteTimesheet = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await sql.query`
      DELETE FROM Timesheets WHERE Id = ${id}
    `;

    if (result.rowsAffected[0] === 0)
      return res.status(404).json({ message: 'Timesheet record not found.' });

    res.json({ message: 'Timesheet record deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
