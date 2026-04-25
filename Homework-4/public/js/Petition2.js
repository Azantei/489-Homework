// ============================================================
// Petition2.js
// Camille Orego — CPTS 489 Web Development — Homework 3
// Builds on Assignment 2
//
// Changes from Assignment 2:
// - Seed data and table rows are now rendered server-side via EJS
// - Modal now reads signature data from data-sig attribute on each row
// - Client-side validation still runs, but server also validates
// - Form submission now goes to the server via POST
// - addTableRow() is no longer called on page load
//
// Developed with assistance from Claude Sonnet 4.6 (Anthropic)
// All prompts documented in AI Prompts PDF per assignment requirements
// ============================================================

// ============================================================
// Seed Data
// Kept here for reference but no longer used client-side.
// The server now owns the seed data in server.js.
// ============================================================
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

// ============================================================
// getTypeLabel
// Builds a display label for the signer type.
// Used when adding rows to the table client-side.
// ============================================================
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

// ============================================================
// addTableRow
// Adds a row to the signatures table for a given signature.
// Still used after successful client-side form submission.
// Server handles the initial page load rows via EJS.
// ============================================================
function addTableRow(sig) {
    const tbody = document.getElementById("signaturesBody");
    const tr = document.createElement("tr");

    // Store the full signature object on the row as a data attribute
    // so the modal can read it when "more »" is clicked
    tr.setAttribute("data-sig", JSON.stringify(sig));

    const tdName = document.createElement("td");
    tdName.textContent = sig.name;
    tr.appendChild(tdName);

    const tdCity = document.createElement("td");
    tdCity.textContent = sig.city;
    tr.appendChild(tdCity);

    const tdType = document.createElement("td");
    tdType.textContent = getTypeLabel(sig.signerType);
    tr.appendChild(tdType);

    const tdMore = document.createElement("td");
    const link = document.createElement("a");
    link.href = "#";
    link.className = "more-link";
    link.textContent = "more »";
    link.addEventListener("click", function (e) {
        e.preventDefault();
        openModal(sig);
    });
    tdMore.appendChild(link);
    tr.appendChild(tdMore);

    tbody.appendChild(tr);
}

// ============================================================
// openModal
// Builds and displays the Bootstrap modal for a given signature.
// Populates the modal with all signature details including
// basic info, conditional fields, and optional comment.
// ============================================================
function openModal(sig) {
    document.getElementById("modalTitle").textContent = "Details: " + sig.name;

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

    // Add comment if present
    if (sig.comment && sig.comment.trim() !== "") {
        rows.push(["Comment", sig.comment]);
    }

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

    const modalEl = document.getElementById("detailModal");
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
}

