"use client";
import React from "react";
import { Calendar } from "@/components/ui/calendar";

const HomeCalendar = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="w-full ">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="w-full max-w-[280px] mx-auto rounded-md border shadow-sm font-sora "
        captionLayout="label"
      />
    </div>
  );
};

export default HomeCalendar;
