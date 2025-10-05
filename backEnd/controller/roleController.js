const { sql } = require('../connectionDb');

// ========================================
// 📘 Get all roles
// ========================================
exports.getRoles = async (req, res) => {
    try {
        const result = await sql.query`
      SELECT Id, Name, Permissions 
      FROM Roles
      ORDER BY Id DESC
    `;
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({ error: error.message });
    }
};

// ========================================
// 📘 Get single role by ID
// ========================================
exports.getRoleById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await sql.query`
      SELECT Id, Name, Permissions
      FROM Roles
      WHERE Id = ${id}
    `;

        if (result.recordset.length === 0)
            return res.status(404).json({ message: 'Role not found' });

        res.status(200).json(result.recordset[0]);
    } catch (error) {
        console.error('Error fetching role by ID:', error);
        res.status(500).json({ error: error.message });
    }
};

// ========================================
// 🟢 Create new role
// ========================================
exports.createRole = async (req, res) => {
    try {
        const { name, permissions } = req.body;

        if (!name || name.trim() === '')
            return res.status(400).json({ message: 'Role name is required' });

        // Check if role already exists
        const check = await sql.query`SELECT Id FROM Roles WHERE Name = ${name}`;
        if (check.recordset.length > 0)
            return res.status(400).json({ message: 'Role name already exists' });

        await sql.query`
      INSERT INTO Roles (Name, Permissions)
      VALUES (${name}, ${permissions || null})
    `;

        res.status(201).json({ message: '✅ Role created successfully' });
    } catch (error) {
        console.error('Error creating role:', error);
        res.status(500).json({ error: error.message });
    }
};

// ========================================
// 🟡 Update role
// ========================================
exports.updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, permissions } = req.body;

        if (!name || name.trim() === '')
            return res.status(400).json({ message: 'Role name is required' });

        const result = await sql.query`
      UPDATE Roles
      SET 
        Name = ${name}, 
        Permissions = ${permissions || null}
      WHERE Id = ${id}
    `;

        if (result.rowsAffected[0] === 0)
            return res.status(404).json({ message: 'Role not found or not updated' });

        res.status(200).json({ message: '✅ Role updated successfully' });
    } catch (error) {
        console.error('Error updating role:', error);
        res.status(500).json({ error: error.message });
    }
};

// ========================================
// 🔴 Delete role
// ========================================
exports.deleteRole = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await sql.query`
      DELETE FROM Roles WHERE Id = ${id}
    `;

        if (result.rowsAffected[0] === 0)
            return res.status(404).json({ message: 'Role not found' });

        res.status(200).json({ message: '🗑️ Role deleted successfully' });
    } catch (error) {
        console.error('Error deleting role:', error);
        res.status(500).json({ error: error.message });
    }
};
