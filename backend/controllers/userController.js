const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModels");
const UserData = require("../models/userData");
const { ObjectId } = require('mongoose').Types;

// @desc Register new user
// @route POST /api/users
// @access Public
const registerUser = async (req, res) => {
  const { firstname, lastname, email, password, phone } = req.body;

  // Check if all data is given
  if (!firstname || !lastname || !email || !password) {
    return res.status(400).json({ message: "One attribute is missing" });
  }

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exist" });
  }

  // Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    firstname,
    lastname,
    phone,
    email,
    password: hashedPassword,
  });
  if (user) {
    res.status(201).json({
      _id: user.id,
      firstname: user.firstname,
      lastnake: user.lastname,
      phone: user.phone,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: "Something Went WRong" });
  }
};

// @desc Authenticate User
// @route POST /api/login
// @access Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "Plase fill email and password" });
  } else {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200);
      res.json({
        _id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        phone: user.phone,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid email or password" });
    }
  }
};

// @desc Get user data
// @route GET /api/users/me
// @access private
const getMe = async (req, res) => {
  const { _id, firstname, lastname, phone, email } = await User.findById(
    req.user.id
  );
  res.status(200).json({
    id: _id,
    firstname,
    lastname,
    phone,
    email,
  });
};

// @desc set user data info when loggedin
// @route POST /api/userdata:userId
// @access private
const userData = async (req, res) => {
  const { userId, aboutMe, onTheWeb, personalInformation, interests } =
    req.body;

  // Check if all data is given
  if (!userId) {
    return res.status(400).json({ message: "userId is missing" });
  }

  // Check if user exists
  const userExists = await UserData.findOne({ userId });
  if (userExists) {
    return res.status(400).json({ message: " User already exist" });
  }
  // Create user
  const user = await UserData.create({
    userId:new ObjectId(userId),
    aboutMe,
    onTheWeb,
    personalInformation,
    interests,
  });
  if (user) {
    res.status(201).json({ message: "userData Created" });
  } else {
    res.status(400).json({ message: "Something Went WRong" });
  }
};

// @update user data info
// @route PUT /api/updatauserdata/
// @access private
const updateUserData = async (req, res) => {
  const userId = req.params.userId;
  const { aboutMe, onTheWeb, interests } = req.body;

  try {
    const updatedUser = await UserData.findOneAndUpdate(
      { userId },
      { aboutMe, onTheWeb, interests },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).send(`User with userId ${userId} not found.`);
    }
    return res.status(200).json({
      userId: updatedUser.userId,
      aboutMe: updatedUser.aboutMe,
      onTheWeb: updatedUser.onTheWeb,
      interests: updatedUser.interests,
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};

// @desc Get user data info
// @route GET /api/getuserdata:userId
// @access private
const getUserData = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await UserData.findOne({ userId });

    if (!user) {
      return res
        .status(404)
        .message({ message: `User with userId ${userId} not found.` });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "user Not Found" });
  }
};
// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
module.exports = {
  userData,
  registerUser,
  loginUser,
  getMe,
  updateUserData,
  getUserData,
};
