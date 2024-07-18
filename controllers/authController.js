const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "username and password are requried" });
  const userInDB = await User.findOne({ username: user });
  if (!userInDB) return res.sendStatus(401);
  const match = await bcrypt.compare(pwd, userInDB.password);
  if (match) {
    const roles = Object.values(userInDB.roles);
    // create JWT
    const accesstoken = jwt.sign(
      { UserInfo: { username: userInDB.username, roles: roles } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    const refreshToken = jwt.sign(
      { username: userInDB.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    // saving refreshToken to logged in user
    userInDB.refreshToken = refreshToken;
    const result = await userInDB.save();
    console.log(result);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      //secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accesstoken });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
