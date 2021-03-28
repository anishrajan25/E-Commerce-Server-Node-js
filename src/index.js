const fs = require("fs");
const express = require("express");
const cors = require("cors");

const port = 8080;

const app = express();

app.use(cors());
app.use(express.static("public/images"));

const readAndServeFileData = (filename, res) => {
  fs.readFile(__dirname + filename, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.set("Content-Type", "application/json");
      res.send(JSON.parse(data));
    }
  });
};

app.get("/", (req, res) => {
  readAndServeFileData("/products.json", res);
});

app.get("/cart", (req, res) => {
  readAndServeFileData("/products.json", res);
});

app.listen(port, () => {
  console.log("server running on", port);
});
