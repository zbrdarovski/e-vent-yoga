const express = require('express');
const router = express.Router();
const Event = require('../models/event');

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *       required:
 *         - name
 *         - description
 */

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: API for managing events
 */

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       '201':
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       '400':
 *         description: Bad request
 */

// POST /event
router.post('/', async (req, res) => {
    console.log('post');
    console.log('Request Body:', req.body); // Log request body
    try {
      const event = await Event.create(req.body);
      console.log('Created Event:', event); // Log created event
      res.status(201).json(event);
    } catch (err) {
      console.error('Error Creating Event:', err.message); // Log error message
      res.status(400).json({ message: err.message });
    }
  });


/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       '500':
 *         description: Internal Server Error
 */

// GET /event
router.get('/allevents/', async (req, res) => {
  console.log('events: ');
  try {
    const events = await Event.find();
    console.log(events);
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get a specific event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the event to get
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       '404':
 *         description: Event not found
 *       '500':
 *         description: Internal Server Error
 */

// GET /events/:id
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Update a specific event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the event to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       '404':
 *         description: Event not found
 *       '400':
 *         description: Bad request
 */

// PUT /events/:id
router.put('/:id', async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(updatedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Delete a specific event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the event to delete
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: No Content
 *       '404':
 *         description: Event not found
 *       '500':
 *         description: Internal Server Error
 */

// DELETE /events/:id
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /events/search
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q; // Get the search query parameter from the request URL
    const events = await Event.find({
      $or: [
        { name: { $regex: query, $options: 'i' } }, // Case-insensitive search on name field
        { description: { $regex: query, $options: 'i' } } // Case-insensitive search on description field
      ]
    });
    res.json(events);
    console.log('events found: ', events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
