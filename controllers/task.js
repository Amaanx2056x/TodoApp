const User = require('../models/User')
const Task = require('../models/Task')

const add_task = async (req, res)=> {
  if (req.body.title.length > 50 || req.body.body.length > 1000) {
    req.flash("error_msg", "Title or body is too long")
    res.redirect('/')
  } else {
    const newTask = new Task()
    newTask.title = req.body.title
    newTask.body = req.body.body
    newTask.user = req.user
    await newTask.save()
    .then(task=> {
      res.send(task)
    })
    .catch(err=> {
      console.error(err)
      req.flash('error_msg', 'Unknown error')
      res.redirect('/')
    })
  }
}

const get_task = (req, res)=> {
  Task.findOne({
    _id: req.body.id
  })
  .then((task=> {
    res.send(task)
  }))
  .catch((err=> {
    console.error(err)
    req.flash('error_msg', 'Unknown error')
    res.redirect('/')
  }))
}

const delete_task = (req, res)=> {
  Task.findOne({
    _id: req.body.id
  })
  .then((task=> {
    res.send(task)
    task.remove()
  }))
  .catch((err=> {
    console.error(err)
    req.flash('error_msg', 'Unknown error')
    res.redirect('/')
  }))
}

const mark_done = (req, res)=> {
  Task.findOne({
    _id: req.body.id
  })
  .then((task=> {
    task.completed = true
    task.save().then((saved=> {
      res.send(saved)
    }))
  }))
  .catch((err=> {
    console.error(err)
    req.flash('error_msg', 'Unknown error')
    res.redirect('/')
  }))

}


const mark_undo = (req, res)=> {
  Task.findOne({
    _id: req.body.id
  })
  .then((task=> {
    task.completed = false
    task.save().then((saved=> {
      res.send(saved)
    }))
  }))
  .catch((err=> {
    console.error(err)
    req.flash('error_msg', 'Unknown error')
    res.redirect('/')
  }))

}
module.exports = {
  add_task,
  get_task,
  delete_task,
  mark_done,
  mark_undo
}