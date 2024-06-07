const router = require("express").Router();
const jwt = require("jsonwebtoken");
const generateId = require("../utils/idGenerator");

const idSet = new Set(["i819"]);
const users = [
  {
    id: "i819",
    username: "dummy",
    password: "Dummy123",
  },
  {
    id: "i829",
    username: "login user",
    password: "LoginUser123",
  },
];

// GET all users
router.get("/", (req, res) => {
  res.send(users);
});

// Register a new user
router.post("/register", (req, res) => {
  const newUser = { ...req.body };
  if (
    !newUser.hasOwnProperty("username") ||
    !newUser.hasOwnProperty("password")
  ) {
    res.status(500).send({
      message: "Request body missing property 'username' or 'password'",
    });
    return;
  }
  // if the new user does not have an id.
  if (!newUser.hasOwnProperty("id")) {
    let newId = generateId();
    if (idSet.has(newId)) newId = generateId();
    newUser.id = newId;
  } else {
    if (idSet.has(newUser.id)) {
      res.status(500).send({ message: "Request body contain duplicate 'id'" });
      return;
    }
  }
  users.push(newUser);
  idSet.add(newUser.id);
  res.send(newUser);
});

// Login user to get a jwt token
router.post("/login", (req, res) => {
  const loginUser = { ...req.body };
  const user = users.find((user) => {
    return user.username === loginUser.username;
  });
  if (!user) {
    res.status(401).send("Username does not exist");
    return;
  }
  if (user.password !== loginUser.password) {
    res.status(401).send("Incorrect password for username");
    return;
  }

  const accessToken = jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  res.send({
    accessToken,
  });
});

module.exports = router;
