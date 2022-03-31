const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const User = mongoose.model("User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")


router.post("/joining_the_application", (req, res) => {
  const { name, email, password, country, organization, role, intro, pic } = req.body

  var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
  var valid = emailRegex.test(email);
  if (!valid) {
    console.log(email)
    return res.status(422).json({ error: "Invalid email entered" })
  }
  if (!email || !password || !name) {
    return res.status(422).json({ error: "Please add all the fields" })
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ error: "User Already Exists" })
      }
      bcrypt.hash(password, 12)
        .then(hashedpassword => {
          const user = new User({
            email,
            password: hashedpassword,
            name,
            pic,
            country,
            organization,
            role,
            intro
          })
          user.save()
            .then(user => {
              console.log(user)
              res.json({ message: user.name + ' joined the hub.' })
            })
            .catch(err => {
              console.log(err)
            })
        })

    }).catch(err => {
      console.log(err)
    })
})


router.post("/signin", (req, res) => {
  const { email, password } = req.body
  const JWT_SECRET = 'abdullahmujahidali';
  if (!email) {
    return res.status(422).json({ error: "Please provide the email" })
  }
  else if (!password) {
    return res.status(422).json({ error: "Please provide the password" })
  }
  User.findOne({ email: email })
    .then(savedUser => {
      if (!savedUser) {
        return res.status(422).json({ error: "Invalid Email or Password" })
      }
      bcrypt.compare(password, savedUser.password)
        .then(doMatch => {
          if (doMatch) {
            const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
            const { _id, name, email } = savedUser
            res.json({ token, user: { _id, name, email } })
          }
          else {
            return res.status(422).json({ error: "Invalid Email or Password" })
          }
        })
        .catch(err => {
          console.log(err)
        })
    })
})

module.exports = router