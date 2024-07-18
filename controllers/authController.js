const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
require("dotenv").config();
const fsPromises = require("fs").promises;
const path = require("path");

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "username and password are requried" });
  const userInDB = usersDB.users.find((person) => person.username === user);
  if (!userInDB) return res.sendStatus(401);
  const match = await bcrypt.compare(pwd, userInDB.password);
  if (match) {
    // create JWT
    const accesstoken = jwt.sign(
      { username: userInDB.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    const refreshToken = jwt.sign(
      { username: userInDB.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    // saving refreshToken to logged in user
    const otherUsers = usersDB.users.filter(
      (person) => person.username !== userInDB.username
    );
    const currentUser = { ...userInDB, refreshToken };
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users)
    );
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accesstoken });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
