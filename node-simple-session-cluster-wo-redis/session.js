
const session = require('express-session')

module.exports = {
  name: 'season-change-session',
  resave: true,
  saveUninitialized: true,
  secret: 'secretja',
  cookie: {
    path: '/',
    httpOnly: true
  }
}
