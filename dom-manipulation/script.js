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

// Add new quote from input
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

  const displayDiv = document.getElementById("quoteDisplay");
  displayDiv.innerHTML = "";

  const quoteText = document.createElement("p");
  quoteText.textContent = `"${newText}"`;

  const quoteCategory = document.createElement("p");
  quoteCategory.textContent = `Category: ${newCategory}`;

  displayDiv.appendChild(quoteText);
  displayDiv.appendChild(quoteCategory);

  alert("Quote added and displayed!");
}

// Dynamically create the add quote form
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

// Export quotes to JSON
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

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert("Quotes imported successfully!");
        showRandomQuote();
      } else {
        alert("Invalid file format.");
      }
    } catch (err) {
      alert("Error parsing JSON file.");
    }
  };

  fileReader.readAsText(event.target.files[0]);
}

// On page load
document.addEventListener("DOMContentLoaded", function () {
  loadQuotes();
  createAddQuoteForm();
  showRandomQuote();

  // Show New Quote button
  const newQuoteButton = document.getElementById("newQuote");
  if (newQuoteButton) {
    newQuoteButton.addEventListener("click", showRandomQuote);
  }

  // Export JSON button
  const exportBtn = document.createElement("button");
  exportBtn.id = "exportBtn";
  exportBtn.textContent = "Export Quotes (JSON)";
  exportBtn.addEventListener("click", exportQuotesToJson);
  document.body.appendChild(exportBtn);

  // Import JSON input
  const importInput = document.createElement("input");
  importInput.setAttribute("type", "file");
  importInput.setAttribute("id", "importFile");
  importInput.setAttribute("accept", ".json");
  importInput.addEventListener("change", importFromJsonFile);
  document.body.appendChild(importInput);
});
