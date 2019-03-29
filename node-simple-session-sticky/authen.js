module.exports = (username, password, cb) => {
  const data = [{
    username: 'admin',
    password: '1234'
  },
  { username: 'user',
    password: 'password' }
  ]

  data.forEach(e => {
    if (e.username === username) {
      if (e.password === password) {
        return cb(e.username)
      } else return cb(false)
    } else return cb(false)
  })
}
