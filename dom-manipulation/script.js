let quotes = [];

// Load quotes from localStorage
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show a random quote
function showRandomQuote() {
  if (quotes.length === 0) return;

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  // Save in sessionStorage
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));

  const displayDiv = document.getElementById("quoteDisplay");
  displayDiv.innerHTML = "";

  const quoteText = document.createElement("p");
  quoteText.textContent = `"${quote.text}"`;

  const quoteCategory = document.createElement("p");
  quoteCategory.textContent = `Category: ${quote.category}`;

  displayDiv.appendChild(quoteText);
  displayDiv.appendChild(quoteCategory);
}

// Add a new quote and refresh DOM + storage
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (newText === "" || newCategory === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text: newText, category: newCategory });
  saveQuotes();

  textInput.value = "";
  categoryInput.value = "";

  populateCategories();
  filterQuotes();

  alert("Quote added!");
}

// Dynamically create add-quote form
function createAddQuoteForm() {
  const formDiv = document.createElement("div");

  const quoteInput = document.createElement("input");
  quoteInput.setAttribute("id", "newQuoteText");
  quoteInput.setAttribute("type", "text");
  quoteInput.setAttribute("placeholder", "Enter a new quote");

  const categoryInput = document.createElement("input");
  categoryInput.setAttribute("id", "newQuoteCategory");
  categoryInput.setAttribute("type", "text");
  categoryInput.setAttribute("placeholder", "Enter quote category");

  const addButton = document.createElement("button");
  addButton.setAttribute("id", "addQuoteBtn");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  formDiv.appendChild(quoteInput);
  formDiv.appendChild(categoryInput);
  formDiv.appendChild(addButton);

  document.body.appendChild(formDiv);
}

// Populate dropdown with unique categories
function populateCategories() {
  const filterDropdown = document.getElementById("categoryFilter");
  const selected = localStorage.getItem("selectedCategory") || "all";

  filterDropdown.innerHTML = '<option value="all">All Categories</option>';

  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    filterDropdown.appendChild(option);
  });

  filterDropdown.value = selected;
}

// Filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);

  const filtered = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  const displayDiv = document.getElementById("quoteDisplay");
  displayDiv.innerHTML = "";

  if (filtered.length === 0) {
    displayDiv.textContent = "No quotes found in this category.";
    return;
  }

  filtered.forEach(quote => {
    const quoteText = document.createElement("p");
    quoteText.textContent = `"${quote.text}"`;

    const quoteCategory = document.createElement("p");
    quoteCategory.textContent = `Category: ${quote.category}`;

    displayDiv.appendChild(quoteText);
    displayDiv.appendChild(quoteCategory);
  });
}

// Export to JSON
function exportQuotesToJson() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

// Import from JSON
function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        filterQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON file.");
      }
    } catch (err) {
      alert("Error reading file.");
    }
  };

  fileReader.readAsText(event.target.files[0]);
}

// Show a notification banner
function showNotification(message) {
  let notif = document.getElementById("syncNotification");
  if (!notif) {
    notif = document.createElement("div");
    notif.id = "syncNotification";
    notif.style.backgroundColor = "#fffae6";
    notif.style.color = "#000";
    notif.style.border = "1px solid #ccc";
    notif.style.padding = "10px";
    notif.style.margin = "10px 0";
    notif.style.fontWeight = "bold";
    document.body.insertBefore(notif, document.getElementById("quoteDisplay"));
  }
  notif.textContent = message;
}

// Simulate fetching quotes from a server
function fetchQuotesFromServer() {
  return new Promise(resolve => {
    const simulatedQuotes = [
      { text: "Server quote 1", category: "Motivation" },
      { text: "Server quote 2", category: "Inspiration" }
    ];
    setTimeout(() => resolve(simulatedQuotes), 1000);
  });
}

// Sync quotes with server, resolve conflicts
function syncWithServer() {
  fetchQuotesFromServer().then(serverQuotes => {
    let newQuotes = 0;

    serverQuotes.forEach(serverQuote => {
      const exists = quotes.some(
        q => q.text === serverQuote.text && q.category === serverQuote.category
      );
      if (!exists) {
        quotes.push(serverQuote);
        newQuotes++;
      }
    });

    if (newQuotes > 0) {
      saveQuotes();
      populateCategories();
      filterQuotes();
      showNotification(`${newQuotes} new quote(s) added from server.`);
    } else {
      console.log("No new quotes from server.");
    }
  }).catch(() => {
    showNotification("Error syncing with server.");
  });
}

// On page load
document.addEventListener("DOMContentLoaded", function () {
  loadQuotes();
  createAddQuoteForm();

  // Create category filter dropdown
  const categorySelect = document.createElement("select");
  categorySelect.id = "categoryFilter";
  categorySelect.addEventListener("change", filterQuotes);
  document.body.insertBefore(categorySelect, document.getElementById("quoteDisplay"));

  populateCategories();
  filterQuotes();

  // Show Random Quote button
  const newQuoteButton = document.getElementById("newQuote");
  if (newQuoteButton) {
    newQuoteButton.addEventListener("click", showRandomQuote);
  }

  // Export button
  const exportBtn = document.createElement("button");
  exportBtn.id = "exportBtn";
  exportBtn.textContent = "Export Quotes (JSON)";
  exportBtn.addEventListener("click", exportQuotesToJson);
  document.body.appendChild(exportBtn);

  // Import input
  const importInput = document.createElement("input");
  importInput.type = "file";
  importInput.id = "importFile";
  importInput.accept = ".json";
  importInput.addEventListener("change", importFromJsonFile);
  document.body.appendChild(importInput);

  // Initial sync + periodic sync
  syncWithServer();
  setInterval(syncWithServer, 30000); // every 30s
});
