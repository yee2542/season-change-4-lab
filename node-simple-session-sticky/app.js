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

const cluster = require('cluster')
const numCPUs = 3
const http = require('http')
const server = http.createServer(app)
const sticky = require('sticky-session')

// cluster listener
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`)
  process.title = 'wmc : master process'

  // fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }
  sticky.listen(server, 8081, () => {
    console.log(`start server PID ${process.pid}`)
  })

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`)
  })
} else {
  // process name
  process.title = 'wmc : threads process'

  // server listen threads

  server.listen(8081, () => {
    console.log(`start server PID ${process.pid}`)
  })
}

// BOT ENV
if (process.env.BOT === 'true') {
  require('./tools/register-test')()
}
