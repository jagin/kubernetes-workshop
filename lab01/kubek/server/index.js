const http = require('http')
const os = require('os')
const fs = require('fs')
const router = require('./router')

const port = process.env.PORT || 8000
const host = process.env.HOST || 'localhost'

const authUser = process.env.AUTH_USER || 'user'
const authPassword = process.env.AUTH_PASSWORD || 'passwd'

let requestCount = 0
const maxRequestCount = 0

// Handle your routes here, put static pages in ./public and they will server
router.register('/', (req, res) => {
  const error = maxRequestCount && ++requestCount > maxRequestCount

  res.writeHead(error ? 500 : 200, {'Content-Type': 'text/plain'})
  res.end(`${error? 'ERROR!' : 'OK.'} You\'ve hit ${os.hostname()}\n`)
})

router.register('/health-check', (req, res) => {
  if(fs.existsSync('/var/healthy')) {
    console.log('I\'m healthy.')
    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.end('I\'m healthy.\n')
  } else {
    console.log('Feel sick. Please restart me!')
    res.writeHead(500, {'Content-Type': 'text/plain'})
    res.end('Feel sick. Please restart me!\n')
  }
})

router.register('/secret', (req, res) => {
  const auth = req.headers['authorization']  // auth is in base64(username:password) so we need to decode the base64

  if(!auth) {
    res.writeHead(401, {
      'Content-Type': 'text/plain',
      'WWW-Authenticate': 'Basic realm="Secure Area"'
    })
    res.end('Credentials needed!')
  } else if(auth) {
    const tmp = auth.split(' ')   // Split on a space, the original auth looks like  "Basic Y2hhcmxlczoxMjM0NQ==" and we need the 2nd part
    const buf = new Buffer(tmp[1], 'base64') // create a buffer and tell it the data coming in is base64
    const plain_auth = buf.toString()        // read it back out as a string

    // At this point plain_auth = "username:password"
    const creds = plain_auth.split(':')      // split on a ':'
    const username = creds[0]
    const password = creds[1]

    if((username == authUser) && (password == authPassword)) {   // Is the username/password correct?
      res.writeHead(200, {'Content-Type': 'text/plain'})
      res.end('You are authorized!')
    }
    else {
      res.writeHead(403, {
        'Content-Type': 'text/plain',
        'WWW-Authenticate': 'Basic realm="Secure Area"'
      })
      res.end('You shall not pass!')      
    }
  }
})

// We need a server which relies on our router
const server = http.createServer((req, res) => {
  handler = router.route(req)
  handler.process(req, res)
})

// Start the server
server.listen(port, host)

console.log(`Server listening on http://${host}:${port}`)