// ============================================================
// Petition2.js
// Camille Orego — CPTS 489 Web Development — Assignment 2
// 
// This script provides dynamic functionality for the petition form:
// - Loads seed signature data on page load
// - Shows/hides conditional form sections based on signer type
// - Validates all form inputs before submission
// - Dynamically adds new signatures to the table
// - Opens Bootstrap modals to display full signature details
// ============================================================

// ------------------------------------------------------------------
// Seed data: pre-populated signatures shown on page load
// This array contains sample signatures to demonstrate the functionality
// ------------------------------------------------------------------
const seedSignatures = [
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
    },
    {
        name: "Carol Davis",
        email: "carol@wsu.edu",
        city: "Pullman",
        state: "WA",
        signerType: "Faculty",
        conditionalFields: { "Role": "Professor", "Department": "School of EECS" },
        comment: "Even professors hate 8 AM."
    },
    {
        name: "David Kim",
        email: "david@techcorp.com",
        city: "Spokane",
        state: "WA",
        signerType: "Industry",
        conditionalFields: { "Sector": "Technology", "Company": "TechCorp" },
        comment: ""
    }
];

// ------------------------------------------------------------------
// Build a display label for the signer type (shortened for table)
// Takes the full signer type string and returns a shorter version
// for display in the signatures table.
// ------------------------------------------------------------------
function getTypeLabel(signerType) {
    const labels = {
        "Student": "Student",
        "Faculty": "Faculty",
        "Military": "Military",
        "Industry": "Industry",
        "Other": "Other"
    };
    return labels[signerType] || signerType;
}

// ------------------------------------------------------------------
// Add a row to the signatures table for a given signature object
// Creates a new table row with name, city, type, and a "more »" link.
// The "more »" link triggers the modal to show full details.
// Parameters:
//   sig - signature object with name, email, city, state, etc.
// ------------------------------------------------------------------
function addTableRow(sig) {
    const tbody = document.getElementById("signaturesBody");
    const tr = document.createElement("tr");

    // Name cell: Displays the signer's name
    const tdName = document.createElement("td");
    tdName.textContent = sig.name;
    tr.appendChild(tdName);

    // City cell: Displays the signer's city
    const tdCity = document.createElement("td");
    tdCity.textContent = sig.city;
    tr.appendChild(tdCity);

    // Type cell: Displays the signer type (Student, Faculty, etc.)
    const tdType = document.createElement("td");
    tdType.textContent = getTypeLabel(sig.signerType);
    tr.appendChild(tdType);

    // "more »" link cell: When clicked, opens modal with full details
    const tdMore = document.createElement("td");
    const link = document.createElement("a");
    link.href = "#";
    link.className = "more-link";
    link.textContent = "more »";
    // Attach click event to open modal and prevent default link behavior
    link.addEventListener("click", function (e) {
        e.preventDefault();
        openModal(sig);
    });
    tdMore.appendChild(link);
    tr.appendChild(tdMore);

    // Add the completed row to the table body
    tbody.appendChild(tr);
}

// ------------------------------------------------------------------
// Build modal content and show it for a given signature
// Populates the Bootstrap modal with all signature details including
// basic info, conditional fields, and optional comment.
// Parameters:
//   sig - signature object containing all signer information
// ------------------------------------------------------------------
function openModal(sig) {
    // Set modal title to include the signer's name
    document.getElementById("modalTitle").textContent = "Details: " + sig.name;

    // Build the detail rows: Start with basic information
    const rows = [
        ["Name", sig.name],
        ["Email", sig.email],
        ["City", sig.city.toUpperCase()],
        ["State", sig.state.toUpperCase()],
        ["Signer Type", sig.signerType]
    ];

    // Add conditional fields (different for each signer type)
    for (const [label, value] of Object.entries(sig.conditionalFields)) {
        if (value) rows.push([label, value]);
    }

    // Add comment if present (not all signatures have comments)
    if (sig.comment && sig.comment.trim() !== "") {
        rows.push(["Comment", sig.comment]);
    }

    // Populate modal table with all detail rows
    const modalTable = document.getElementById("modalDetailTable");
    modalTable.innerHTML = "";
    rows.forEach(([label, value]) => {
        const tr = document.createElement("tr");
        const tdLabel = document.createElement("td");
        tdLabel.textContent = label;
        const tdValue = document.createElement("td");
        tdValue.textContent = value;
        tr.appendChild(tdLabel);
        tr.appendChild(tdValue);
        modalTable.appendChild(tr);
    });

    // Show Bootstrap modal using Bootstrap's JavaScript API
    const modalEl = document.getElementById("detailModal");
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
}

