import React, {useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import Dropdown from "../components/Dropdown";
import NavBar from "../components/Navbar";

const EventDetails = () => {
  const [availableDates, setAvailableDates] = useState([])
  const [userSelections, setUserSelections] = useState([])


  const location = useLocation();
  const { email, firstName, lastName, eventId, eventTitle, host } = location.state || {};


 useEffect(() => {
    async function fetchData()
    {
      try
      {
        const[res1] = await Promise.all([
          fetch("https://calfriend.onrender.com/api/GetEventById", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify( { eventId } )
          })
        ]);

        res1.json().then(data => {
          if (data.success)
          {
            const cleanSlots = data.eventSlot.map(event => {
              const eventSlot = JSON.parse(event);
              const start = new Date(eventSlot.start);
              const end = new Date(eventSlot.end);

              const format = {month: 'short', day: 'numeric', hour:'numeric', minute:'2-digit'};
              const dateFormatted = `${start.toLocaleString('en-US',format)} - ${end.toLocaleString('en-US', format)}`;

              return{dateFormatted};
            });

            setAvailableDates(cleanSlots);
          }
          else
          {
            console.log("Could not get event.");
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

  const handleSelection = (slot) => {
    setUserSelections([...userSelections, slot]);
  };

  const submitAvailability = async () => {
  };

  return (
    <div>

      <NavBar email={email} firstName={firstName} lastName={lastName}/>

      <h1> Event Title: {eventTitle} </h1>
      <h1> Event Host: {host} </h1>

      <h2>Select Available Times</h2>

      <Dropdown slots={availableDates} />

      <button className="btn-1" onClick={submitAvailability}>Submit Availability</button>

    </div>
  )
}

export default EventDetails;