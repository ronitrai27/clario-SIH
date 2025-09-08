/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { set } from "zod";

const localizer = momentLocalizer(moment);

const initialEvents = [
  {
    id: 1,
    title: "Meeting",
    start: moment().add(1, "days").set({ hour: 10, minute: 0 }).toDate(),
    end: moment().add(1, "days").set({ hour: 11, minute: 0 }).toDate(),
  },
];

export default function MyCalendar() {
  const [events, setEvents] = useState(initialEvents);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isOpenEvent, setIsOpenEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleSelectSlot = (slotInfo: any) => {
    console.log(slotInfo);
    setSelectedDate(slotInfo.start);
    setSelectedEvent(null);
    setIsOpenEvent(true);
  };

  const handleSelectEvent = (event: any) => {
    console.log(event);
    setSelectedDate(null);
    setSelectedEvent(event);
    setIsOpenEvent(true);
  };

  return (
    <div
      style={{ height: "95%", padding: "26px 5px" }}
      className="bg-gray-50 font-inter font-medium text-black rounded"
    >
      <Calendar
        selectable
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        style={{ height: "100%" }}
      />
    </div>
  );
}
