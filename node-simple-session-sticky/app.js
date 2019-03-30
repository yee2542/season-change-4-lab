const path = require('path')
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
// const morgan = require('morgan')

const authen = require('./authen')

const app = express()

app.use(session({
  secret: 'secretja',
  resave: false,
  saveUninitialized: false
}))

// app.use(morgan())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static('public'))

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/login.html'))
})

app.post('/login', (req, res) => {
  authen(req.body.username, req.body.password, (state) => {
    if (state) {
      req.session.username = state
    } else {
    }
  })
  res.redirect('/login/callback')
})

app.get('/login/callback', (req, res) => {
  if (req.session) {
    if (req.session.username) {
      res.redirect('/user')
    }
  } else {
    res.redirect('/login')
  }
})

app.get('/user', (req, res) => {
  if (req.session) {
    if (req.session.username) {
      res.send(req.session.username)
    }
  }
  res.redirect('/login')
})

const http = require('http')
const server = http.createServer(app)

require('sticky-cluster')(
  // server initialization function
  callback => {
    // configure an app
    // do some async stuff if needed
    // don't do server.listen(), just pass the server instance into the callback
    callback(server)
  },

  // options
  {
    concurrency: 4,
    port: 8080,
    debug: true
  }
)
