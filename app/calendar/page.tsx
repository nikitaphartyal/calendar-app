// "use client";

// import { ChevronLeft, ChevronRight, Sun, Moon } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";

// export default function Calendar() {
//   const [showForm, setShowForm] = useState(false);
//   const [showEditForm, setShowEditForm] = useState(false);
//   const [eventTitle, setEventTitle] = useState("");
//   const [eventDate, setEventDate] = useState("");
//   const [eventDescription, setEventDescription] = useState("");
//   const [eventEndDate, setEventEndDate] = useState("");
//   const [month, setMonth] = useState(new Date().getMonth());
//   const [year, setYear] = useState(new Date().getFullYear());
//   const [events, setEvents] = useState<{ [key: string]: any }>({});
//   const [editEventKey, setEditEventKey] = useState<string | null>(null);
//   const [filter, setFilter] = useState("all"); // Default to "all" instead of "global"
//   const { data: session, status } = useSession();
//   // Add theme state
//   const [isDarkTheme, setIsDarkTheme] = useState(true);

//   const currentDate = new Date();
//   const today = currentDate.getDate();
//   const currentMonth = currentDate.getMonth();
//   const currentYear = currentDate.getFullYear();

//   useEffect(() => {
//     if (status === "authenticated" && session?.user) {
//       fetchEvents();
//     }
//   }, [month, year, session, status, filter]);

//   const fetchEvents = async () => {
//     if (!session?.user) return;

//     try {
//       // Fix: Change '/api/calendar' to '/api' to match the route.ts file location
//       const response = await fetch(`/api?datetime-local=${year}-${month + 1}-01`);
//       if (response.ok) {
//         const data = await response.json();
        
//         // Process events based on role and filter
//         const filteredEvents = data.reduce((acc, event) => {
//           const isUserEvent = event.createdBy === session.user.id.toString();
//           const isGlobalEvent = event.visibility === "global";
          
//           // Filter based on selected filter option
//           if (
//             (filter === "all") ||
//             (filter === "global" && isGlobalEvent) ||
//             (filter === "private" && isUserEvent)
//           ) {
//             // Store event by date
//             const dateKey = event.eventDate.split("T")[0];
            
//             // If we already have an event for this date, create an array
//             if (acc[dateKey]) {
//               if (Array.isArray(acc[dateKey])) {
//                 acc[dateKey].push(event);
//               } else {
//                 acc[dateKey] = [acc[dateKey], event];
//               }
//             } else {
//               acc[dateKey] = event;
//             }
//           }
//           return acc;
//         }, {});
        
//         setEvents(filteredEvents);
//       } else {
//         console.error("Error fetching events:", response.status);
//       }
//     } catch (error) {
//       console.error("Error fetching events:", error);
//     }
//   };
  
//   const convertUTCToLocal = (utcDateString: string) => {
//     if (!utcDateString) return "";
//     const date = new Date(utcDateString);
//     return date.toISOString().slice(0, 16);
//   };

//   const handleAddEvent = async () => {
//     if (eventTitle && eventDate) {
//       const newEvent = {
//         title: eventTitle,
//         eventDate: new Date(eventDate).toISOString(),
//         description: eventDescription,
//         endDate: eventEndDate ? new Date(eventEndDate).toISOString() : null,
//         visibility: session?.user?.role === "teacher" ? "global" : "private",
//         createdBy: session?.user?.id,
//       };
  
//       const response = await fetch("/api", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(newEvent),
//       });
  
//       if (response.ok) {
//         const savedEvent = await response.json();
//         setEvents((prev) => {
//           const dateKey = savedEvent.eventDate.split("T")[0];
//           return { ...prev, [dateKey]: savedEvent };
//         });
        
//         // Refresh events after adding
//         fetchEvents();
//       }
  
//       setShowForm(false);
//       setEventTitle("");
//       setEventDate("");
//       setEventDescription("");
//       setEventEndDate("");
//     }
//   };
  
//   const handleEditEvent = async () => {
//     if (eventTitle && eventDate && editEventKey) {
//       const updatedEvent = {
//         title: eventTitle,
//         eventDate,
//         description: eventDescription,
//         endDate: eventEndDate || "",
//       };
  
//       const response = await fetch(`/api/${editEventKey}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updatedEvent),
//       });
  
//       if (response.ok) {
//         // Refresh events after updating
//         fetchEvents();
//       }
  
