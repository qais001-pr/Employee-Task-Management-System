const { sql } = require('../connectionDb');

// ✅ GET all comments
exports.getAllComments = async (req, res) => {
  try {
    const result = await sql.query(`
      SELECT 
        c.Id,
        c.TaskId,
        t.Title AS TaskTitle,
        c.EmployeeId,
        e.Name AS EmployeeName,
        c.CommentText,
        c.CreatedAt
      FROM Comments c
      LEFT JOIN Tasks t ON c.TaskId = t.Id
      LEFT JOIN Employees e ON c.EmployeeId = e.Id
      ORDER BY c.CreatedAt DESC
    `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ GET comments by Task ID
exports.getCommentsByTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const result = await sql.query`
      SELECT 
        c.Id,
        c.TaskId,
        t.Title AS TaskTitle,
        c.EmployeeId,
        e.Name AS EmployeeName,
        c.CommentText,
        c.CreatedAt
      FROM Comments c
      LEFT JOIN Tasks t ON c.TaskId = t.Id
      LEFT JOIN Employees e ON c.EmployeeId = e.Id
      WHERE c.TaskId = ${taskId}
      ORDER BY c.CreatedAt DESC
    `;
    if (result.recordset.length === 0)
      return res.status(404).json({ message: 'No comments found for this task.' });

    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ GET comments by Employee ID
exports.getCommentsByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const result = await sql.query`
      SELECT 
        c.Id,
        c.TaskId,
        t.Title AS TaskTitle,
        c.EmployeeId,
        e.Name AS EmployeeName,
        c.CommentText,
        c.CreatedAt
      FROM Comments c
      LEFT JOIN Tasks t ON c.TaskId = t.Id
      LEFT JOIN Employees e ON c.EmployeeId = e.Id
      WHERE c.EmployeeId = ${employeeId}
      ORDER BY c.CreatedAt DESC
    `;
    if (result.recordset.length === 0)
      return res.status(404).json({ message: 'No comments found for this employee.' });

    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ ADD a new comment
exports.addComment = async (req, res) => {
  try {
    const { taskId, employeeId, commentText } = req.body;

    if (!taskId || !employeeId || !commentText) {
      return res.status(400).json({ error: 'taskId, employeeId, and commentText are required.' });
    }

    await sql.query`
      INSERT INTO Comments (TaskId, EmployeeId, CommentText, CreatedAt)
      VALUES (${taskId}, ${employeeId}, ${commentText}, GETDATE())
    `;

    res.status(201).json({ message: 'Comment added successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ UPDATE a comment
exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { commentText } = req.body;

    const result = await sql.query`
      UPDATE Comments
      SET CommentText = ${commentText}
      WHERE Id = ${id}
    `;

    if (result.rowsAffected[0] === 0)
      return res.status(404).json({ message: 'Comment not found.' });

    res.json({ message: 'Comment updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ DELETE a comment
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await sql.query`
      DELETE FROM Comments WHERE Id = ${id}
    `;

    if (result.rowsAffected[0] === 0)
      return res.status(404).json({ message: 'Comment not found.' });

    res.json({ message: 'Comment deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
