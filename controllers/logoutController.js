const User = require("../model/User");

const handleLogout = async (req, res) => {
  // on client, delete access token

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // no content
  const refreshToken = cookies.jwt;

  // Is refreshToken in db
  const userInDB = await User.findOne({ refreshToken }).exec();
  if (!userInDB) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.sendStatus(204); // forbidden
  }

  userInDB.refreshToken = "";
  const result = await userInDB.save();
  console.log(result);

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.sendStatus(204);
};

module.exports = { handleLogout };
