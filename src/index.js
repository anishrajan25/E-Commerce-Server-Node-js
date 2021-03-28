const express = require("express");

const port = 8080;

const app = express();

app.get("/", (req, res) => {
  res.end("Hello Welcome!");
});

app.get("/about", (req, res) => {
  res.end("About");
});

app.listen(port, () => {
  console.log("server running on", port);
});
