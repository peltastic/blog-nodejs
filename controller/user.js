const UserModel = require("../model/user");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")
dotenv.config()

const sign_user_up = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  if (!email || !password) {
    return res.status(400).json({ error: "Email and Password Required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password too short" });
  }
  let user;
  try {
    const IsEMailRegistered = await UserModel.findOne({ email: email });
    console.log(IsEMailRegistered);
    if (IsEMailRegistered) {
      return res.status(400).json({ error: "Email Registered" });
    }
    user = await UserModel.create(req.body);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
  return res
    .status(201)
    .json({ sucess: true, message: "user created sucessfully", user: user });
};

const login_user = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  if (password.length < 6) {
    return res.status(400).json({ error: "Password too short" });
  }
  //   try {
  const user = await UserModel.findOne({ email: email });
  if (!user) {
    return res.status(400).json({ error: "Email or Password Required" });
  }
  const validate = await user.isValidPassword(password)
  if (!validate) {
    return res.status(400).json({ error: "Email or Password Required" });
  }
  console.log(user);
  const payload = {
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    id: user._id,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return res.status(200).json({ sucess: true, token: token });
  //   } catch (e) {
  //     return res.status(500).json({ error: e });
  //   }
};

module.exports = { sign_user_up, login_user };
