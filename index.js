require('./config/db-config')
const express = require('express')
const path = require('path')
const hbs = require('hbs')
const bodyParser = require('body-parser')
const upload = require('express-fileupload')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('passport')



const port = process.env.PORT || 2500
const app = express()

app.use(upload())
app.use(express.static(path.join(__dirname, './public')))
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
app.use(methodOverride('_method'))

//setting view engine
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, './views'))
hbs.registerPartials(__dirname + '/views/partials');

app.use(session({
  secret: 'thisisatemplate',
  resave: true,
  saveUninitialized: true
}))

//express flash
app.use(flash());

app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next)=> {
  res.locals.user = req.user || null
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next()
})

const main = require('./routes/main')
const task = require('./routes/task')

app.use('/', main)
app.use('/task', task)


app.listen(port, ()=> {
  console.log(`Server is up and running on port ${port}`)
})