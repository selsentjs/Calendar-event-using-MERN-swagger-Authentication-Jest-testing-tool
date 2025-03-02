import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import { toast } from "react-toastify";
import axios from "axios";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./style.css";

// Custom Toolbar component for controlling views and navigation
const CustomToolbar = ({ onNavigate, onView, views, currentView, date }) => {
 
    // Get current month and year
  const monthYear = moment(date).format("MMMM YYYY");

    // Button common style for both left and right side buttons
  const buttonStyle = {
    padding: "7px",
    color: "white",
    borderRadius: "5px",
    marginRight: "5px",
    backgroundColor: "#007bff", 
    border: "none",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px",
        margin: "5px",
        alignItems: "center",
      }}
    >
      <div>
        <button style={buttonStyle} onClick={() => onNavigate("PREV")}>
          Back
        </button>
        <button style={buttonStyle} onClick={() => onNavigate("TODAY")}>
          Today
        </button>
        <button style={buttonStyle} onClick={() => onNavigate("NEXT")}>
          Next
        </button>
      </div>
      <div>
        <h3 style={{ color: "red" }}>{monthYear}</h3>
      </div>
      <div>
        <button
          onClick={() => onView(Views.MONTH)}
          style={{
            ...buttonStyle,
            fontWeight: currentView === Views.MONTH ? "bold" : "normal", // Highlight if active
          }}
        >
          Month
        </button>
        <button
          onClick={() => onView(Views.WEEK)}
          style={{
            ...buttonStyle,
            fontWeight: currentView === Views.WEEK ? "bold" : "normal", // Highlight if active
          }}
        >
          Week
        </button>
        <button
          onClick={() => onView(Views.DAY)}
          style={{
            ...buttonStyle,
            fontWeight: currentView === Views.DAY ? "bold" : "normal", // Highlight if active
          }}
        >
          Day
        </button>
      </div>
    </div>
  );
};

const DailyCalendar = () => {
  const [events, setEvents] = useState([]);
  const localizer = momentLocalizer(moment);

  // Fetch events for a particular date
  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You need to log in to view events.");
        return;
      }

      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/event`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          date: new Date().toISOString().split("T")[0], // Send today's date
        },
      });
      console.log("check:", response.data.event);
      const events = response.data.event.map((event) => ({
        ...event,
        startTime: new Date(event.startTime), // Convert to Date object
        endTime: new Date(event.endTime), // Convert to Date object
      }));

      setEvents(events);
    } catch (error) {
      toast.error("Failed to fetch events.");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const eventPropGetter = (event) => {
    return {
      style: {
        backgroundColor: "#ff8c00",
        color: "white",
        borderRadius: "5px",
        padding: "5px",
      },
    };
  };

  return (
    <div style={{ height: "100vh" }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="startTime"
        endAccessor="endTime"
        style={{ height: "100%" }}
        eventPropGetter={eventPropGetter}
        views={[Views.MONTH, Views.WEEK, Views.DAY]} 
        defaultView={Views.MONTH}
        defaultDate={new Date()}
        components={{
          toolbar: CustomToolbar, // Use the custom toolbar
        }}
      />
    </div>
  );
};

export default DailyCalendar;
