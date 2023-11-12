const express=require("express");
const bcrypt=require("bcryptjs")
const router =express.Router();
const User=require("../models/user");
const jwt=require("jsonwebtoken");

router.post("/register",(req,res,next)=>{
    const { username, password,email, fullname } = req.body;
    User.findOne({ username: req.body.username })
      .then((user) => {
        // res.json(user)
        if (user) return res.status(400).json({ error: "duplicate username" });
        bcrypt.hash(password, 10, (err, hash) => {
          if (err) return res.status(500).json({ error: err.message });
          User.create({ username, password: hash, fullname, email })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch(next);
        });
      })
      .catch(next);
  });




// router.post("/register", (req, res, next) => {
//   const { username, password, email, fullname } = req.body;

//   // Validate required fields
//   if (!username || !password || !email || !fullname) {
//     return res.status(400).json({ error: "All fields are required." });
//   }

//   User.findOne({ username: req.body.username })
//     .then((user) => {
//       if (user) {
//         return res.status(400).json({ error: "Duplicate username" });
//       }

//       // Hash the password
//       bcrypt.hash(password, 10, (err, hash) => {
//         if (err) {
//           return res.status(500).json({ error: "Password hashing failed." });
//         }

//         // Create a new user
//         User.create({ username, password: hash, fullname, email })
//           .then((user) => {
//             res.status(201).json(user);
//           })
//           .catch((err) => {
//             res.status(500).json({ error: "Failed to create a new user." });
//           });
//       });
//     })
//     .catch((err) => {
//       res.status(500).json({ error: "Database query error." });
//     });
// });


  router.post("/login", (req, res, next) => {
    User.findOne({ username: req.body.username })
      .then((user) => {
        if (!user) return res.status(404).json({ error: "user not found" });
        bcrypt.compare(req.body.password, user.password, (err, result) => {
          if (err) return res.status(500).json({ error: err.message });
          if (!result)
            return res.status(401).json({ error: "password incorrect" });
  
          const payload = {
            id: user.id,
            username: user.username,
          };
          jwt.sign(payload, process.env.SECRET_KEY, (err, token) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json({ token ,name: user.username});
          });
        });
      })
      .catch(next);
  
      
  });

  router.patch("/:id", (req, res, next) => {
    const { id } = req.params;
    const { username, password } = req.body;
  
    if (!username && !password) {
      return res
        .status(400)
        .json({ error: "Please provide username and/or password" });
    }
  
    User.findById(id)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
  
        if (username) {
          user.username = username;
        }
  
        if (password) {
          bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            user.password = hash;
  
            user
              .save()
              .then((updatedUser) => {
                res.status(200).json(updatedUser);
              })
              .catch(next);
          });
        } else {
          user
            .save()
            .then((updatedUser) => {
              res.status(200).json(updatedUser);
            })
            .catch(next);
        }
      })
      .catch(next);
  });
  

  
  module.exports = router;
  
  



