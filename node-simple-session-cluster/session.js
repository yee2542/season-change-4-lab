
const session = require('express-session')
const RedisStore = require('connect-redis')(session)

module.exports = {
  name: 'KMUTT-online-banking',
  resave: true,
  saveUninitialized: true,
  secret: 'secretja',
  cookie: {
    path: '/',
    httpOnly: true
  },
  store: new RedisStore({ host: 'localhost' })
}
