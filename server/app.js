const express = require("express");
const cors = require("cors");

const app = express();
const port = 7000;

// Sample data
const candidates = require("./db.json").Candidates;
const languages = require("./db.json").Languages;

app.use(cors());

// Endpoint to get all candidates
app.get("/candidates", (req, res) => {
  res.json({ candidates: candidates, languages: languages });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
