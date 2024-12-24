const express = require("express");
const axios = require("axios");
const rules = require("./config/rules");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

const API_URL = "http://qa-gb.api.dynamatix.com:3100/api/applications/getApplicationById/67339ae56d5231c1a2c63639";

// Fetch data from the API
const fetchData = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// Evaluate checklist rules
const evaluateRules = (data) => {
  return rules.map((rule) => ({
    name: rule.name,
    status: rule.condition(data) ? "Passed" : "Failed",
  }));
};

// Route to display the dashboard
app.get("/", async (req, res) => {
  const data = await fetchData();
  if (!data) {
    return res.render("index", { results: null, error: "Failed to fetch data" });
  }
  const results = evaluateRules(data);
  res.render("index", { results, error: null });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
