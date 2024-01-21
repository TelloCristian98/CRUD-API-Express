const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const databasePath = path.resolve(__dirname, "../../database");
const usersFilePath = path.join(databasePath, "users.js");

const initializeDataFile = (fileName) => {
  const filePath = path.join(databasePath, `${fileName}.js`);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, `module.exports = [];`);
  }
};

initializeDataFile("users");

const getUsers = () => {
  try {
    const users = require(usersFilePath);
    return users;
  } catch (error) {
    console.error("Error getting users:", error.message);
    return [];
  }
};

const writeUsers = (users) => {
  try {
    fs.writeFileSync(
      usersFilePath,
      `module.exports = ${JSON.stringify(users, null, 2)};`
    );
  } catch (error) {
    console.error("Error writing in the file:", error.message);
  }
};

const removeUser = (id) => {
  const users = getUsers();
  const index = users.findIndex((user) => user.id === id);
  users.splice(index, 1);
  writeUsers(users);
};

router.get("/", (req, res) => {
  const users = getUsers();
  res.json(users);
});

router.post("/", (req, res) => {
  try {
    const newUser = {
      id: Date.now(), // Generamos un ID único basado en la marca de tiempo
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: parseInt(req.body.age),
    };

    const users = getUsers();
    users.push(newUser);
    writeUsers(users);
    res.json(newUser);
  } catch (error) {
    console.error("Post Request error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updatedUser = {
      id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: parseInt(req.body.age),
    };

    const users = getUsers();
    const index = users.findIndex((user) => user.id === id);
    users[index] = updatedUser;
    writeUsers(users);
    res.json(updatedUser);
  } catch (error) {
    console.error("Put Request error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    removeUser(id);
    res.json({ id: id,message: "User deleted" });
  } catch (error) {
    console.error("Delete Request error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