//       setShowEditForm(false);
//       setEventTitle("");
//       setEventDate("");
//       setEventDescription("");
//       setEventEndDate("");
//       setEditEventKey(null);
//     }
//   };
  
//   const handleDeleteEvent = async () => {
//     if (editEventKey) {
//       console.log("Sending DELETE request for event ID:", editEventKey);
  
//       const response = await fetch(`/api/${editEventKey}`, {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//       });
  
//       if (response.ok) {
//         // Refresh events after deleting
//         fetchEvents();
//       } else {
//         const errorData = await response.json();
//         console.error("Error deleting event:", errorData);
//       }
  
//       setShowEditForm(false);
//       setEditEventKey(null);
//     }
//   };
    
//   const nextMonth = () => {
//     if (month === 11) {
//       setMonth(0);
//       setYear((prevYear) => prevYear + 1);
//     } else {
//       setMonth((prevMonth) => prevMonth + 1);
//     }
//   };
    
//   const prevMonth = () => {
//     if (month === 0) {
//       setMonth(11);
//       setYear((prevYear) => prevYear - 1);
//     } else {
//       setMonth((prevMonth) => prevMonth - 1);
//     }
//   };
    
//   const monthNames = [
//     "January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December"
//   ];

//   const daysInMonth = new Date(year, month + 1, 0).getDate();
//   const firstDayIndex = new Date(year, month, 1).getDay();

//   const handleEventClick = (dateKey: string, eventId?: string) => {
//     let eventToEdit;
    
//     if (events[dateKey]) {
//       if (Array.isArray(events[dateKey])) {
//         // If multiple events, find the one with matching ID
//         eventToEdit = events[dateKey].find(e => e.id === eventId);
//       } else {
//         // Single event
//         eventToEdit = events[dateKey];
//       }
      
//       if (eventToEdit) {
//         setEventTitle(eventToEdit.title || "");
//         setEventDate(convertUTCToLocal(eventToEdit.eventDate));
//         setEventEndDate(convertUTCToLocal(eventToEdit.endDate));
//         setEventDescription(eventToEdit.description || "");
//         setEditEventKey(eventToEdit.id);
//         setShowEditForm(true);
//       }
//     }
//   };

//   const handleNewEventClick = () => {
//     setShowForm(true);
//     setShowEditForm(false);
//     setEventTitle("");
//     setEventDate("");
//     setEventDescription("");
//     setEventEndDate("");
//     setEditEventKey(null);
//   };

//   const getRoleSpecificClass = (event) => {
//     const isUserEvent = event.createdBy === session?.user?.id.toString();
//     const isGlobalEvent = event.visibility === "global";
    
//     if (isUserEvent) {
//       return "bg-blue-500 text-white"; // User's own events
//     } else if (isGlobalEvent) {
//       return "bg-yellow-500 text-black"; // Global events (teacher events)
//     }
//     return "bg-gray-500 text-white"; // Default
//   };

//   const renderEventIndicator = (dateKey) => {
//     if (!events[dateKey]) return null;
    
//     if (Array.isArray(events[dateKey])) {
//       return (
//         <div className="flex flex-col gap-1 mt-1 w-full">
//           {events[dateKey].slice(0, 2).map((event, i) => (
//             <div 
//               key={event.id}
//               className={`text-xs px-1 py-0.5 rounded truncate w-full ${getRoleSpecificClass(event)}`}
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleEventClick(dateKey, event.id);
//               }}
//             >
//               {event.title}
//             </div>
//           ))}
//           {events[dateKey].length > 2 && (
//             <div className="text-xs text-gray-400 text-center">
//               +{events[dateKey].length - 2} more
//             </div>
//           )}
//         </div>
//       );
//     } else {
//       return (
//         <div 
//           className={`text-xs px-1 py-0.5 rounded mt-1 truncate w-full ${getRoleSpecificClass(events[dateKey])}`}
//           onClick={(e) => {
//             e.stopPropagation();
//             handleEventClick(dateKey);
//           }}
//         >
//           {events[dateKey].title}
//         </div>
//       );
//     }
//   };

//   // Toggle theme function
//   const toggleTheme = () => {
//     setIsDarkTheme(!isDarkTheme);
//   };

