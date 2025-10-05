const { sql } = require('../connectionDb');

// ✅ GET all tracking entries
exports.getAllTracking = async (req, res) => {
  try {
    const result = await sql.query(`
      SELECT 
        tt.Id,
        tt.TaskId,
        t.Title AS TaskTitle,
        e.Name AS UpdatedByName,
        tt.OldStatus,
        tt.NewStatus,
        tt.OldProgress,
        tt.NewProgress,
        tt.Remarks,
        tt.UpdatedAt
      FROM TaskTracking tt
      LEFT JOIN Tasks t ON tt.TaskId = t.Id
      LEFT JOIN Employees e ON tt.UpdatedBy = e.Id
      ORDER BY tt.UpdatedAt DESC
    `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ GET tracking entries by Task ID
exports.getTrackingByTaskId = async (req, res) => {
  try {
    const { taskId } = req.params;

    const result = await sql.query`
      SELECT 
        tt.Id,
        tt.TaskId,
        t.Title AS TaskTitle,
        e.Name AS UpdatedByName,
        tt.OldStatus,
        tt.NewStatus,
        tt.OldProgress,
        tt.NewProgress,
        tt.Remarks,
        tt.UpdatedAt
      FROM TaskTracking tt
      LEFT JOIN Tasks t ON tt.TaskId = t.Id
      LEFT JOIN Employees e ON tt.UpdatedBy = e.Id
      WHERE tt.TaskId = ${taskId}
      ORDER BY tt.UpdatedAt DESC
    `;

    if (result.recordset.length === 0)
      return res.status(404).json({ message: 'No tracking history found for this task.' });

    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ CREATE new tracking record
exports.createTracking = async (req, res) => {
  try {
    const {
      taskId,
      updatedBy,
      oldStatus,
      newStatus,
      oldProgress,
      newProgress,
      remarks
    } = req.body;

    if (!taskId || !updatedBy) {
      return res.status(400).json({ error: 'taskId and updatedBy are required.' });
    }

    await sql.query`
      INSERT INTO TaskTracking 
      (TaskId, UpdatedBy, OldStatus, NewStatus, OldProgress, NewProgress, Remarks, UpdatedAt)
      VALUES 
      (${taskId}, ${updatedBy}, ${oldStatus}, ${newStatus}, ${oldProgress}, ${newProgress}, ${remarks}, GETDATE())
    `;

    res.status(201).json({ message: 'Tracking record added successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ DELETE tracking record
exports.deleteTracking = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await sql.query`
      DELETE FROM TaskTracking WHERE Id = ${id}
    `;

    if (result.rowsAffected[0] === 0)
      return res.status(404).json({ message: 'Tracking record not found.' });

    res.json({ message: 'Tracking record deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
