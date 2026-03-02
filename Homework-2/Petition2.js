// ============================================================
// Petition2.js
// Camille Orego — CPTS 489 Web Development — Assignment 2
// ============================================================

// ------------------------------------------------------------------
// Seed data: pre-populated signatures shown on page load
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
// ------------------------------------------------------------------
function addTableRow(sig) {
    const tbody = document.getElementById("signaturesBody");
    const tr = document.createElement("tr");

    // Name cell
    const tdName = document.createElement("td");
    tdName.textContent = sig.name;
    tr.appendChild(tdName);

    // City cell
    const tdCity = document.createElement("td");
    tdCity.textContent = sig.city;
    tr.appendChild(tdCity);

    // Type cell
    const tdType = document.createElement("td");
    tdType.textContent = getTypeLabel(sig.signerType);
    tr.appendChild(tdType);

    // "more »" link cell
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

// ------------------------------------------------------------------
// Build modal content and show it for a given signature
// ------------------------------------------------------------------
function openModal(sig) {
    // Set modal title
    document.getElementById("modalTitle").textContent = "Details: " + sig.name;

    // Build the detail rows
    const rows = [
        ["Name", sig.name],
        ["Email", sig.email],
        ["City", sig.city.toUpperCase()],
        ["State", sig.state.toUpperCase()],
        ["Signer Type", sig.signerType]
    ];

    // Add conditional fields
    for (const [label, value] of Object.entries(sig.conditionalFields)) {
        if (value) rows.push([label, value]);
    }

    // Add comment if present
    if (sig.comment && sig.comment.trim() !== "") {
        rows.push(["Comment", sig.comment]);
    }

    // Populate table
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

    // Show Bootstrap modal
    const modalEl = document.getElementById("detailModal");
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
}

// ------------------------------------------------------------------
// Show/hide conditional sub-sections based on signer type selection
// ------------------------------------------------------------------
function handleSignerTypeChange() {
    const signerType = document.getElementById("signerType").value;

    // Hide all sub-sections first
    document.querySelectorAll(".conditional-section").forEach(section => {
        section.classList.remove("visible");
    });

    // Show the relevant one
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
// ------------------------------------------------------------------
function validateForm() {
    const name = document.getElementById("nameInput").value.trim();
    const email = document.getElementById("emailInput").value.trim();
    const city = document.getElementById("cityInput").value.trim();
    const state = document.getElementById("stateInput").value.trim();
    const signerType = document.getElementById("signerType").value;

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

    if (city.length === 0) {
        return "City must not be empty.";
    }

    if (state.length !== 2) {
        return "State must be exactly 2 characters (e.g., WA).";
    }

    if (!signerType) {
        return "Please fill in all required fields and select your signer type.";
    }

    // Validate conditional dropdowns (required if visible)
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

    return null; // No errors
}

// ------------------------------------------------------------------
// Collect conditional fields from whichever sub-section is visible
// ------------------------------------------------------------------
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

// ------------------------------------------------------------------
// Reset the form after successful submission
// ------------------------------------------------------------------
function resetForm() {
    document.getElementById("nameInput").value = "";
    document.getElementById("emailInput").value = "";
    document.getElementById("cityInput").value = "";
    document.getElementById("stateInput").value = "";
    document.getElementById("signerType").value = "";
    document.getElementById("commentInput").value = "";

    // Reset all conditional dropdowns and inputs
    ["studentLevel", "facultyRole", "militaryBranch", "militaryStatus", "industrySector"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });
    ["studentMajor", "facultyDept", "industryCompany", "otherAffiliation"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });

    // Hide all conditional sections
    document.querySelectorAll(".conditional-section").forEach(s => s.classList.remove("visible"));
}

// ------------------------------------------------------------------
// Handle form submission
// ------------------------------------------------------------------
function handleSubmit(e) {
    e.preventDefault();

    const errorEl = document.getElementById("formError");
    const errorMsg = validateForm();

    if (errorMsg) {
        errorEl.textContent = errorMsg;
        errorEl.classList.add("visible");
        return;
    }

    // Clear error
    errorEl.classList.remove("visible");
    errorEl.textContent = "";

    // Build signature object
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

    // Add to table and reset form
    addTableRow(sig);
    resetForm();
}

// ------------------------------------------------------------------
// Initialize on page load
// ------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
    // Load seed data into table
    seedSignatures.forEach(sig => addTableRow(sig));

    // Attach signer type change listener
    document.getElementById("signerType").addEventListener("change", handleSignerTypeChange);

    // Attach submit listener
    document.getElementById("petitionForm").addEventListener("submit", handleSubmit);
});
