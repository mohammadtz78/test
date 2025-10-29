const express = require('express');
const router = express.Router();

/**
 * System Settings Routes
 * OData-style endpoints for SystemSetting entity
 */

/**
 * GET /api/SystemSetting
 * Retrieve all system settings
 */
router.get('/', (req, res) => {
  const db = req.app.get('db');
  
  const query = 'SELECT * FROM SystemSetting ORDER BY settingName';
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching system settings:', err.message);
      return res.status(500).json({
        error: 'Internal server error',
        message: err.message
      });
    }
    
    res.json({
      value: rows,
      count: rows.length
    });
  });
});

/**
 * GET /api/SystemSetting/:settingName
 * Retrieve a specific system setting by name (OData-style)
 */
router.get('/:settingName', (req, res) => {
  const db = req.app.get('db');
  const { settingName } = req.params;
  
  const query = 'SELECT * FROM SystemSetting WHERE settingName = ?';
  
  db.get(query, [settingName], (err, row) => {
    if (err) {
      console.error('Error fetching system setting:', err.message);
      return res.status(500).json({
        error: 'Internal server error',
        message: err.message
      });
    }
    
    if (!row) {
      return res.status(404).json({
        error: 'Not found',
        message: `System setting '${settingName}' not found`
      });
    }
    
    // Return just the value for simple retrieval
    res.json({
      settingName: row.settingName,
      settingValue: row.settingValue,
      description: row.description
    });
  });
});

/**
 * POST /api/SystemSetting
 * Create a new system setting
 */
router.post('/', (req, res) => {
  const db = req.app.get('db');
  const { settingName, settingValue, description } = req.body;
  
  // Validation
  if (!settingName || !settingValue) {
    return res.status(400).json({
      error: 'Bad request',
      message: 'settingName and settingValue are required'
    });
  }
  
  const query = `
    INSERT INTO SystemSetting (settingName, settingValue, description)
    VALUES (?, ?, ?)
  `;
  
  db.run(query, [settingName, settingValue, description || null], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({
          error: 'Conflict',
          message: `System setting '${settingName}' already exists`
        });
      }
      console.error('Error creating system setting:', err.message);
      return res.status(500).json({
        error: 'Internal server error',
        message: err.message
      });
    }
    
    res.status(201).json({
      id: this.lastID,
      settingName,
      settingValue,
      description: description || null,
      message: 'System setting created successfully'
    });
  });
});

/**
 * PUT /api/SystemSetting/:settingName
 * Update an existing system setting
 */
router.put('/:settingName', (req, res) => {
  const db = req.app.get('db');
  const { settingName } = req.params;
  const { settingValue, description } = req.body;
  
  // Validation
  if (!settingValue) {
    return res.status(400).json({
      error: 'Bad request',
      message: 'settingValue is required'
    });
  }
  
  const query = `
    UPDATE SystemSetting 
    SET settingValue = ?, description = ?
    WHERE settingName = ?
  `;
  
  db.run(query, [settingValue, description || null, settingName], function(err) {
    if (err) {
      console.error('Error updating system setting:', err.message);
      return res.status(500).json({
        error: 'Internal server error',
        message: err.message
      });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({
        error: 'Not found',
        message: `System setting '${settingName}' not found`
      });
    }
    
    res.json({
      settingName,
      settingValue,
      description: description || null,
      message: 'System setting updated successfully'
    });
  });
});

/**
 * DELETE /api/SystemSetting/:settingName
 * Delete a system setting
 */
router.delete('/:settingName', (req, res) => {
  const db = req.app.get('db');
  const { settingName } = req.params;
  
  const query = 'DELETE FROM SystemSetting WHERE settingName = ?';
  
  db.run(query, [settingName], function(err) {
    if (err) {
      console.error('Error deleting system setting:', err.message);
      return res.status(500).json({
        error: 'Internal server error',
        message: err.message
      });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({
        error: 'Not found',
        message: `System setting '${settingName}' not found`
      });
    }
    
    res.json({
      message: 'System setting deleted successfully',
      settingName
    });
  });
});

module.exports = router;
