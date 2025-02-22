const express = require("express");
const router = express.Router();

const {
  getAllEvents,
  getSingleEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");
const authenticateUser = require("../middleware/authentication");


/**
 * @swagger
 * /api/event:
 *   get:
 *     summary: Get all events
 *     tags: [Event]
 *     security:
 *       - BearerAuth: []  
 *     responses:
 *       200:
 *         description: List of events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */
router.get("/", getAllEvents);
/**
 * @swagger
 * /api/event/{id}:
 *  get:
 *    summary: Get event by id
 *    tags: [Event]
 *    parameters:
 *      - in: path
 *        name: id
 *        description: id of event
 *        schema:
 *          type: string
 *          required: true
 *    responses:
 *      200:
 *        description: event by its id
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Event'
 *      500:
 *        description: Internal server error 
 */
router.get("/:id", getSingleEvent);
/**
 * @swagger
 * components:
 *  schemas:
 *    Event:
 *      type: object
 *      required:
 *        - title
 *        - description
 *        - startTime
 *        - endTime
 *        - location
 *        - userId
 *      properties:
 *        title:
 *          type: string
 *          description: title of the event
 *        description:
 *          type: string
 *          description: description of the event
 *        startTime:
 *          type: string
 *          description: time of the event
 *        endTime:
 *          type: string
 *          description: time of the event
 *        location:
 *          type: string
 *          description: location of the event
 *        userId:
 *          type: string
 *          description: id of the user
 */

/**
 * @swagger
 * /api/event:
 *  post:
 *    summary: create a new event with userId
 *    tags: [Event]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Event'
 *    responses:
 *      200:
 *        description: The event created successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Event'
 *      500:
 *        description: Internal server error
 */
router.post("/", authenticateUser, createEvent);
/**
 * @swagger
 * /api/event/{id}:
 *  put:
 *    summary: Update event by id
 *    tags: [Event]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: event id
 *    requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Event'
 *    responses:
 *      200:
 *        description: The event was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Event'
 *      404:
 *        description: event was not found
 *      500:
 *        description: Internal server error
 */
router.put("/:id", authenticateUser, updateEvent);
/**
 * @swagger
 * /api/event/{id}:
 *  delete:
 *    summary: remove event from array
 *    tags: [Event]
 *    parameters:
 *      - in: path
 *        name: id
 *        description: review id
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: The review was deleted
 *      404:
 *        description: The review was not found
 */
router.delete("/:id", authenticateUser, deleteEvent);

module.exports = router;
