const handlerFactory = require('./handler')
const fs = require('fs')
const parser = require('url')
const handlers = {}

exports.clear = function() {
  handlers = {}
}

exports.register = function(url, method) {
  handlers[url] = handlerFactory.createHandler(method)
}

exports.route = function(req) {
  url = parser.parse(req.url, true)
  console.log(`Handling: ${url.pathname}`)
  let handler = handlers[url.pathname]
  if (!handler) handler = this.missing(req)
  return handler
}

exports.missing = function(req) {
  const url = parser.parse(req.url, true)
  const path = process.cwd() + '/public' + url.pathname

  try {    
    data = fs.readFileSync(path)
    return handlerFactory.createHandler(function(req, res) {
      res.writeHead(200, {'Content-Type': 'text/plain'})
      res.end(data)
    })        
  } catch (e) { 
    return handlerFactory.createHandler(function(req, res) {
      console.log(`Not found: ${url.pathname}`)
      res.writeHead(404, {'Content-Type': 'text/plain'})
      res.end(url.pathname + ' not found!')
    })      
  }  
}