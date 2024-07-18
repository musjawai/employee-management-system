const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const fsPromises = require("fs").promises;
const path = require("path");

const handleLogout = async (req, res) => {
  // on client, delete access token

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // no content
  const refreshToken = cookies.jwt;

  // Is refreshToken in db
  const userInDB = usersDB.users.find(
    (person) => person.refreshToken === refreshToken
  );
  if (!userInDB) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.sendStatus(204); // forbidden
  }

  const otherUsers = usersDB.users.filter(
    (person) => person.refreshToken !== userInDB.refreshToken
  );
  const currentUser = { ...userInDB, refreshToken: "" };
  usersDB.setUsers([...otherUsers, currentUser]);

  await fsPromises.writeFile(
    path.join(__dirname, "..", "model", "users.json"),
    JSON.stringify(usersDB.users)
  );

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.sendStatus(204);
};

module.exports = { handleLogout };
