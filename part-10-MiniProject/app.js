const cookieParser = require("cookie-parser");
const express = require("express");
const path = require("path");
const app = express();
const userModel = require("./schema/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/login", (req, res) => {
  res.render("login");
});

function isLoggedIn(req, res, next) {
    if (!req.cookies.token) {
        return res.send("You must be logged in");
    } else {
        try {
            let data = jwt.verify(req.cookies.token, "sdjhsadjsdghdsj");
            req.user = data;   
            next();  
        } catch (err) {
            return res.send("Invalid Token");
        }
    }
}

  app.get("/profile",isLoggedIn, (req, res) => {
    console.log(req.user)
    res.render("login")
  });
  
app.post("/register", async (req, res) => {
  let { username, name, email, password, age } = req.body;
  let user = await userModel.findOne({ email });
  if (user) return res.status(500).send("Email Already Exist");

  const salt = await bcrypt.genSaltSync(10);
  const hashPassword = await bcrypt.hashSync(password, salt);
  let newuser = await userModel.create({
    username,
    name,
    email,
    password: hashPassword,
    age,
  });
  let token = jwt.sign(
    { email: email, userId: newuser._id },
    "sdjhsadjsdghdsj"
  );
  res.cookie("token", token);
  res.send("user-Register");
});
app.post("/singin", async (req, res) => {
  let { email, password } = req.body;
  let user = await userModel.findOne({ email });
  if (!user) return res.status(500).send("SomeThing Wrong");
  const match = await bcrypt.compare(password, user.password);
  if (match) {
    let token = jwt.sign({ email: email, userId: user._id }, "sdjhsadjsdghdsj");
    res.cookie("token", token);
    return res.status(200).send("You Are Logged In");
  }
});

app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/login");
});


app.listen(3000);
