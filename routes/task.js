const express = require('express')
const router = express.Router()
const {
  userAuth
} = require('../helpers/helpers')
const task = require('../controllers/task')

router.post('/add-task', userAuth, task.add_task)
router.post('/get-task', userAuth, task.get_task)
router.post('/mark-done', userAuth, task.mark_done)
router.post('/mark-undo', userAuth, task.mark_undo)
router.post('/delete-task', userAuth, task.delete_task)
module.exports = router