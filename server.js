const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const cors = require('cors');

const app = express();

// Enable CORS
app.use(cors());

// Create a MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Vrmuruga@86!',
  database: 'students'
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

// Create a table if it doesn't exist
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS registrations (
    id INT AUTO_INCREMENT,
    name VARCHAR(255),
    email VARCHAR(255),
    faculty VARCHAR(255),
    PRIMARY KEY (id)
  );
`;
db.query(createTableQuery, (err, results) => {
  if (err) {
    console.error('Error creating table:', err);
    return;
  }
  console.log('Table created successfully');
});

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Handle form submissions
app.use(express.json());

// Register a new user
app.post('/register', (req, res) => {
  const { name, email, faculty } = req.body;

  // Log received data
  console.log('Received data:', { name, email, faculty });

  const insertQuery = `
    INSERT INTO registrations (name, email, faculty)
    VALUES (?,?,?);
  `;
  db.query(insertQuery, [name, email, faculty], (err, results) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.send({ message: 'Error registering user', error: true });
      return;
    }
    console.log('Data inserted successfully:', results);
    res.send({ message: 'User registered successfully', success: true });
  });
});

// Check if the user exists
app.post('/check_student', (req, res) => {
  const { studentId } = req.body;

  // Log received data
  console.log('Received data:', { studentId });

  const selectQuery = `
    SELECT * FROM registrations
    WHERE id =?;
  `;
  db.query(selectQuery, [studentId], (err, results) => {
    if (err) {
      console.error('Error selecting data:', err);
      res.send({ message: 'Error checking student', error: true });
      return;
    }
    if (results.length > 0) {
      res.send({ message: 'Student found', success: true });
    } else {
      res.send({ message: 'Student not found', error: true });
    }
  });
});

// Serve the HTML file for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve the HTML file for the login route
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Serve the HTML file for the registration route
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'Registration.html'));
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});