//   // Theme-specific styles
//   const themeStyles = {
//     container: isDarkTheme 
//       ? "bg-black text-white" 
//       : "bg-white text-gray-800",
//     button: isDarkTheme 
//       ? "bg-blue-500 text-white" 
//       : "bg-blue-600 text-white",
//     deleteButton: isDarkTheme 
//       ? "bg-red-500 text-white" 
//       : "bg-red-600 text-white",
//     cancelButton: isDarkTheme 
//       ? "bg-gray-500 text-white" 
//       : "bg-gray-400 text-white",
//     modal: isDarkTheme 
//       ? "bg-gray-800 text-white" 
//       : "bg-white text-gray-800",
//     input: isDarkTheme 
//       ? "bg-gray-700 text-white border-gray-600" 
//       : "bg-gray-100 text-gray-800 border-gray-300",
//     calendarGrid: isDarkTheme 
//       ? "border-gray-500" 
//       : "border-gray-300",
//     calendarDay: isDarkTheme 
//       ? "border-gray-500" 
//       : "border-gray-300",
//     todayHighlight: isDarkTheme 
//       ? "bg-blue-900" 
//       : "bg-blue-100",
//     hasEventsHighlight: isDarkTheme 
//       ? "bg-gray-800" 
//       : "bg-gray-100",
//     navButton: isDarkTheme 
//       ? "text-gray-400 hover:text-white" 
//       : "text-gray-600 hover:text-gray-800",
//   };

//   return (
//     <div className={`w-full min-h-screen p-6 ${themeStyles.container}`}>
//       <div className="flex flex-col gap-4 mb-6">
//         <div className="flex items-center justify-between">
//           <button onClick={prevMonth} className={themeStyles.navButton} title="Previous Month">
//             <ChevronLeft size={24} />
//           </button>

//           <h1 className="text-2xl font-bold flex-1 text-center">
//             {monthNames[month]} {year}
//           </h1>

//           <div className="flex items-center gap-4">
//             {/* Theme toggle button */}
//             <button 
//               onClick={toggleTheme}
//               className={`p-2 rounded-full ${isDarkTheme ? 'bg-yellow-400' : 'bg-gray-700'}`}
//               title={isDarkTheme ? "Switch to Light Theme" : "Switch to Dark Theme"}
//             >
//               {isDarkTheme ? <Sun size={20} color="black" /> : <Moon size={20} color="white" />}
//             </button>

            
//             <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button className={`${themeStyles.button} ${themeStyles.dropdownText}`}>
//                     {filter === "all" ? "All Events" : 
//                      filter === "global" ? "Global Events" : "My Events"}
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent className={!isDarkTheme ? "text-black" : ""}>
//                   <DropdownMenuItem onClick={() => setFilter("all")} className={!isDarkTheme ? "text-black" : ""}>
//                     All Events
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => setFilter("global")} className={!isDarkTheme ? "text-black" : ""}>
//                     Global Events
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => setFilter("private")} className={!isDarkTheme ? "text-black" : ""}>
//                     My Events
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>

//             <button className={`px-4 py-2 rounded-lg ${themeStyles.button}`} onClick={handleNewEventClick}>
//               New Event
//             </button>

//             <button onClick={nextMonth} className={themeStyles.navButton} title="Next Month">
//               <ChevronRight size={24} />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Calendar legend */}
//       <div className="flex gap-4 mb-4 justify-end">
//         {(filter === "all" || filter === "private") && (
//           <div className="flex items-center gap-1">
//             <div className="w-3 h-3 bg-blue-500 rounded"></div>
//             <span className="text-sm">My Events</span>
//           </div>
//         )}
//         {(filter === "all" || filter === "global") && (
//           <div className="flex items-center gap-1">
//             <div className="w-3 h-3 bg-yellow-500 rounded"></div>
//             <span className="text-sm">Global Events</span>
//           </div>
//         )}
//       </div>

//       <div className={`grid grid-cols-7 gap-2 border-t pt-2 w-full ${themeStyles.calendarGrid}`}>
//         {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
//           <div key={day} className={`text-center font-semibold py-2 border-b ${themeStyles.calendarGrid}`}>{day}</div>
//         ))}

//         {Array(firstDayIndex).fill(null).map((_, index) => (
//           <div key={`empty-${index}`} className="h-24"></div>
//         ))}

//         {Array.from({ length: daysInMonth }).map((_, i) => {
//           const day = i + 1;
//           const dateKey = `${year}-${(month + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
//           const isToday = day === today && month === currentMonth && year === currentYear;
//           const hasEvents = events[dateKey] !== undefined;
          