// ------------------------------------------------------------------
// Show/hide conditional sub-sections based on signer type selection
// When the user selects a signer type from the dropdown, this function
// hides all conditional sections and shows only the relevant one.
// For example, selecting "Student" shows the student section with
// academic level and major fields.
// ------------------------------------------------------------------
function handleSignerTypeChange() {
    const signerType = document.getElementById("signerType").value;

    // Hide all sub-sections first by removing the "visible" class
    document.querySelectorAll(".conditional-section").forEach(section => {
        section.classList.remove("visible");
    });

    // Show the relevant section by adding the "visible" class
    // The CSS uses .conditional-section.visible { display: block; }
    if (signerType === "Student") {
        document.getElementById("section-student").classList.add("visible");
    } else if (signerType === "Faculty") {
        document.getElementById("section-faculty").classList.add("visible");
    } else if (signerType === "Military") {
        document.getElementById("section-military").classList.add("visible");
    } else if (signerType === "Industry") {
        document.getElementById("section-industry").classList.add("visible");
    } else if (signerType === "Other") {
        document.getElementById("section-other").classList.add("visible");
    }
}

// ------------------------------------------------------------------
// Validate the form and return an error message or null if valid
// Checks all required fields and returns a descriptive error message
// if validation fails. Returns null if all validations pass.
// This function is called before form submission.
// Returns: error message string or null
// ------------------------------------------------------------------
function validateForm() {
    const name = document.getElementById("nameInput").value.trim();
    const email = document.getElementById("emailInput").value.trim();
    const city = document.getElementById("cityInput").value.trim();
    const state = document.getElementById("stateInput").value.trim();
    const signerType = document.getElementById("signerType").value;

    // Name must be at least 5 characters
    if (name.length < 5) {
        return "Name must be at least 5 characters long.";
    }

    // Basic email validation: has @, has a dot after @, non-empty parts on both sides
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
    if (city.length === 0) {
        return "City must not be empty.";
    }

    // State must be exactly 2 characters (e.g., WA, OR, CA)
    if (state.length !== 2) {
        return "State must be exactly 2 characters (e.g., WA).";
    }

    // Signer type must be selected
    if (!signerType) {
        return "Please fill in all required fields and select your signer type.";
    }

    // Validate conditional dropdowns (required if visible)
    // Each signer type has specific required fields
    if (signerType === "Student") {
        const level = document.getElementById("studentLevel").value;
        if (!level) return "Please select your Academic Level.";
    } else if (signerType === "Faculty") {
        const role = document.getElementById("facultyRole").value;
        if (!role) return "Please select your Role.";
    } else if (signerType === "Military") {
        const branch = document.getElementById("militaryBranch").value;
        if (!branch) return "Please select your Branch.";
        const status = document.getElementById("militaryStatus").value;
        if (!status) return "Please select your Status.";
    } else if (signerType === "Industry") {
        const sector = document.getElementById("industrySector").value;
        if (!sector) return "Please select your Industry Sector.";
    }

    return null; // No errors, form is valid
}

