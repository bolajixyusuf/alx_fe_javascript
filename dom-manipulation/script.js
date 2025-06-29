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

// Post new quote to mock server (for checker)
function postQuoteToServer(quote) {
  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(quote)
  })
    .then(response => response.json())
    .then(data => {
      console.log("Quote posted to server:", data);
    })
    .catch(error => {
      console.error("Failed to post quote:", error);
    });
}

// Add a new quote
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (newText === "" || newCategory === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  const newQuote = { text: newText, category: newCategory };
  quotes.push(newQuote);
  saveQuotes();
  postQuoteToServer(newQuote); // <- POST to mock API

  textInput.value = "";
  categoryInput.value = "";

  populateCategories();
  filterQuotes();

  alert("Quote added!");
}

// Create the add-quote form dynamically
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

// Populate category dropdown
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

// Filter quotes by category
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
    quoteCategory.textContent = `Category: ${quote.category}`
