import React, {useState} from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'


export function Calendar({onEventSelected, eventTitle, eventDescription }) {
  const [events, setEvents] = useState([])
  

  const handleSelect = (selectInfo) => {
  
    if (eventTitle && eventDescription)
      {
      const newEvent = {
        title: eventTitle,
        description: eventDescription,
        start: selectInfo.start,
        end: selectInfo.end,
      }

      setEvents([...events, newEvent])
      selectInfo.view.calendar.addEvent(newEvent);

      if(onEventSelected)
      {
        onEventSelected(newEvent)
      }
    } else {
      console.warn("Event title or description is missing.")
      alert("Event title or description is missing.")
    }
  };


  return (
    <div style={{width:"75%", margin:"auto"}}>
      <FullCalendar 
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView='timeGridWeek'
        allDaySlot={false}
        weekends={true}
        selectable={true}
        select={handleSelect}
        events={events}
        aspectRatio={2}
        eventContent={(eventInfo) => (
          <>
            <b>{eventInfo.timeText}</b> <i>{eventInfo.event.title}</i>
          </>
        )}
      />
    </div>
  )
}

