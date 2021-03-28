const fs = require("fs");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const port = 8080;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public/images"));

const readFileData = (filename, callback) => {
  fs.readFile(__dirname + filename, (err, data) => {
    if (err) {
      console.log(err);
      callback(null);
    } else {
      callback(data);
    }
  });
};

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
  readAndServeFileData("/cart.json", res);
});

app.post("/cart", (req, res) => {
  try {
    let cart = null,
      products = null;
    readFileData("/cart.json", (data) => {
      cart = JSON.parse(data);
      readFileData("/products.json", (data) => {
        products = JSON.parse(data);
        cart.push(products[req.body.id]);
        console.log(cart.length);
        fs.writeFile("/cart.json", JSON.stringify(cart), (err) => {
          res.status(500);
          res.end();
        });
      });
    });

    readFileData("/cart.json", (data) => console.log(JSON.parse(data).length));

    res.status(200);
  } catch (err) {
    console.log(err);
    res.status(500);
  }

  res.end();
});

app.put("/cart", (req, res) => {
  try {
    let cart = null;
    readFileData("/cart.json", (data) => {
      cart = JSON.parse(data);
      cart[req.body.id].quantity += req.body.val;
      console.log(cart);
      fs.writeFile("/cart.json", JSON.stringify(cart), (err) => {
        res.status(500);
        res.end();
      });
    });

    readFileData("/cart.json", (data) => console.log(JSON.parse(data).length));

    res.status(200);
  } catch (err) {
    console.log(err);
    res.status(500);
  }

  res.end();
});

app.delete("/cart", (req, res) => {
  try {
    let cart = null;
    readFileData("/cart.json", (data) => {
      cart = JSON.parse(data);
      cart = cart.filter((item, id) => id !== req.body.id);
      console.log(cart);
      fs.writeFile("/cart.json", JSON.stringify(cart), (err) => {
        res.status(500);
        res.end();
      });
    });

    readFileData("/cart.json", (data) => console.log(JSON.parse(data).length));

    res.status(200);
  } catch (err) {
    console.log(err);
    res.status(500);
  }

  res.end();
});

app.listen(port, () => {
  console.log("server running on", port);
});
