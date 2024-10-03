const express = require("express"); // imports express
const bodyParser = require("body-parser"); //handle form data
const { MongoClient } = require("mongodb"); // allows CRUD operations

const app = express(); // instance of the express application
const port = 3000;

// MongoDB connection URL
const mongoUrl = "mongodb://localhost:27017";

// Defining the database and collection
const dbName = "personal_library";
const collectionName = "books";

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
var publicDir = path.join(__dirname, "public");
// Serve static files from the 'public' folder
app.use(express.static(publicDir));

// Serve the HTML form
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html"); // initializing a callback function
});

// Handle form submission and save data to MongoDB
app.post("/addbook", async (req, res) => {
  const bookData = {
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    rating: parseInt(req.body.rating, 10),
  };

  try {
    // Connect to MongoDB
    const client = new MongoClient(mongoUrl, { useUnifiedTopology: true });
    await client.connect(); // establishes the connection

    // Select the database and collection
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Insert the book data into MongoDB
    await collection.insertOne(bookData);

    // Close the connection to free up resources
    await client.close();

    res.send("Book added successfully!");
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).send("Error adding book to the database.");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// {extended: true} - allows for complex objects and arrays to be encoded in the form data, otherwise, only strings or arrays can be encoded.
// app.get() - used to request and receive data (e.g. web pages) from the server
// (req, res) => { ... } :
// req - epresents the incoming HTTP request such as URL
// res - Represents the HTTP response that will be sent back to the client.
