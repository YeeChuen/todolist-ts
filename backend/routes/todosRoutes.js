const router = require("express").Router();
const jwt = require("jsonwebtoken");
const generateId = require("../utils/idGenerator");

const idSet = new Set(["a4e2"]);
const todos = [
  {
    id: "a4e2",
    content: "first todo",
    userId: "i819",
  },
  {
    id: "a6e2",
    content: "todo to delete",
    userId: "i819",
  },
  {
    id: "a7e2",
    content: "todo for update",
    userId: "i819",
  },
];

// GET method to get new todo
router.get("/", (req, res) => {
  res.send(todos);
});

// POST method to create new todo
router.post("/", authentication, (req, res) => {
  const user = req.user; // <-- available after authentication
  const newTodo = { ...req.body };
  if (!newTodo.hasOwnProperty("content")) {
    res
      .status(500)
      .send({ message: "Request body missing property 'content'" });
    return;
  }
  // if the new todo does not have an id.
  if (!newTodo.hasOwnProperty("id")) {
    let newId = generateId();
    if (idSet.has(newId)) newId = generateId();
    newTodo.id = newId;
  } else {
    if (idSet.has(newTodo.id)) {
      res.status(500).send({ message: "Request body contain duplicate 'id'" });
      return;
    }
  }
  // attached the todo with this user id
  newTodo.userId = user.id;

  todos.push(newTodo);
  idSet.add(newTodo.id);
  res.send(newTodo);
});

// PATCH method to update existing todo
router.patch("/:id", authentication, (req, res) => {
  const user = req.user; // <-- available after authentication
  const { id: todoId } = req.params;
  const updateTodo = { ...req.body };
  // find the todo, and update
  const index = todos.findIndex((todo) => {
    return todo.id === todoId;
  });
  if (index === -1) {
    res.status(400).send({ message: "Todo does not exist" });
    return;
  } else {
    // check if this todo belong to this user
    if (todos[index].userId !== user.id) {
      res.status(500).send({ message: "Invalid user" });
      return;
    }

    todos[index].content = updateTodo.content
      ? updateTodo.content
      : todos[index].content;

    res.send(todos[index]);
  }
});

// DELETE method to delete todo
router.delete("/:id", authentication, (req, res) => {
  const user = req.user; // <-- available after authentication

  const { id: todoId } = req.params;
  // find the todo, and delete
  const index = todos.findIndex((todo) => {
    return todo.id === todoId;
  });
  if (index === -1) {
    res.status(400).send({ message: "Todo does not exist" });
    return;
  } else {
    // check if this todo belong to this user
    if (todos[index].userId !== user.id) {
      res.status(500).send({ message: "Invalid user" });
      return;
    }
    todos.splice(index, 1);
    res.send({ message: "Success" });
  }
});

// GET method to get todo from specific user
router.get("/user/:userId", authentication, (req, res) => {
  const { userId } = req.params;
  const user = req.user; // <-- available after authentication
  if (userId !== user.id) {
    res.status(401).send("Invalid user");
    return;
  }
  const userTodos = todos.filter((todo) => {
    return todo.userId === user.id;
  });
  res.send(userTodos);
});

function authentication(req, res, next) {
  if (!req.headers["authorization"]) {
    res
      .status(401)
      .send({ message: "authentication error, missing authorization bearer" });
    return;
  }
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];

  if (token == null) {
    res.status(401).send({ message: "authentication error" });
    return;
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      res.status(401).send("authentication error");
      return;
    }
    req.user = user;
    next();
  });
}

module.exports = router;
