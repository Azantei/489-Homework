/*
 * ============================================================
 * server.js
 * Camille Orego — CPTS 489 Web Development — Homework 3
 * Builds on Assignment 2
 *
 * Express server for the petition app:
 * - Serves the petition page via GET /
 * - Handles form submission via POST /
 * - Validates form data server-side
 * - Stores signatures in an in-memory array
 *
 * Developed with assistance from Claude Sonnet 4.6 (Anthropic)
 * All prompts documented in AI Prompts PDF per assignment requirements
 * ============================================================
 */

const express = require('express');
const cors = require('cors');
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');

// CORS: allow requests from the React dev server
app.use(cors({ origin: 'http://localhost:3000' }));

// Serve static files from the public folder
app.use(express.static('public'));

// Parse form submissions and JSON request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ============================================================
// In-Memory Signatures Array
// Signatures are stored here for the lifetime of the server.
// No database is used — data resets when the server restarts.
// Pre-populated with seed entries on startup.
// ============================================================
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

// ============================================================
// Server-Side Validation
// Mirrors the validation from Assignment 2 but runs on the
// server. The server never trusts the client — we always
// validate here regardless of client-side validation.
// Returns an error message string if invalid, null if valid.
// ============================================================
function validateForm(body) {
    const { name, email, city, state, signerType } = body;

    // Name must be at least 5 characters
    if (!name || name.trim().length < 5) {
        return "Name must be at least 5 characters long.";
    }

    // Basic email validation: must have @ with content on both sides and a dot after @
    const atIndex = email.indexOf("@");
    if (atIndex <= 0) {
        return "Please enter a valid email address.";
    }
    const afterAt = email.substring(atIndex + 1);
    const dotIndex = afterAt.indexOf(".");
    if (dotIndex <= 0 || dotIndex === afterAt.length - 1) {
        return "Please enter a valid email address.";
    }

    // City must not be empty
    if (!city || city.trim().length === 0) {
        return "City must not be empty.";
    }

    // State must be exactly 2 characters
    if (!state || state.trim().length !== 2) {
        return "State must be exactly 2 characters (e.g., WA).";
    }

    // Signer type must be selected
    if (!signerType) {
        return "Please select your signer type.";
    }

    // Validate conditional required dropdowns based on signer type
    if (signerType === "Student" && !body.studentLevel) {
        return "Please select your Academic Level.";
    }
    if (signerType === "Faculty" && !body.facultyRole) {
        return "Please select your Role.";
    }
    if (signerType === "Military" && !body.militaryBranch) {
        return "Please select your Branch.";
    }
    if (signerType === "Military" && !body.militaryStatus) {
        return "Please select your Status.";
    }
    if (signerType === "Industry" && !body.industrySector) {
        return "Please select your Industry Sector.";
    }

    return null; // No errors
}

// ============================================================
// Build Conditional Fields
// Collects the conditional fields from the submitted form
// based on signer type. Returns an object with label/value
// pairs used to populate the modal details view.
// ============================================================
function buildConditionalFields(body) {
    const fields = {};
    const { signerType } = body;

    if (signerType === "Student") {
        if (body.studentLevel) fields["Academic Level"] = body.studentLevel;
        if (body.studentMajor) fields["Major"] = body.studentMajor;
    } else if (signerType === "Faculty") {
        if (body.facultyRole) fields["Role"] = body.facultyRole;
        if (body.facultyDept) fields["Department"] = body.facultyDept;
    } else if (signerType === "Military") {
        if (body.militaryBranch) fields["Branch"] = body.militaryBranch;
        if (body.militaryStatus) fields["Status"] = body.militaryStatus;
    } else if (signerType === "Industry") {
        if (body.industrySector) fields["Sector"] = body.industrySector;
        if (body.industryCompany) fields["Company"] = body.industryCompany;
    } else if (signerType === "Other") {
        if (body.otherAffiliation) fields["Affiliation"] = body.otherAffiliation;
    }

    return fields;
}

// ============================================================
// GET /api/signatures
// Returns the full signatures array as JSON.
// ============================================================
app.get('/api/signatures', (req, res) => {
    res.status(200).json(signatures);
});

// ============================================================
// POST /api/signatures
// Accepts a JSON body, validates it, and adds a new signature.
// Returns 400 with { error } on failure, 201 with the new
// signature object on success.
// ============================================================
app.post('/api/signatures', (req, res) => {
    const errorMsg = validateForm(req.body);
    if (errorMsg) {
        return res.status(400).json({ error: errorMsg });
    }

    const newSig = {
        name: req.body.name.trim(),
        email: req.body.email.trim(),
        city: req.body.city.trim(),
        state: req.body.state.trim().toUpperCase(),
        signerType: req.body.signerType,
        conditionalFields: buildConditionalFields(req.body),
        comment: req.body.comment ? req.body.comment.trim() : ""
    };

    signatures.push(newSig);
    res.status(201).json(newSig);
});

// ============================================================
// GET Route
// Renders the petition page with the current signatures array.
// EJS uses the signatures array to render the table server-side.
// ============================================================
app.get('/', (req, res) => {
    res.render('index', { signatures: signatures });
});

// ============================================================
// POST Route
// Handles form submission from the petition form.
// Validates server-side, re-renders with errors or redirects.
// Uses the Post-Redirect-Get pattern on success to prevent
// duplicate submissions on page refresh.
// ============================================================
app.post('/', (req, res) => {
    // req.body contains all submitted form fields
    // populated by express.urlencoded middleware
    const errorMsg = validateForm(req.body);

    if (errorMsg) {
        // Validation failed: re-render with error and pre-filled form data
        // so the user does not have to retype everything
        res.render('index', {
            signatures: signatures,
            errorMsg: errorMsg,
            formData: req.body
        });
        return;
    }

    // Validation passed: build and store the new signature
    const newSig = {
        name: req.body.name.trim(),
        email: req.body.email.trim(),
        city: req.body.city.trim(),
        state: req.body.state.trim().toUpperCase(),
        signerType: req.body.signerType,
        conditionalFields: buildConditionalFields(req.body),
        comment: req.body.comment ? req.body.comment.trim() : ""
    };

    // Push the new signature into the in-memory array
    signatures.push(newSig);

    // Post-Redirect-Get: redirect to GET / so refreshing the page
    // does not resubmit the form
    res.redirect('/');
});

// ============================================================
// Start Server
// ============================================================
app.listen(4000, () => {
    console.log('Server running on http://localhost:4000');
});