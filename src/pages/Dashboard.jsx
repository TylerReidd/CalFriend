import React, {useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import EventCard from '../components/EventCard';
import NavBar from '../components/Navbar';
import { MonthCalendar } from '../components/MonthCalendar';

const Dashboard = () => { 

  const location = useLocation();
  const { email, firstName, lastName } = location.state || {};

  const [allEvents, setAllEvents] = useState([])

  useEffect(() => {
    async function fetchData()
    {
      try
      {
        const[res1] = await Promise.all([
          fetch("https://calfriend.onrender.com/api/GetEventsByEmail", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify( { email } )
          })
        ]);

        res1.json().then(data => {
          if (data.success)
          {
            setAllEvents(data.events);
          }
          else
          {
            console.log("Could not get events.");
          }
        });

      }
      catch (error)
      {
        console.log("Error getting all data.");
      }
    }

    fetchData();
  }, []);
  
  return (
    <>
    
      <NavBar email={email} firstName={firstName} lastName={lastName}/>

      <div className="event-sections">

        <div>

          <h1>Pending Events</h1>
          {allEvents.map((event) => (
            <EventCard key={event._id} email={email} firstName={firstName} lastName={lastName} eventId={event._id} eventTitle={event.eventTitle} host={event.eventHost}/> 
          ))}

        </div>

        <MonthCalendar/>

      </div>

    </>
  )
}


export default Dashboard