const express = require("express");
const dotenv = require("dotenv");
const app = express();
const port = 5000;

dotenv.config();

app.use(express.json());
app.use("/todos", todoRoutes);

// middleware
function middleware1(req, res, next) {
  console.log("this is middleware 1");
  next();
}

function middleware2(req, res, next) {
  console.log("this is middleware 2");
  next();
}

// global middleware
app.use((req, res, next) => {
  console.log(req.method, "-", req.url);
  next();
});

// middleware for a specific endpoint
app.use("/hello", (req, res, next) => {
  console.log("hello middleware");
  next();
});

app.get("/", [middleware1, middleware2], (req, res) => {
  res.json({ message: "hello world" });
});

app.get("/hello", (req, res) => {
  res.send("hello");
});

app.listen(port, () => {
  console.log(`Server side listening on port ${port}`);
});