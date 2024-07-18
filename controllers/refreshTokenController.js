const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const jwt = require("jsonwebtoken");

const handleRefreshToken = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  console.log(cookies.jwt);
  const refreshToken = cookies.jwt;

  const userInDB = usersDB.users.find(
    (person) => person.refreshToken === refreshToken
  );
  if (!userInDB) return res.sendStatus(403); // forbidden

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || userInDB.username !== decoded.username)
      return res.sendStatus(403);
    const roles = Object.values(userInDB.roles);
    const accesstoken = jwt.sign(
      { UserInfo: { username: decoded.username, roles: roles } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    res.json({ accesstoken });
  });
};

module.exports = { handleRefreshToken };
