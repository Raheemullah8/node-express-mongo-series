const cookieParser = require("cookie-parser");
const express = require("express");
const path = require("path");
const crypto = require('crypto');
const multer = require('multer');
const app = express();
const userModel = require("./schema/user");
const postModel = require("./schema/post");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const post = require("./schema/post");

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

// File upload ka configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/upload'); // Yahan humne image upload ki destination set ki hai
  },
  filename: function (req, file, cb) {
   const fn = crypto.randomBytes(12, (err, byte) => {
    const fn = byte.toString('hex') + path.extname(file.originalname); // Image ka naam random generate kar rahe hain
    cb(null, fn); // Final file name jo server pe store hoga
   });
  }
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.render("index"); // Home page
});
app.get("/login", (req, res) => {
  res.render("login"); // Login page
});
app.get('/test', (req, res) => {
  res.render('upload'); // Image upload ka page
});

// Image upload ke liye route
app.post('/data', upload.single("image"), (req, res) => {
  console.log(req.file); // Image upload hone ke baad console pe output dikhai jaayegi
});

function isLoggedIn(req, res, next) {
  // Check kar rahe hain agar user logged in hai ya nahi
  if (!req.cookies.token) {
    return res.redirect("/login"); // Agar token nahi hai toh login page pe redirect
  } else {
    try {
      let data = jwt.verify(req.cookies.token, "sdjhsadjsdghdsj"); // JWT token verify kar rahe hain
      req.user = data; // User ki information ko request object mein store kar rahe hain
      next();
    } catch (err) {
      return res.send("Invalid Token"); // Agar token invalid hai toh error dikhai jaayegi
    }
  }
}

// Profile page ke liye route
app.get("/profile", isLoggedIn, async (req, res) => {
  const user = await userModel
    .findOne({ email: req.user.email })
    .populate("post"); // User ke posts ko populate kar rahe hain
  res.render("profile", { user });
});

// Post ko like ya unlike karne ke liye route
app.get("/like/:id", isLoggedIn, async (req, res) => {
  let post = await postModel.findOne({ _id: req.params.id }).populate("user");
  // Agar post ko user ne like nahi kiya hai toh like karenge, warna dislike
  if (post.like.indexOf(req.user.userId) == -1) {
    post.like.push(req.user.userId);
  } else {
    post.like.splice(post.like.indexOf(req.user.userId), 1);
  }

  await post.save(); // Changes ko save kar rahe hain
  res.redirect("/profile");
});

// Post ko edit karne ke liye route
app.get("/edit/:id", isLoggedIn, async (req, res) => {
  let post = await postModel.findOne({ _id: req.params.id }).populate("user");
  res.render("edit", { post });
});

// Post ko edit karne ke baad save karna
app.post("/editpost/:id", isLoggedIn, async (req, res) => {
  let post = await postModel.findOneAndUpdate(
    { _id: req.params.id },
    { content: req.body.content } // Content ko update kar rahe hain
  );
  res.redirect("/profile");
});

// New post create karne ke liye route
app.post("/posts", isLoggedIn, async (req, res) => {
  let user = await userModel.findOne({ email: req.user.email });
  let { content } = req.body; // Post ka content

  let post = await postModel.create({
    user: user._id,
    content,
  });
  user.post.push(post._id); // Post ko user ke posts mein add kar rahe hain
  await user.save();
  res.redirect("/profile"); // Profile page pe redirect kar rahe hain
});

// User ko register karte waqt route
app.post("/register", async (req, res) => {
  let { username, name, email, password, age } = req.body;
  let user = await userModel.findOne({ email });
  if (user) return res.status(500).send("Email Already Exist"); // Agar email already exist karta hai

  const salt = await bcrypt.genSaltSync(10); // Password hashing ke liye salt generate kar rahe hain
  const hashPassword = await bcrypt.hashSync(password, salt); // Password ko hash kar rahe hain
  let newuser = await userModel.create({
    username,
    name,
    email,
    password: hashPassword,
    age,
  });
  let token = jwt.sign(
    { email: email, userId: newuser._id },
    "sdjhsadjsdghdsj" // JWT token generate kar rahe hain
  );
  res.cookie("token", token); // Token ko cookie mein store kar rahe hain
  res.redirect("/login"); // Login page pe redirect kar rahe hain
});

// User signin ke liye route
app.post("/signin", async (req, res) => {
  let { email, password } = req.body;
  let user = await userModel.findOne({ email });
  if (!user) return res.status(500).send("SomeThing Wrong"); // Agar user nahi milta hai toh error

  const match = await bcrypt.compare(password, user.password); // Password compare kar rahe hain
  if (match) {
    let token = jwt.sign({ email: email, userId: user._id }, "sdjhsadjsdghdsj");
    res.cookie("token", token); // Token ko cookie mein store kar rahe hain
    return res.status(200).redirect("/profile"); // Profile page pe redirect kar rahe hain
  }
});

// Logout karne ke liye route
app.get("/logout", (req, res) => {
  res.cookie("token", ""); // Token ko clear kar rahe hain
  res.redirect("/login"); // Login page pe redirect kar rahe hain
});

app.listen(3000); // Server ko port 3000 pe listen karwa rahe hain
