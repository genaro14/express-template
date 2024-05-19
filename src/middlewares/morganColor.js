const morgan = require('morgan')
const chalk = require('chalk')

const morganColor = morgan(function (tokens, req, res) {
  const method = tokens.method(req, res)
  const status = tokens.status(req, res)

  let methodColor = chalk.white.bold
  let statusColor = chalk.white.bold
  const orange = chalk.rgb(255, 165, 0)

  if (method === 'GET') { // HTTP Methods
    methodColor = chalk.green.bold
  } else if (method === 'POST') {
    methodColor = chalk.blue.bold
  } else if (method === 'DELETE') {
    methodColor = chalk.red.bold
  } else if (method === 'PUT') {
    methodColor = orange.bold
  }

  if (status >= 200 && status < 300) { // Responses
    statusColor = chalk.green.bold
  } else if (status >= 400 && status < 500) {
    statusColor = chalk.red.bold
  } else if (status >= 500) {
    statusColor = chalk.red.bold
  }

  const formattedMethod = methodColor(method)
  const formattedUrl = chalk.white.bold(tokens.url(req, res)) // White for URL
  const formattedStatus = statusColor(status)
  const responseTime = chalk.cyan(tokens['response-time'](req, res) + ' ms') // Cyan for response time

  return `${formattedMethod} ${formattedUrl} ${formattedStatus} ${responseTime}`
})

module.exports = morganColor
