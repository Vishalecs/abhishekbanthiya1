const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 4001;

// Middleware to parse JSON data
app.use(express.json());

// Enable CORS
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/pro1', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Define a schema for the registration data
const registrationSchema = new mongoose.Schema({
  name: String,
  dob: Date,
  email: String,
  password: String,
});

// Create a model based on the schema
const Registration = mongoose.model('Registration', registrationSchema);

// Express route to handle form submission
app.post('/register', async (req, res) => {
  try {
    const { name, dob, email, password } = req.body;
    const newRegistration = new Registration({
      name,
      dob,
      email,
      password,
    });
    const savedRegistration = await newRegistration.save();
    console.log('Registration saved:', savedRegistration);
    res.status(200).send('Registration saved');
  } catch (error) {
    console.error('Error saving registration:', error);
    res.status(500).send('Error saving registration');
  }
});

// Add a new route for handling login requests
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Registration.findOne({ email });
    if (!user) {
      return res.status(404).send('User not found');
    }
    if (user.password !== password) {
      return res.status(401).send('Incorrect password');
    }
    res.status(200).send('Login successful'); // Send success response
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send('Error logging in');
  }
});
app.post('/logout', (req, res) => {
  try {
    // Clear the authentication token from the client's local storage
    // This effectively logs the user out
    res.status(200).send('Logout successful');
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).send('Error logging out');
  }
});


// Route to fetch JSON data (no authentication required)
app.get('/api/data', async (req, res) => {
  try {
    const data = [
      { name: 'User 1', date: '2024-03-15', create: 'Admin', role: 'Active' },
      { name: 'User 2', date: '2024-03-16', create: 'Editor', role: 'Inactive' },
      { name: 'User 3', date: '2024-03-17', create: 'User', role: 'Active' },
      { name: 'User 4', date: '2024-03-18', create: 'Admin', role: 'Inactive' },
      { name: 'User 5', date: '2024-03-19', create: 'Editor', role: 'Active' },
    ];
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
