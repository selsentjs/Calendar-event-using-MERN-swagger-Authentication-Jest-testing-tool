const Event = require("../Model/Calendar");

// get all the events
const getAllEvents = async (req, res) => {
  try {
    const event = await Event.find().populate("userId", "name");
    res.status(200).json({ event });
  } catch (err) {
    console.error("server error:", err);
    res.status(500).json({ msg: "server error", err });
  }
};

// get single events
const getSingleEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findOne({ _id: id });
    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }
    res.status(200).json({ event });
  } catch (err) {
    console.error("server error:", err);
    res.status(500).json({ msg: "server error", err });
  }
};

// create event
const createEvent = async (req, res) => {
  const { title, startTime, endTime, description, location, googleEventId } =
    req.body;
  const userId = req.user.userId; // Get user ID from the authenticated token
  // Validate event times
  if (new Date(startTime) >= new Date(endTime)) {
    return res.status(400).json({ msg: "Start time must be before end time" });
  }

  try {
    const event = await Event.create({
      title,
      startTime,
      endTime,
      description,
      location,
      googleEventId,
      userId,
    });

    res.status(200).json({ msg: "Event created", event });
  } catch (err) {
    console.error("server error:", err);
    res.status(500).json({ msg: "server error", err });
  }
};
// update event
const updateEvent = async (req, res) => {
  const { id } = req.params;
  try {
    // Use { new: true } to return the updated event, not the original one
    const event = await Event.findOneAndUpdate({ _id: id }, req.body, { new: true });
    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }
    res.status(200).json({ msg: "event updated", event });
  } catch (err) {
    console.error("server error:", err);
    res.status(500).json({ msg: "server error", err });
  }
};
// delete event
const deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findOneAndDelete({ _id: id }, req.body);
    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }
    res.status(200).json({ msg: "event deleted", event });
  } catch (err) {
    console.error("server error:", err);
    res.status(500).json({ msg: "server error", err });
  }
};

module.exports = {
  getAllEvents,
  getSingleEvent,
  createEvent,
  updateEvent,
  deleteEvent,
};
