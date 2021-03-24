const User = require('../models/User')
const Task = require('../models/Task')
const bcrypt = require('bcryptjs');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
var emailEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
var passEx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

const index = (req, res)=> {
  Task.find({
    user: req.user
  })
  .sort({
    createdAt: -1
  })
  .then((tasks=> {
    res.render("main", {
      tasks,
      logged: req.user
    })
  }))
  .catch((err=> {
    console.error(err)
    req.flash("error_msg", "Unknown error")
    res.redirect('/')
  }))
}
const login = (req, res)=> {
  res.render("login")
}

const sign_up = (req, res)=> {

  if ((req.body.username.length < 3) || (req.body.username.length > 50)) {
    req.flash("error_msg", "Username should be Atleast 3 characters");
    res.redirect('/login')
  } else if (!(passEx.test(req.body.password))) {
    req.flash("error_msg", `Password must contain atleast 6 characters with a lowercase, an uppercase and a digit`);
    res.redirect('/login')

  } else if (!(emailEx.test(req.body.email))) {
    req.flash("error", "Please enter a valid email");
    res.redirect('/login')
  } else {
    const newUser = new User();
    newUser.username = req.body.username
    newUser.email = req.body.email
    bcrypt.genSalt(10, async function(err, salt) {
      await bcrypt.hash(req.body.password, salt, function(err, hash) {
        newUser.password = hash
        newUser.save()
        .then((user)=> {
          req.flash("success_msg", "Registered Successfully!")
          res.redirect('/login')
        })
        .catch((err=> {
          console.error(err)
          req.flash("error_msg", "Details already exist!")
          res.redirect('/login')
        }))
      });
    })
  }
}

passport.use(new LocalStrategy({
  usernameField: 'login_username',
  passwordField: 'login_password'
}, (username, password, done)=> {
  User.findOne({
    username
  }).then((user)=> {
    if (!user) return done(null, false,
      {
        message: 'No user found!'
      }
    )
    bcrypt.compare(password, user.password, (err, matched)=> {
      if (err) return err
      if (matched) {
        return done(null, user)
      } else {
        return done(null, false,
          {
            message: 'Incorrect Password!'
          }
        )
      }
    })
  }).catch(err=> {
    console.error(err)
    req.flash("error_msg",
      "Could not login due to unknown error")
    res.redirect("/login")
  })
}))

passport.serializeUser((user, done)=> {
  done(null, user.id)
})
passport.deserializeUser((id, done)=> {
  User.findById(id, (err, user)=> {
    done(err, user)
  })
})


const sign_in = (req, res, next)=> {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
}

const log_out = (req, res)=> {
  req.logOut()
  res.redirect('/login')
}

module.exports = {
  index,
  login,
  sign_up,
  sign_in,
  log_out
}