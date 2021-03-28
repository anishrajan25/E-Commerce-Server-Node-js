const fs = require("fs");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const port = 8080;

const app = express();

fs.writeFile("/cart.json", "trying", () => console.log("done n"));

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
      if (!data) {
        res.status(502);
        res.end();
        return;
      }
      cart = JSON.parse(data);
      readFileData("/products.json", (data) => {
        if (!data) {
          res.status(502);
          res.end();
          return;
        }
        products = JSON.parse(data);
        cart.push(products[req.body.id]);
        console.log(cart.length);
        fs.writeFile("/cart.json", JSON.stringify(cart), (err) => {
          if (err) {
            res.status(500);
            res.end();
            return;
          } else {
            res.status(200);
            res.end();
          }
        });
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500);
    res.end();
  }
});

app.put("/cart", (req, res) => {
  try {
    let cart = null;
    readFileData("/cart.json", (data) => {
      if (!data) {
        res.status(502);
        res.end();
        return;
      }
      cart = JSON.parse(data);
      if (
        cart[req.body.id].quantity + req.body.val < 1 ||
        cart[req.body.id].quantity + req.body.val > 10
      ) {
        console.log("quantity violation");
        res.status(400);
        res.send();
      } else {
        cart[req.body.id].quantity += req.body.val;
        fs.writeFile("/cart.json", JSON.stringify(cart), (err) => {
          if (err) {
            console.log("write file err while put cart");
            res.status(500);
            res.end();
            return;
          }
          res.status(200);

          // readFileData("/cart.json", (data) => console.log(JSON.parse(data)));

          res.end();
        });
      }
    });
  } catch (err) {
    console.log(err.message);
    res.status(500);
    res.end();
  }
});

app.delete("/cart", (req, res) => {
  try {
    let cart = null;
    readFileData("/cart.json", (data) => {
      if (!data) {
        res.status(502);
        res.end();
        return;
      }
      cart = JSON.parse(data);
      cart = cart.filter((item, id) => id !== req.body.id);
      console.log(cart);
      fs.writeFile("/cart.json", JSON.stringify(cart), (err) => {
        if (err) {
          res.status(500);
          res.end();
          return;
        } else {
          res.status(200);
          res.end();
        }
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500);
    res.end();
  }
});

app.listen(port, () => {
  console.log("server running on", port);
});
