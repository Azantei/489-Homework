/*
 * Camille Orego
 * CPTS 489 - Web Development
 * Homework 3 - Express Petition App
 * Builds on Assignment 2
 * 
 * Developed with assistance from Claude Sonnet 4.6 (Anthropic)
 * All prompts documented in AI Prompts PDF per assignment requirements
 */

const express = require('express');
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files from the public folder
app.use(express.static('public'));

// Parse form submissions
app.use(express.urlencoded({ extended: true }));

// In-memory signatures array with seed data
const signatures = [
    {
        name: "Alice Johnson",
        email: "alice@example.com",
        city: "Seattle",
        state: "WA",
        signerType: "Student",
        conditionalFields: { "Academic Level": "Junior", "Major": "Computer Science" },
        comment: "Early mornings are brutal in winter!"
    },
    {
        name: "Bob Smith",
        email: "bob@example.com",
        city: "Portland",
        state: "OR",
        signerType: "Military",
        conditionalFields: { "Branch": "Army", "Status": "Veteran" },
        comment: ""
    }
];

// GET route: render the petition page with signatures
app.get('/', (req, res) => {
    res.render('index', { signatures: signatures });
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});