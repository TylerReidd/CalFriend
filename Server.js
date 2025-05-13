//Setup the Server File:
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";

const app = express();

dotenv.config();

app.use(cors({
    origin: "https://cal-friend.netlify.app",
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//const username = encodeURIComponent(process.env.USERNAME);
//const password = encodeURIComponent(process.env.PASSWORD);
const username = encodeURIComponent("service-user");
const password = encodeURIComponent("qb7HIiNvnaQRMblg");
const uri = "mongodb+srv://" + username + ":" + password + "@calendarfriendmainclust.y8zmw.mongodb.net/?retryWrites=true&w=majority&appName=CalendarFriendMainCluster";
const port = process.env.PORT;

const client = new MongoClient(uri,
{
  serverApi:
  {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const database = client.db('MainDB');



//POST Methods:

app.post('/GetEventById', async (req, res) =>
{
    try
    {
        await client.connect();

        const { eventId } = req.body;

        if (eventId == null)
        {
            return res.status(400).json({ message: "Missing Required Parameters: EventId" });
        }

        const eventsCollection = database.collection('Events');

        const event = await eventsCollection.findOne( { _id: new ObjectId(eventId) } );

        if (!event)
        {
            const response = 
            {
                success : false,
            };
            res.json(response);
        }
        else
        {
            const response = 
            {
                success : true,
                eventTitle : event.evenTitle,
                eventHost : event.eventHost,
                description : event.description,
                eventSlot : event.eventSlot,
                eventInviteList : event.eventInviteList,
                start : event.start,
                end : event.end
            };
            res.json(response);
        }        

        await client.close();
    }
    catch (err)
    {
        res.status(500).json({ message: err.message });
    }
});


app.post('/GetEventsByEmail', async (req, res) =>
{
    try
    {
        await client.connect();

        const { email } = req.body;

        if (email == null)
        {
            return res.status(400).json({ message: "Missing Required Parameters: Email" });
        }

        const eventsCollection = database.collection('Events');

        const results = await eventsCollection.find({ eventInviteList: email }).toArray();

        if (!results)
        {
            const response = 
            {
                success : false,
                events : null
            };
            res.json(response);
        }
        else
        {
            const response = 
            {
                success : true,
                events : results
            };
            res.json(response);
        }        

        await client.close();
    }
    catch (err)
    {
        res.status(500).json({ message: err.message });
    }
});


app.post('/GetNameByEmail', async (req, res) =>
{
    try
    {
        await client.connect();

        const { email } = req.body;

        if (email == null)
        {
            return res.status(400).json({ message: "Missing Required Parameters: Email" });
        }

        const userCollection = database.collection('Users');

        const results = await userCollection.find({ email: email });
        const fullName = "" + results.firstName + " " + results.lastName; 

        if (!results)
        {
            const response = 
            {
                success : false,
                fullName : null
            };
            res.json(response);
        }
        else
        {
            const response = 
            {
                success : true,
                fullName : fullName
            };
            res.json(response);
        }        

        await client.close();
    }
    catch (err)
    {
        res.status(500).json({ message: err.message });
    }
});


app.post('/CreateEvent', async(req,res) => {
    try {
        console.log("Recieved Request", req.body);
        await client.connect();

        const { event } = req.body;

        if (!event || event.length === 0)
        {
            return res.status(400).json({message: "No events"});
        }

        const eventsCollection = database.collection("Events");

        const insertResult = await eventsCollection.insertOne(event);

        res.status(201).json({message: "Events Added successfully", insertedIds: insertResult.insertedIds});
    } catch (err) {
        res.status(500).json({message: "error adding events", error: err.message});
    } finally {
        await client.close()
    }
});


app.post('/DeclineEvent', async(req,res) => {
    try
    {
        await client.connect();

        const { eventID, email } = req.body;

        if (!eventID ||!email)
        {
            return res.status(400).json({message: "No event or email recieved."});
        }

        const eventsCollection = database.collection('Events');

        await eventsCollection.updateOne(
            { _id: eventID },
            { $pull: { eventInviteList: email } }
        )

        return res.json({ success:true });
    }
    catch (err)
    {
        res.status(500).json({message: "Error Declining Event", error: err.message});
    }
    finally
    {
        await client.close()
    }
});


app.post('/CreateUser', async (req, res) =>
{
    try
    {
        await client.connect();

        const { firstName, lastName, email, password } = req.body;

        if (firstName == null || lastName == null || email == null || password == null)
        {
            return res.json({ success:false });
        }
        else
        {
            const usersCollection = database.collection('Users');

            const searchQuery = {};
            searchQuery.email = email;
    
            const user = await usersCollection.findOne(searchQuery);

            if(user)
            {
                return res.json({ success:true, userExists:true });
            }
            else
            {
                const NewUser = 
                ({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password,
                    confirmPassword: password
                });

                const newUserID = await usersCollection.insertOne(NewUser);

                return res.json({ success:true, userExists:false, newID:newUserID});
            }
        }
        await client.close();
    }
    catch (err)
    {
        res.status(400).json({ message: err.message });
    }
});


app.post('/AuthenticateUser', async (req, res) =>
{
    try
    {
        await client.connect();

        const { email, password } = req.body;

        if (email == null || password == null)
        {
            return res.status(400).json({ message: "Missing Required Parameters: Email or Password" });
        }


        const usersCollection = database.collection('Users');

        const searchQuery = {};
        searchQuery.email = email;
        searchQuery.password = password;

        const user = await usersCollection.findOne(searchQuery);

        if (!user)
        {
            res.json({success:false});
        }
        else
        {
            const response = 
            {
                success : true,
                firstName : user.firstName,
                lastName : user.lastName,
                email : user.email
            };
            res.json(response);
        }        

        await client.close();
    }
    catch (err)
    {
        res.status(500).json({ message: err.message });
    }
});



//Start Listening on a Port:
app.listen(port, () =>
{
    console.log(`Server running at http://localhost:${port}`);
});