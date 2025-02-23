import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RegisterPage from "./CreateEvent-using-big-calendar/RegisterPage";
import LoginPage from "./CreateEvent-using-big-calendar/LoginPage";
import CreateEventPage from "./CreateEvent-using-big-calendar/CreateEventPage";
import DailyCalendar from "./CreateEvent-using-big-calendar/DailyCalendar";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create-event" element={<CreateEventPage />} />
        <Route path="/calendar" element={<DailyCalendar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
