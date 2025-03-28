import { useEffect, useState } from "react";
import axios from "axios";
import MoodCalendar from "../components/MoodCalendar";

const CalendarTab = () => {
  const [calendarData, setCalendarData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/calendar-history").then(res => {
      setCalendarData(res.data);
    });
  }, []);

  return (
    <div>
      <MoodCalendar data={calendarData} />
    </div>
  );
};

export default CalendarTab;
