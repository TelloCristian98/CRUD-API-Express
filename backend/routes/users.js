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

router.get("/", (req, res) => {
  const users = getUsers();
  res.json(users);
});

module.exports = router;
