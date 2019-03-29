const http = require('http')
const fs = require('fs')
const path = require('path')

const publicPath = path.join(__dirname, '/public', 'index.html')

http.createServer((req, res) => {
  fs.readFile(publicPath, (err, data) => {
    if (err) {
      res.write(err)
    }
    res.write(data)
    res.end()
  })
}).listen(8080)
console.log('start server node static at 8080')