// ------------------------------------------------------------------
// Collect conditional fields from whichever sub-section is visible
// Gathers the data from the conditional section based on signer type.
// Returns an object with field labels and values (e.g., {"Academic Level": "Junior"}).
// Only includes fields that have values; optional fields may be omitted.
// Parameters:
//   signerType - the selected signer type (Student, Faculty, etc.)
// Returns: object with conditional field labels and values
// ------------------------------------------------------------------
function collectConditionalFields(signerType) {
    const fields = {};

    // Student: Collect academic level (required) and major (optional)
    if (signerType === "Student") {
        const level = document.getElementById("studentLevel");
        const major = document.getElementById("studentMajor");
        fields["Academic Level"] = level.options[level.selectedIndex].text;
        if (major.value.trim()) fields["Major"] = major.value.trim();

    // Faculty: Collect role (required) and department (optional)
    } else if (signerType === "Faculty") {
        const role = document.getElementById("facultyRole");
        const dept = document.getElementById("facultyDept");
        fields["Role"] = role.options[role.selectedIndex].text;
        if (dept.value.trim()) fields["Department"] = dept.value.trim();

    // Military: Collect branch and status (both required)
    } else if (signerType === "Military") {
        const branch = document.getElementById("militaryBranch");
        const status = document.getElementById("militaryStatus");
        fields["Branch"] = branch.options[branch.selectedIndex].text;
        fields["Status"] = status.options[status.selectedIndex].text;

    // Industry: Collect sector (required) and company (optional)
    } else if (signerType === "Industry") {
        const sector = document.getElementById("industrySector");
        const company = document.getElementById("industryCompany");
        fields["Sector"] = sector.options[sector.selectedIndex].text;
        if (company.value.trim()) fields["Company"] = company.value.trim();

    // Other: Collect free-form affiliation text (optional)
    } else if (signerType === "Other") {
        const affiliation = document.getElementById("otherAffiliation");
        if (affiliation.value.trim()) fields["Affiliation"] = affiliation.value.trim();
    }

    return fields;
}

// ------------------------------------------------------------------
// Reset the form after successful submission
// Clears all form fields and hides all conditional sections.
// This prepares the form for the next signature entry.
// ------------------------------------------------------------------
function resetForm() {
    // Clear all basic input fields
    document.getElementById("nameInput").value = "";
    document.getElementById("emailInput").value = "";
    document.getElementById("cityInput").value = "";
    document.getElementById("stateInput").value = "";
    document.getElementById("signerType").value = "";
    document.getElementById("commentInput").value = "";

    // Reset all conditional dropdowns to their default empty state
    ["studentLevel", "facultyRole", "militaryBranch", "militaryStatus", "industrySector"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });
    // Reset all conditional text inputs
    ["studentMajor", "facultyDept", "industryCompany", "otherAffiliation"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });

    // Hide all conditional sections by removing the "visible" class
    document.querySelectorAll(".conditional-section").forEach(s => s.classList.remove("visible"));
}

// ------------------------------------------------------------------
// Handle form submission
// This function is called when the user clicks "Sign Petition".
// It validates the form, displays errors if invalid, and if valid,
// creates a signature object, adds it to the table, and resets the form.
// Parameters:
//   e - the form submit event
// ------------------------------------------------------------------
function handleSubmit(e) {
    e.preventDefault(); // Prevent default form submission (page reload)

    const errorEl = document.getElementById("formError");
    const errorMsg = validateForm();

    // If validation fails, display the error message and stop
    if (errorMsg) {
        errorEl.textContent = errorMsg;
        errorEl.classList.add("visible");
        return;
    }

    // Clear any previous error messages
    errorEl.classList.remove("visible");
    errorEl.textContent = "";

    // Build signature object from form data
    const signerType = document.getElementById("signerType").value;
    const sig = {
        name: document.getElementById("nameInput").value.trim(),
        email: document.getElementById("emailInput").value.trim(),
        city: document.getElementById("cityInput").value.trim(),
        state: document.getElementById("stateInput").value.trim().toUpperCase(),
        signerType: signerType,
        conditionalFields: collectConditionalFields(signerType),
        comment: document.getElementById("commentInput").value.trim()
    };

    // Add the new signature to the table and reset the form for next entry
    addTableRow(sig);
    resetForm();
}

// ------------------------------------------------------------------
// Initialize on page load
// This function runs when the DOM is fully loaded and ready.
// It sets up the page by loading seed signatures and attaching
// event listeners for form interactions.
// ------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
    // Load seed data into table: Display pre-populated signatures
    // seedSignatures.forEach(sig => addTableRow(sig));

    // Attach signer type change listener: Shows/hides conditional sections
    document.getElementById("signerType").addEventListener("change", handleSignerTypeChange);

    // Attach submit listener: Validates and processes form submission
    document.getElementById("petitionForm").addEventListener("submit", handleSubmit);
});
