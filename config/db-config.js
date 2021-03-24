const mongoose = require('mongoose')
require('dotenv').config()
/*mongoose.connect('mongodb://localhost:27017/todo2x', {
  useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true
})*/
mongoose.connect(process.env.DB_URL, {
  useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true
})
.then((db)=> {
  console.log('Connected!')
}).catch((e)=> {
  console.log('Error')
})