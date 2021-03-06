const path = require('path')
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
// const morgan = require('morgan')

const authen = require('./authen')

const app = express()

const configSession = require('./session')
app.use(session(configSession))

// app.use(morgan())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static('public'))

app.get('/login', (req, res) => {
  console.log(`PID : ${process.pid} get request`)
  res.sendFile(path.join(__dirname, '/public/login.html'))
})

app.post('/login', (req, res) => {
  console.log(`PID : ${process.pid} post request`)
  authen(req.body.username, req.body.password, (state) => {
    if (state) {
      req.session.username = state
    }
  })
  res.redirect('/login/callback')
})

app.get('/login/callback', (req, res) => {
  console.log(`PID : ${process.pid} get request`)
  if (req.session) {
    if (req.session.username) {
      return res.redirect('/user')
    }
  } else {
    return res.redirect('/login')
  }
})

app.get('/user', (req, res) => {
  console.log(`PID : ${process.pid} get request`)
  if (req.session) {
    if (req.session.username) {
      return res.send(req.session.username)
    }
  }
  res.redirect('/login')
})

const cluster = require('cluster')
const numCPUs = 4

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`)

  // fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`)
  })
} else {
  // server listen threads
  app.listen(8080, () => {
    console.log(`start server PID ${process.pid}`)
  })
}
