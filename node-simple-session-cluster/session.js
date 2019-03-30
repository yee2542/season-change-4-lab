
const session = require('express-session')
const RedisStore = require('connect-redis')(session)

module.exports = {
  name: 'season-change-session',
  resave: true,
  saveUninitialized: true,
  secret: 'secretja',
  cookie: {
    path: '/',
    httpOnly: true
  },
  store: new RedisStore({ host: 'localhost' })
}