//           return (
//             <div
//               key={dateKey}
//               className={`min-h-24 border p-1 flex flex-col cursor-pointer relative
//                 ${themeStyles.calendarDay}
//                 ${isToday ? themeStyles.todayHighlight : ""}
//                 ${hasEvents ? themeStyles.hasEventsHighlight : ""}
//               `}
//               onClick={() => hasEvents && handleEventClick(dateKey)}
//             >
//               <span className={`text-sm ${isToday ? "bg-white text-black rounded-full w-6 h-6 flex items-center justify-center" : ""}`}>
//                 {day}
//               </span>
//               {renderEventIndicator(dateKey)}
//             </div>
//           );
//         })}
//       </div>

//       {showForm && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
//           <div className={`p-6 rounded-lg w-96 ${themeStyles.modal}`}>
//             <h2 className="text-lg font-semibold mb-4">
//               {session?.user?.role === "teacher" 
//                 ? "Add New Global Event" 
//                 : "Add New Private Event"}
//             </h2>

//             <label className="block mb-2" htmlFor="event-title">
//               Event Title:
//             </label>
//             <input
//               id="event-title"
//               type="text"
//               className={`w-full p-2 mb-4 border rounded ${themeStyles.input}`}
//               value={eventTitle}
//               onChange={(e) => setEventTitle(e.target.value)}
//               placeholder="Add event"
//             />

//             <label className="block mb-2" htmlFor="event-date">
//               Event Date:
//             </label>
//             <input
//               id="event-date"
//               type="datetime-local"
//               className={`w-full p-2 mb-4 border rounded ${themeStyles.input}`}
//               value={eventDate}
//               onChange={(e) => setEventDate(e.target.value)}
//             />

//             <label className="block mb-2" htmlFor="event-description">
//               Event Description:
//             </label>
//             <textarea
//               id="event-description"
//               className={`w-full p-2 mb-4 border rounded ${themeStyles.input}`}
//               value={eventDescription}
//               onChange={(e) => setEventDescription(e.target.value)}
//               placeholder="Add a description"
//               rows={3}
//             />

//             <label className="block mb-2" htmlFor="event-end-date">
//               Event End Date (Optional):
//             </label>
//             <input
//               id="event-end-date"
//               type="datetime-local"
//               className={`w-full p-2 mb-4 border rounded ${themeStyles.input}`}
//               value={eventEndDate}
//               onChange={(e) => setEventEndDate(e.target.value)}
//             />

//             <div className="flex justify-between">
//               <button
//                 className={`px-4 py-2 rounded-lg ${themeStyles.button}`}
//                 onClick={handleAddEvent}
//               >
//                 Save Event
//               </button>
//               <button
//                 className={`px-4 py-2 rounded-lg ${themeStyles.cancelButton}`}
//                 onClick={() => setShowForm(false)}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showEditForm && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
//           <div className={`p-6 rounded-lg w-96 ${themeStyles.modal}`}>
//             <h2 className="text-lg font-semibold mb-4">Edit Event</h2>

//             <label className="block mb-2" htmlFor="edit-event-title">
//               Event Title:
//             </label>
//             <input
//               id="edit-event-title"
//               type="text"
//               className={`w-full p-2 mb-4 border rounded ${themeStyles.input}`}
//               value={eventTitle}
//               onChange={(e) => setEventTitle(e.target.value)}
//             />

//             <label className="block mb-2" htmlFor="edit-event-date">
//               Event Date:
//             </label>
//             <input
//               id="edit-event-date"
//               type="datetime-local"
//               className={`w-full p-2 mb-4 border rounded ${themeStyles.input}`}
//               value={eventDate}
//               onChange={(e) => setEventDate(e.target.value)}
//             />

//             <label className="block mb-2" htmlFor="edit-event-description">
//               Event Description:
//             </label>
//             <textarea
//               id="edit-event-description"
//               className={`w-full p-2 mb-4 border rounded ${themeStyles.input}`}
//               value={eventDescription}
//               onChange={(e) => setEventDescription(e.target.value)}
//               placeholder="Update description"
//               rows={3}
//             />

//             <label className="block mb-2" htmlFor="edit-event-end-date">
//               Event End Date (Optional):
//             </label>
//             <input
//               id="edit-event-end-date"
//               type="datetime-local"
//               className={`w-full p-2 mb-4 border rounded ${themeStyles.input}`}
//               value={eventEndDate}
//               onChange={(e) => setEventEndDate(e.target.value)}
//             />

