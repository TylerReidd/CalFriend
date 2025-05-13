import { Calendar } from "../components/Calendar";
import { useState } from "react";
import { useLocation } from 'react-router-dom';
import DescriptionField from "../components/DescriptionField";
import TitleField from "../components/TitleField";
import NavBar from "../components/Navbar";
import InviteList from "../components/InviteList";


const CreateEvent = () => {
  const [eventSlots, setEventSlot] = useState([])
  const [eventTitle, setEventTitle] = useState('')
  const [eventDescription, setEventDescription] = useState('')
  const [eventHost, setEventHost] = useState('')
  const [inviteList, setInviteList] = useState([]);
  let eventSlotCounter = 1;
  let currentSlotName = "Slot ";

  const location = useLocation();
  const { email, firstName, lastName } = location.state || {};


  const handleInviteListUpdate = (updatedList) => {
    setInviteList(updatedList);
  };
  
  const handleEventSelected = (event) => {

    currentSlotName = "Slot " + eventSlotCounter;
    
    console.log(event.eventSlotCounter)
    console.log(event.start)
    console.log(event.end)

    event.title = currentSlotName;

    //This renders to the calendar
    const newEventSlot =
    {
      slotId: eventSlotCounter,
      start: event.start,
      end: event.end, 
    }

    eventSlots.push(JSON.stringify(newEventSlot));

    eventSlotCounter++;
  };



  const handleSubmit = async () => {

    const newEvent =
    {
      eventTitle: eventTitle,
      eventHost: email,
      description: eventDescription,
      eventSlot: eventSlots,
      eventInviteList: inviteList,
      start: null,
      end: null
    }

    try
    {
      const response = await fetch("https://calfriend.onrender.com/api/CreateEvent", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({event: newEvent}),
      })

      if (response.ok)
      {
        console.log("Event created successfuly")
      }
      else
      {
        console.error("Failed to create event")
      }
    }
    catch (error)
    {
      console.error("Error", error)
    }
  }

  
  return(
    <>
      <NavBar email={email} firstName={firstName} lastName={lastName} />

      <div className='createEventForm'>

        <h1>Create Event</h1>

        <div className="createEventForm-Top">

          <div>

            <h2>General Event Information</h2>

            <TitleField
              eventTitle={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
            />
            
            <DescriptionField
              eventDescription={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)} 
            />

          </div>
          
          <div>

            <h2>Event Invite List</h2>

            <InviteList onChange={handleInviteListUpdate} />

          </div>

        </div>

        <button className="btn-1" onClick={handleSubmit}>Submit Event</button>

      </div>

      <div className="" id="CreateEventCalendar">
        <Calendar
          events={eventSlots}
          onEventSelected={handleEventSelected}
          eventTitle={currentSlotName}
          eventDescription={eventDescription}
        />
      </div>

    </>
  );
};

export default CreateEvent;