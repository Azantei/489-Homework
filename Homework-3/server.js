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

// Parse form submissions - this populates req.body
app.use(express.urlencoded({ extended: true }));

// In-memory signatures array with seed data
// This lives on the server for the lifetime of the server process
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

// ===================== SERVER-SIDE VALIDATION =====================
// Mirrors the validation from Assignment 2 but runs on the server.
// The server never trusts the client - we always validate here.
// Returns an error message string if invalid, or null if valid.
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

// ===================== BUILD CONDITIONAL FIELDS =====================
// Collects the conditional fields based on signer type
// Returns an object with label/value pairs for the modal to display
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

// ===================== GET ROUTE =====================
// Renders the petition page with the current signatures array
app.get('/', (req, res) => {
    res.render('index', { signatures: signatures });
});

// ===================== POST ROUTE =====================
// Handles form submission from the petition form
app.post('/', (req, res) => {
    // req.body contains all the submitted form fields
    // thanks to express.urlencoded middleware above
    const errorMsg = validateForm(req.body);

    if (errorMsg) {
        // Validation failed: re-render the page with the error message
        // and the previously entered values so the user doesn't retype everything
        res.render('index', {
            signatures: signatures,
            errorMsg: errorMsg,
            formData: req.body
        });
        return;
    }

    // Validation passed: build the signature object and add it to the array
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

    // Post-Redirect-Get pattern: redirect to GET / so refreshing doesn't resubmit
    res.redirect('/');
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});