//             <div className="flex justify-between gap-2">
//               <button
//                 className={`px-4 py-2 rounded-lg flex-1 ${themeStyles.button}`}
//                 onClick={handleEditEvent}
//               >
//                 Save Changes
//               </button>
//               <button
//                 className={`px-4 py-2 rounded-lg flex-1 ${themeStyles.deleteButton}`}
//                 onClick={handleDeleteEvent}
//               >
//                 Delete Event
//               </button>
//               <button
//                 className={`px-4 py-2 rounded-lg ${themeStyles.cancelButton}`}
//                 onClick={() => setShowEditForm(false)}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { ChevronLeft, ChevronRight, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function Calendar() {
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showViewEventModal, setShowViewEventModal] = useState(false); // New state for view-only modal
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [events, setEvents] = useState<{ [key: string]: any }>({});
  const [editEventKey, setEditEventKey] = useState<string | null>(null);
  const [currentViewEvent, setCurrentViewEvent] = useState<any>(null); // For view-only event details
  const [filter, setFilter] = useState("all"); // Default to "all" instead of "global"
  const { data: session, status } = useSession();
  // Add theme state
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  const currentDate = new Date();
  const today = currentDate.getDate();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      fetchEvents();
    }
  }, [month, year, session, status, filter]);

  const fetchEvents = async () => {
    if (!session?.user) return;

    try {
      // Fix: Change '/api/calendar' to '/api' to match the route.ts file location
      const response = await fetch(`/api?datetime-local=${year}-${month + 1}-01`);
      if (response.ok) {
        const data = await response.json();
        
        // Process events based on role and filter
        const filteredEvents = data.reduce((acc, event) => {
          const isUserEvent = event.createdBy === session.user.id.toString();
          const isGlobalEvent = event.visibility === "global";
          
          // Determine if this event should be shown based on filter
          const shouldShow = 
            // Always show user's own events
            isUserEvent || 
            // Show global events when not filtering for private events
            (isGlobalEvent && filter !== "private");
          
          if (shouldShow) {
            // Store event by date
            const dateKey = event.eventDate.split("T")[0];
            
            // If we already have an event for this date, create an array
            if (acc[dateKey]) {
              if (Array.isArray(acc[dateKey])) {
                acc[dateKey].push(event);
              } else {
                acc[dateKey] = [acc[dateKey], event];
              }
            } else {
              acc[dateKey] = event;
            }
          }
          return acc;
        }, {});
        
        setEvents(filteredEvents);
      } else {
        console.error("Error fetching events:", response.status);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };
  
  const convertUTCToLocal = (utcDateString: string) => {
    if (!utcDateString) return "";
    const date = new Date(utcDateString);
    return date.toISOString().slice(0, 16);
  };

  // Format date for display in the view modal
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Format date for more user-friendly display
  const formatEventDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format time only
  const formatEventTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const handleAddEvent = async () => {
    if (eventTitle && eventDate) {
      const newEvent = {
        title: eventTitle,
        eventDate: new Date(eventDate).toISOString(),
        description: eventDescription,
        endDate: eventEndDate ? new Date(eventEndDate).toISOString() : null,
        visibility: session?.user?.role === "teacher" ? "global" : "private",
        createdBy: session?.user?.id,
      };
  
      const response = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });
  
      if (response.ok) {
        const savedEvent = await response.json();
        setEvents((prev) => {
          const dateKey = savedEvent.eventDate.split("T")[0];
          return { ...prev, [dateKey]: savedEvent };
        });
        
        // Refresh events after adding
        fetchEvents();
      }
  
      setShowForm(false);
      setEventTitle("");
      setEventDate("");
      setEventDescription("");
      setEventEndDate("");
    }
  };
  
  const handleEditEvent = async () => {
    if (eventTitle && eventDate && editEventKey) {
      const updatedEvent = {
        title: eventTitle,
        eventDate,
        description: eventDescription,
        endDate: eventEndDate || "",
      };
  
      const response = await fetch(`/api/${editEventKey}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedEvent),
      });
  
      if (response.ok) {
        // Refresh events after updating
        fetchEvents();
      }
  
      setShowEditForm(false);
      setEventTitle("");
      setEventDate("");
      setEventDescription("");
      setEventEndDate("");
      setEditEventKey(null);
    }
  };
  
  const handleDeleteEvent = async () => {
    if (editEventKey) {
      console.log("Sending DELETE request for event ID:", editEventKey);
  
      const response = await fetch(`/api/${editEventKey}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
  
      if (response.ok) {
        // Refresh events after deleting
        fetchEvents();
      } else {
        const errorData = await response.json();
        console.error("Error deleting event:", errorData);
      }
  
      setShowEditForm(false);
      setEditEventKey(null);
    }
  };
    
  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((prevYear) => prevYear + 1);
    } else {
      setMonth((prevMonth) => prevMonth + 1);
    }
  };
    
  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((prevYear) => prevYear - 1);
    } else {
      setMonth((prevMonth) => prevMonth - 1);
    }
  };
    
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const handleEventClick = (dateKey: string, eventId?: string) => {
    let eventToHandle;
    
    if (events[dateKey]) {
      if (Array.isArray(events[dateKey])) {
        // If multiple events, find the one with matching ID
        eventToHandle = events[dateKey].find(e => e.id === eventId);
      } else {
        // Single event
        eventToHandle = events[dateKey];
      }
      
      if (eventToHandle) {
        // Check if this is a global event and user is a student
        const isGlobalEvent = eventToHandle.visibility === "global";
        const isUserEvent = eventToHandle.createdBy === session?.user?.id.toString();
        const isStudent = session?.user?.role !== "teacher";
        
        if (isGlobalEvent && isStudent && !isUserEvent) {
          // For students viewing global events, show view-only modal
          setCurrentViewEvent(eventToHandle);
          setShowViewEventModal(true);
        } else {
          // For teachers or user's own events, show edit form
          setEventTitle(eventToHandle.title || "");
          setEventDate(convertUTCToLocal(eventToHandle.eventDate));
          setEventEndDate(convertUTCToLocal(eventToHandle.endDate));
          setEventDescription(eventToHandle.description || "");
          setEditEventKey(eventToHandle.id);
          setShowEditForm(true);
        }
      }
    }
  };

  const handleNewEventClick = () => {
    setShowForm(true);
    setShowEditForm(false);
    setEventTitle("");
    setEventDate("");
    setEventDescription("");
    setEventEndDate("");
    setEditEventKey(null);
  };

  const getRoleSpecificClass = (event) => {
    const isUserEvent = event.createdBy === session?.user?.id.toString();
    const isGlobalEvent = event.visibility === "global";
    
    if (isUserEvent) {
      return "bg-blue-500 text-white"; // User's own events
    } else if (isGlobalEvent) {
      return "bg-yellow-500 text-black"; // Global events (teacher events)
    }
    return "bg-gray-500 text-white"; // Default
  };

  const renderEventIndicator = (dateKey) => {
    if (!events[dateKey]) return null;
    
    if (Array.isArray(events[dateKey])) {
      return (
        <div className="flex flex-col gap-1 mt-1 w-full">
          {events[dateKey].slice(0, 2).map((event, i) => (
            <div 
              key={event.id}
              className={`text-xs px-1 py-0.5 rounded truncate w-full ${getRoleSpecificClass(event)}`}
              onClick={(e) => {
                e.stopPropagation();
                handleEventClick(dateKey, event.id);
              }}
            >
              {event.title}
            </div>
          ))}
          {events[dateKey].length > 2 && (
            <div className="text-xs text-gray-400 text-center">
              +{events[dateKey].length - 2} more
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div 
          className={`text-xs px-1 py-0.5 rounded mt-1 truncate w-full ${getRoleSpecificClass(events[dateKey])}`}
          onClick={(e) => {
            e.stopPropagation();
            handleEventClick(dateKey);
          }}
        >
          {events[dateKey].title}
        </div>
      );
    }
  };

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  // Theme-specific styles
  const themeStyles = {
    container: isDarkTheme 
      ? "bg-black text-white" 
      : "bg-white text-gray-800",
    button: isDarkTheme 
      ? "bg-blue-500 text-white" 
      : "bg-blue-600 text-white",
    deleteButton: isDarkTheme 
      ? "bg-red-500 text-white" 
      : "bg-red-600 text-white",
    cancelButton: isDarkTheme 
      ? "bg-gray-500 text-white" 
      : "bg-gray-400 text-white",
    modal: isDarkTheme 
      ? "bg-gray-800 text-white" 
      : "bg-white text-gray-800",
    input: isDarkTheme 
      ? "bg-gray-700 text-white border-gray-600" 
      : "bg-gray-100 text-gray-800 border-gray-300",
    calendarGrid: isDarkTheme 
      ? "border-gray-500" 
      : "border-gray-300",
    calendarDay: isDarkTheme 
      ? "border-gray-500" 
      : "border-gray-300",
    todayHighlight: isDarkTheme 
      ? "bg-blue-900" 
      : "bg-blue-100",
    hasEventsHighlight: isDarkTheme 
      ? "bg-gray-800" 
      : "bg-gray-100",
    navButton: isDarkTheme 
      ? "text-gray-400 hover:text-white" 
      : "text-gray-600 hover:text-gray-800",
  };

  return (
    <div className={`w-full min-h-screen p-6 ${themeStyles.container}`}>
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <button onClick={prevMonth} className={themeStyles.navButton} title="Previous Month">
            <ChevronLeft size={24} />
          </button>

          <h1 className="text-2xl font-bold flex-1 text-center">
            {monthNames[month]} {year}
          </h1>

          <div className="flex items-center gap-4">
            {/* Theme toggle button */}
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full ${isDarkTheme ? 'bg-yellow-400' : 'bg-gray-700'}`}
              title={isDarkTheme ? "Switch to Light Theme" : "Switch to Dark Theme"}
            >
              {isDarkTheme ? <Sun size={20} color="black" /> : <Moon size={20} color="white" />}
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className={`${themeStyles.button} ${themeStyles.dropdownText}`}>
                  {filter === "all" ? "All Events" : 
                   filter === "global" ? "Global Events" : "My Events"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className={!isDarkTheme ? "text-black" : ""}>
                <DropdownMenuItem onClick={() => setFilter("all")} className={!isDarkTheme ? "text-black" : ""}>
                  All Events
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("global")} className={!isDarkTheme ? "text-black" : ""}>
                  Global Events
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("private")} className={!isDarkTheme ? "text-black" : ""}>
                  My Events
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Only show New Event button if not a student or if they're allowed to create events */}
            <button className={`px-4 py-2 rounded-lg ${themeStyles.button}`} onClick={handleNewEventClick}>
              New Event
            </button>

            <button onClick={nextMonth} className={themeStyles.navButton} title="Next Month">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar legend */}
      <div className="flex gap-4 mb-4 justify-end">
        {(filter === "all" || filter === "private") && (
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-sm">My Events</span>
          </div>
        )}
        {(filter === "all" || filter === "global") && (
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-sm">Global Events</span>
          </div>
        )}
      </div>

      <div className={`grid grid-cols-7 gap-2 border-t pt-2 w-full ${themeStyles.calendarGrid}`}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className={`text-center font-semibold py-2 border-b ${themeStyles.calendarGrid}`}>{day}</div>
        ))}

        {Array(firstDayIndex).fill(null).map((_, index) => (
          <div key={`empty-${index}`} className="h-24"></div>
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateKey = `${year}-${(month + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
          const isToday = day === today && month === currentMonth && year === currentYear;
          const hasEvents = events[dateKey] !== undefined;
          
          return (
            <div
              key={dateKey}
              className={`min-h-24 border p-1 flex flex-col cursor-pointer relative
                ${themeStyles.calendarDay}
                ${isToday ? themeStyles.todayHighlight : ""}
                ${hasEvents ? themeStyles.hasEventsHighlight : ""}
              `}
              onClick={() => hasEvents && handleEventClick(dateKey)}
            >
              <span className={`text-sm ${isToday ? "bg-white text-black rounded-full w-6 h-6 flex items-center justify-center" : ""}`}>
                {day}
              </span>
              {renderEventIndicator(dateKey)}
            </div>
          );
        })}
      </div>

      {/* Modified View-only event modal for students viewing global events - with date beside event details */}
      {showViewEventModal && currentViewEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowViewEventModal(false)}></div>
          <div className="relative bg-gray-800 rounded-lg shadow-lg w-96 overflow-hidden">
            {/* Color indicator at top */}
            <div className="h-2 bg-yellow-500 w-full"></div>
            
            <div className={`p-6 ${themeStyles.modal}`}>
              <h2 className="text-xl font-bold mb-4">{currentViewEvent.title}</h2>
              
              {/* Event date and time - in horizontal layout */}
              <div className="flex items-center mb-4 border-b pb-3 border-gray-700">
                <div className="w-6 h-6 mr-2 flex items-center justify-center">
                  <span>📅</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">{formatEventDate(currentViewEvent.eventDate)}</p>
                    <p className="text-sm">{formatEventTime(currentViewEvent.eventDate)}</p>
                  </div>
                  
                  {currentViewEvent.endDate && (
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm font-medium">Ends: {formatEventDate(currentViewEvent.endDate)}</p>
                      <p className="text-sm">{formatEventTime(currentViewEvent.endDate)}</p>
                    </div>
                  )}
                </div>
              </div>
                            
              {currentViewEvent.description && (
                <div className="mt-4 pt-3 border-t border-gray-700">
                  <h3 className="text-sm font-semibold mb-2">Description:</h3>
                  <p className="text-sm whitespace-pre-wrap">{currentViewEvent.description}</p>
                </div>
              )}
              
              <div className="mt-6 flex justify-end">
                <button
                  className={`px-4 py-2 rounded-lg ${themeStyles.button}`}
                  onClick={() => setShowViewEventModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className={`p-6 rounded-lg w-96 ${themeStyles.modal}`}>
            <h2 className="text-lg font-semibold mb-4">
              {session?.user?.role === "teacher" 
                ? "Add New Event" 
                : "Add New Event"}
            </h2>

            <label className="block mb-2" htmlFor="event-title">
              Event Title:
            </label>
            <input
              id="event-title"
              type="text"
              className={`w-full p-2 mb-4 border rounded ${themeStyles.input}`}
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="Add event"
            />

            <label className="block mb-2" htmlFor="event-date">
              Event Date:
            </label>
            <input
              id="event-date"
              type="datetime-local"
              className={`w-full p-2 mb-4 border rounded ${themeStyles.input}`}
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />

            <label className="block mb-2" htmlFor="event-description">
              Event Description:
            </label>
            <textarea
              id="event-description"
              className={`w-full p-2 mb-4 border rounded ${themeStyles.input}`}
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              placeholder="Add a description"
              rows={3}
            />

            <label className="block mb-2" htmlFor="event-end-date">
              Event End Date (Optional):
            </label>
            <input
              id="event-end-date"
              type="datetime-local"
              className={`w-full p-2 mb-4 border rounded ${themeStyles.input}`}
              value={eventEndDate}
              onChange={(e) => setEventEndDate(e.target.value)}
            />

            <div className="flex justify-between">
              <button
                className={`px-4 py-2 rounded-lg ${themeStyles.button}`}
                onClick={handleAddEvent}
              >
                Save Event
              </button>
              <button
                className={`px-4 py-2 rounded-lg ${themeStyles.cancelButton}`}
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className={`p-6 rounded-lg w-96 ${themeStyles.modal}`}>
            <h2 className="text-lg font-semibold mb-4">Edit Event</h2>

            <label className="block mb-2" htmlFor="edit-event-title">
              Event Title:
            </label>
            <input
              id="edit-event-title"
              type="text"
              className={`w-full p-2 mb-4 border rounded ${themeStyles.input}`}
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
            />

            <label className="block mb-2" htmlFor="edit-event-date">
              Event Date:
            </label>
            <input
              id="edit-event-date"
              type="datetime-local"
              className={`w-full p-2 mb-4 border rounded ${themeStyles.input}`}
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />

            <label className="block mb-2" htmlFor="edit-event-description">
              Event Description:
            </label>
            <textarea
              id="edit-event-description"
              className={`w-full p-2 mb-4 border rounded ${themeStyles.input}`}
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              placeholder="Update description"
              rows={3}
            />

            <label className="block mb-2" htmlFor="edit-event-end-date">
              Event End Date (Optional):
            </label>
            <input
              id="edit-event-end-date"
              type="datetime-local"
              className={`w-full p-2 mb-4 border rounded ${themeStyles.input}`}
              value={eventEndDate}
              onChange={(e) => setEventEndDate(e.target.value)}
            />

            <div className="flex justify-between gap-2">
              <button
                className={`px-4 py-2 rounded-lg flex-1 ${themeStyles.button}`}
                onClick={handleEditEvent}
              >
                Save Changes
              </button>
              <button
                className={`px-4 py-2 rounded-lg flex-1 ${themeStyles.deleteButton}`}
                onClick={handleDeleteEvent}
              >
                Delete Event
              </button>
              <button
                className={`px-4 py-2 rounded-lg ${themeStyles.cancelButton}`}
                onClick={() => setShowEditForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}