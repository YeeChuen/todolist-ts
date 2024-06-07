const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
const port = 5000;
const todoRoutes = require("./routes/todosRoutes");
const userRoutes = require("./routes/usersRoutes");
dotenv.config();

app.use(cors());
app.use(express.json());
app.use("/todos", todoRoutes);
app.use("/users", userRoutes);

// global middleware
app.use((req, res, next) => {
  console.log(req.method, "-", req.url);
  next();
});

app.listen(port, () => {
  console.log(`Server side listening on port ${port}`);
});
