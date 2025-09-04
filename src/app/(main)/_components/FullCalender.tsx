// /* eslint-disable @typescript-eslint/no-explicit-any */
// // components/FullScreenCalendar.tsx
// import React, { useState, useEffect } from "react";
// import { Calendar, dateFnsLocalizer, Event, SlotInfo } from "react-big-calendar";
// import { format, parse, startOfWeek, getDay } from "date-fns";
// import { enUS } from "date-fns/locale/en-US";
// import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop"; // Import drag and drop addon
// import "react-big-calendar/lib/css/react-big-calendar.css"; // Import base styles
// import "react-big-calendar/lib/addons/dragAndDrop/styles.css"; // Import DND styles

// // Setup date-fns localizer
// const localizer = dateFnsLocalizer({
//   format,
//   parse,
//   startOfWeek,
//   getDay,
//   locales: { "en-US": enUS },
// });

// // Define event type (for TypeScript)
// interface MyEvent extends Event {
//   id: number;
//   desc?: string;
// }

// // Sample events
// const initialEvents: MyEvent[] = [
//   {
//     id: 1,
//     title: "Sample Event",
//     start: new Date(),
//     end: new Date(new Date().setHours(new Date().getHours() + 1)),
//     desc: "This is a sample description.",
//   },
// ];

// // Wrap Calendar with drag and drop functionality
// const DnDCalendar = withDragAndDrop(Calendar as any); // Use 'as any' to handle TypeScript compatibility

// const FullScreenCalendar: React.FC = () => {
//   const [events, setEvents] = useState<MyEvent[]>(initialEvents);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [currentEvent, setCurrentEvent] = useState<MyEvent | null>(null);
//   const [formTitle, setFormTitle] = useState("");
//   const [formDesc, setFormDesc] = useState("");
//   const [formStart, setFormStart] = useState("");
//   const [formEnd, setFormEnd] = useState("");

//   // Update form fields when modal opens
//   useEffect(() => {
//     if (modalOpen && currentEvent) {
//       setFormTitle(currentEvent.title || "");
//       setFormDesc(currentEvent.desc || "");
//       setFormStart(format(currentEvent.start || new Date(), "yyyy-MM-dd'T'HH:mm"));
//       setFormEnd(format(currentEvent.end || new Date(), "yyyy-MM-dd'T'HH:mm"));
//     }
//   }, [modalOpen, currentEvent]);

//   // Handler for selecting a slot to create new event
//   const handleSelectSlot = (slotInfo: SlotInfo) => {
//     const newEvent: MyEvent = {
//       id: Date.now(), // Unique ID
//       title: "",
//       start: slotInfo.start,
//       end: slotInfo.end,
//       desc: "",
//     };
//     setCurrentEvent(newEvent);
//     setModalOpen(true);
//   };

//   // Handler for selecting an existing event to edit
//   const handleSelectEvent = (event: MyEvent) => {
//     setCurrentEvent(event);
//     setModalOpen(true);
//   };

//   // Handler for saving event (create or update)
//   const handleSave = () => {
//     if (currentEvent) {
//       const updatedEvent: MyEvent = {
//         ...currentEvent,
//         title: formTitle,
//         desc: formDesc,
//         start: new Date(formStart),
//         end: new Date(formEnd),
//       };
//       if (events.some((ev) => ev.id === currentEvent.id)) {
//         // Update existing
//         setEvents(
//           events.map((ev) => (ev.id === currentEvent.id ? updatedEvent : ev))
//         );
//       } else {
//         // Create new
//         setEvents([...events, updatedEvent]);
//       }
//     }
//     setModalOpen(false);
//   };

//   // Handler for deleting event
//   const handleDelete = () => {
//     if (currentEvent) {
//       setEvents(events.filter((ev) => ev.id !== currentEvent.id));
//     }
//     setModalOpen(false);
//   };

//   // Handler for closing modal without saving
//   const handleClose = () => {
//     setModalOpen(false);
//   };

//   // Check if the current event is existing (for showing delete button)
//   const isExisting = currentEvent
//     ? events.some((ev) => ev.id === currentEvent.id)
//     : false;

//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-50 overflow-hidden">
//       <div
//         style={{
//           height: "90vh",
//           width: "80vw",
//           padding: "10px",
//           boxSizing: "border-box",
//         }}
//       >
//         <DnDCalendar
//           localizer={localizer}
//           events={events}
//           startAccessor="start"
//           endAccessor="end"
//           style={{ height: "100%" }}
//           views={["month", "week", "day", "agenda"]}
//           defaultView="month"
//           draggableAccessor={() => true} // Make all events draggable
//           onEventDrop={(data) => {
//             const { event, start, end } = data;
//             const updatedEvents = events.map((ev) =>
//               ev.id === event.id ? { ...ev, start, end } : ev
//             );
//             setEvents(updatedEvents);
//           }}
//           onEventResize={(data) => {
//             const { event, start, end } = data;
//             const updatedEvents = events.map((ev) =>
//               ev.id === event.id ? { ...ev, start, end } : ev
//             );
//             setEvents(updatedEvents);
//           }}
//           resizable
//           selectable
//           onSelectSlot={handleSelectSlot}
//           onSelectEvent={handleSelectEvent}
//           tooltipAccessor={(event: MyEvent) => event.desc || ""} // Show description on hover
//         />
//       </div>

//       {/* Simple Modal for Create/Edit */}
//       {modalOpen && (
//         <div
//           className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
//           onClick={handleClose} // Close on outside click
//         >
//           <div
//             className="bg-white p-6 rounded-lg shadow-lg w-96"
//             onClick={(e) => e.stopPropagation()} // Prevent close on inside click
//           >
//             <h2 className="text-xl font-bold mb-4">
//               {isExisting ? "Edit Event" : "Create Event"}
//             </h2>
//             <div className="mb-4">
//               <label className="block text-sm font-medium">Title</label>
//               <input
//                 type="text"
//                 value={formTitle}
//                 onChange={(e) => setFormTitle(e.target.value)}
//                 className="w-full border p-2 rounded"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium">Description</label>
//               <textarea
//                 value={formDesc}
//                 onChange={(e) => setFormDesc(e.target.value)}
//                 className="w-full border p-2 rounded"
//                 rows={3}
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium">Start</label>
//               <input
//                 type="datetime-local"
//                 value={formStart}
//                 onChange={(e) => setFormStart(e.target.value)}
//                 className="w-full border p-2 rounded"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium">End</label>
//               <input
//                 type="datetime-local"
//                 value={formEnd}
//                 onChange={(e) => setFormEnd(e.target.value)}
//                 className="w-full border p-2 rounded"
//               />
//             </div>
//             <div className="flex justify-end space-x-2">
//               <button
//                 onClick={handleClose}
//                 className="px-4 py-2 bg-gray-200 rounded"
//               >
//                 Cancel
//               </button>
//               {isExisting && (
//                 <button
//                   onClick={handleDelete}
//                   className="px-4 py-2 bg-red-500 text-white rounded"
//                 >
//                   Delete
//                 </button>
//               )}
//               <button
//                 onClick={handleSave}
//                 className="px-4 py-2 bg-blue-500 text-white rounded"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FullScreenCalendar;