// ============================================================
// handleSignerTypeChange
// Shows/hides conditional sub-sections based on signer type.
// Triggered when the user changes the signer type dropdown.
// ============================================================
function handleSignerTypeChange() {
    const signerType = document.getElementById("signerType").value;

    // Hide all sub-sections first
    document.querySelectorAll(".conditional-section").forEach(section => {
        section.classList.remove("visible");
    });

    // Show only the relevant section
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

// ============================================================
// validateForm
// Validates the form client-side and returns an error message
// or null if valid. The server also validates independently —
// this is just the first line of defense.
// ============================================================
function validateForm() {
    const name = document.getElementById("nameInput").value.trim();
    const email = document.getElementById("emailInput").value.trim();
    const city = document.getElementById("cityInput").value.trim();
    const state = document.getElementById("stateInput").value.trim();
    const signerType = document.getElementById("signerType").value;

    if (name.length < 5) {
        return "Name must be at least 5 characters long.";
    }

    const atIndex = email.indexOf("@");
    if (atIndex <= 0) {
        return "Please enter a valid email address.";
    }
    const afterAt = email.substring(atIndex + 1);
    const dotIndex = afterAt.indexOf(".");
    if (dotIndex <= 0 || dotIndex === afterAt.length - 1) {
        return "Please enter a valid email address.";
    }

    if (city.length === 0) {
        return "City must not be empty.";
    }

    if (state.length !== 2) {
        return "State must be exactly 2 characters (e.g., WA).";
    }

    if (!signerType) {
        return "Please fill in all required fields and select your signer type.";
    }

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

    return null;
}

// ============================================================
// collectConditionalFields
// Collects conditional field values from the visible sub-section.
// Returns an object with label/value pairs for the signature.
// ============================================================
function collectConditionalFields(signerType) {
    const fields = {};

    if (signerType === "Student") {
        const level = document.getElementById("studentLevel");
        const major = document.getElementById("studentMajor");
        fields["Academic Level"] = level.options[level.selectedIndex].text;
        if (major.value.trim()) fields["Major"] = major.value.trim();
    } else if (signerType === "Faculty") {
        const role = document.getElementById("facultyRole");
        const dept = document.getElementById("facultyDept");
        fields["Role"] = role.options[role.selectedIndex].text;
        if (dept.value.trim()) fields["Department"] = dept.value.trim();
    } else if (signerType === "Military") {
        const branch = document.getElementById("militaryBranch");
        const status = document.getElementById("militaryStatus");
        fields["Branch"] = branch.options[branch.selectedIndex].text;
        fields["Status"] = status.options[status.selectedIndex].text;
    } else if (signerType === "Industry") {
        const sector = document.getElementById("industrySector");
        const company = document.getElementById("industryCompany");
        fields["Sector"] = sector.options[sector.selectedIndex].text;
        if (company.value.trim()) fields["Company"] = company.value.trim();
    } else if (signerType === "Other") {
        const affiliation = document.getElementById("otherAffiliation");
        if (affiliation.value.trim()) fields["Affiliation"] = affiliation.value.trim();
    }

    return fields;
}

// ============================================================
// resetForm
// Clears all form fields and hides all conditional sections.
// Called after successful client-side submission.
// ============================================================
function resetForm() {
    document.getElementById("nameInput").value = "";
    document.getElementById("emailInput").value = "";
    document.getElementById("cityInput").value = "";
    document.getElementById("stateInput").value = "";
    document.getElementById("signerType").value = "";
    document.getElementById("commentInput").value = "";

    ["studentLevel", "facultyRole", "militaryBranch", "militaryStatus", "industrySector"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });
    ["studentMajor", "facultyDept", "industryCompany", "otherAffiliation"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });

    document.querySelectorAll(".conditional-section").forEach(s => s.classList.remove("visible"));
}

// ============================================================
// handleSubmit
// Handles form submission. Client-side validation runs first.
// If it passes, the form submits normally to the server via POST.
// The server then validates again independently.
// ============================================================
function handleSubmit(e) {
    const errorEl = document.getElementById("formError");
    const errorMsg = validateForm();

    // If client-side validation fails, block the submission
    if (errorMsg) {
        e.preventDefault();
        errorEl.textContent = errorMsg;
        errorEl.classList.add("visible");
        return;
    }

    // Clear any previous error messages and let the POST go through
    errorEl.classList.remove("visible");
    errorEl.textContent = "";
}

// ============================================================
// DOMContentLoaded — Page Initialization
// Runs when the DOM is fully loaded. Attaches all event
// listeners for form interactions and modal triggers.
// ============================================================
document.addEventListener("DOMContentLoaded", function () {
    // Attach signer type change listener: shows/hides conditional sections
    document.getElementById("signerType").addEventListener("change", handleSignerTypeChange);

    // Attach submit listener for client-side validation
    document.getElementById("petitionForm").addEventListener("submit", handleSubmit);

    // Re-show the correct conditional section if the page was re-rendered after a validation failure
    if (document.getElementById("signerType").value) handleSignerTypeChange();

    // Attach modal click listeners to server-rendered table rows.
    // Since rows are rendered by the server, we read the signature data
    // from the data-sig attribute on each row instead of from a JS array.
    document.querySelectorAll("#signaturesBody .more-link").forEach(function(link) {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            // Parse the signature object stored on the parent row by the server
            const row = e.target.closest("tr");
            const sig = JSON.parse(row.getAttribute("data-sig"));
            openModal(sig);
        });
    });
});