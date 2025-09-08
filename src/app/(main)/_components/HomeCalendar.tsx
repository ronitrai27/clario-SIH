"use client";
import React, { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { createClient } from "@/lib/supabase/client";
import { useUserData } from "@/context/UserDataProvider";
import { UserCalendarEvent } from "@/lib/types/allTypes";
import moment from "moment";

const getDatesInRange = (start: Date, end: Date): Date[] => {
  const dates: Date[] = [];
  let current = moment(start).startOf("day");
  const stop = moment(end).startOf("day");
  while (current.isSameOrBefore(stop)) {
    dates.push(current.toDate());
    current = current.add(1, "day");
  }
  return dates;
};

const HomeCalendar = () => {
  const { user } = useUserData();
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<UserCalendarEvent[]>([]);
  const [markedDates, setMarkedDates] = useState<Date[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("userCalendar")
        .select("*")
        .eq("user_id", user?.id);

      if (error) {
        console.error("Error fetching events:", error);
      } else if (data) {
        const mappedEvents = data.map((ev) => ({
          ...ev,
          start: new Date(ev.start_time),
          end: new Date(ev.end_time),
        }));
        setEvents(mappedEvents);

        // Compute all unique dates in event ranges
        const allDatesSet = new Set<string>();
        mappedEvents.forEach((event) => {
          getDatesInRange(event.start, event.end).forEach((d) => {
            allDatesSet.add(moment(d).format("YYYY-MM-DD"));
          });
        });
        const uniqueDates = Array.from(allDatesSet).map((d) => new Date(d));
        setMarkedDates(uniqueDates);
      }
    };

    if (user) fetchEvents();
  }, [user?.id]);

  return (
    <div className="w-full ">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="w-full max-w-[280px] mx-auto rounded-md border shadow-sm font-sora "
        captionLayout="label"
        modifiers={{ marked: markedDates }}
        modifiersStyles={{
          marked: {
            backgroundColor: "#1859FF",
            color: "white",
            borderRadius: "20%",
          },
         
        }}
      />
    </div>
  );
};

export default HomeCalendar;
