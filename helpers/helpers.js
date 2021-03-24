const moment = require('moment')
module.exports = {
  userAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect('/login')
    }
  },
  dateFormat: function(date, format) {
    return moment(date).format(format)
  }
}