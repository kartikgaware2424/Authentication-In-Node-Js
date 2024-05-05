const express = require("express");
const cookieParser=require("cookie-parser");
const path = require("path");
const {v4:uuidv4}= require("uuid")
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const {setUser} =require("./service/auth");
const {restrictToLoggedUserOnly}=require('./middleware/authentication');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(cookieParser());

mongoose
  .connect("mongodb://127.0.0.1:27017/auth", {})
  .then(() => {
    console.log("Connected to Mongoose");
  })
  .catch((err) => {
    console.log("Error connecting to Mongoose");
    console.error(err);
  });

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", UserSchema);

app.post("/user", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    await User.create({
      name,
      email,
      password,
    });
    return res.render("home");
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/signup", (req, res) => {
  return res.render("signup");
});

app.post("/users", async (req, res) => {
  const {email, password } = req.body;
  try {
    const user = await User.findOne({
      email,
      password,
    });
    if (!user)
      return res.render("login", {
        error: "Invalid Username or Password",
      });
       

      const ressionId=uuidv4();
      setUser(ressionId,user);
      res.cookie("uid",ressionId);
        return res.render("home");

      
   
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/login", (req, res) => {
  return res.render("login");
});

app.get('/url',restrictToLoggedUserOnly,(req,res)=>{
  return res.render("home")
})
app.listen(8000, () => {
  console.log("Server Started!!");
});
