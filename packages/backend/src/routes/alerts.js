const express = require('express');
const { query } = require('../utils/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// List active alerts
router.get('/', authenticate, async (req, res) => {
  try {
    const alerts = await query(`
      SELECT a.*, ar.artisan_name
      FROM alerts a
      JOIN artisans ar ON a.artisan_id = ar.id
      WHERE a.is_resolved = 0
      ORDER BY a.created_at DESC
    `);

    res.json(alerts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// Mark alert as resolved
router.put('/:id/resolve', authenticate, async (req, res) => {
  try {
    await query(
      'UPDATE alerts SET is_resolved = 1, resolved_at = NOW() WHERE id = ?',
      [req.params.id]
    );

    res.json({ message: 'Alert resolved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to resolve alert' });
  }
});

module.exports = router;