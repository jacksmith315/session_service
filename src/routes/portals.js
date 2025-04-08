const express = require('express');
const router = express.Router();
const { Portal } = require('../models/Portal');
const { UserPortal } = require('../models/UserPortal');
const { authenticateToken } = require('../middleware/auth');
const { validateAdmin } = require('../middleware/roleValidator');

// Create new portal (admin only)
router.post('/', authenticateToken, validateAdmin, async (req, res) => {
  try {
    const { name, domain } = req.body;
    const portal = await Portal.create({ name, domain });
    res.status(201).json(portal);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create portal' });
  }
});

// Get all portals
router.get('/', authenticateToken, async (req, res) => {
  try {
    const portals = await Portal.findAll({
      where: { status: 'active' }
    });
    res.json(portals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch portals' });
  }
});

// Get user's portals
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const userPortals = await UserPortal.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Portal,
        where: { status: 'active' }
      }]
    });
    res.json(userPortals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user portals' });
  }
});

// Join portal
router.post('/join/:portalId', authenticateToken, async (req, res) => {
  try {
    const { portalId } = req.params;
    const portal = await Portal.findByPk(portalId);
    
    if (!portal || portal.status !== 'active') {
      return res.status(404).json({ error: 'Portal not found or inactive' });
    }

    const [userPortal, created] = await UserPortal.findOrCreate({
      where: {
        userId: req.user.id,
        portalId
      },
      defaults: {
        status: 'pending'
      }
    });

    if (!created) {
      return res.status(400).json({ error: 'Already joined this portal' });
    }

    res.status(201).json(userPortal);
  } catch (error) {
    res.status(500).json({ error: 'Failed to join portal' });
  }
});

// Leave portal
router.delete('/leave/:portalId', authenticateToken, async (req, res) => {
  try {
    const { portalId } = req.params;
    await UserPortal.destroy({
      where: {
        userId: req.user.id,
        portalId
      }
    });
    res.json({ message: 'Successfully left portal' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to leave portal' });
  }
});

// Update portal settings (admin only)
router.put('/:portalId', authenticateToken, validateAdmin, async (req, res) => {
  try {
    const { portalId } = req.params;
    const { name, domain, status, settings } = req.body;
    const portal = await Portal.findByPk(portalId);
    await portal.update({ name, domain, status, settings });
    res.json(portal);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update portal' });
  }
});

module.exports = router;