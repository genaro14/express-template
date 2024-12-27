const morgan = require('morgan')
const chalk = require('chalk')
const beautify = require('js-beautify').js
function formatObject (obj) {
  return beautify(JSON.stringify(obj), { indent_size: 2 })
}
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

  const spacer = chalk.bgMagenta.black('<--------------------------<<< REST API DEBUGGER >>>--------------------------> ')
  const formattedMethod = methodColor(method)
  const formattedUrl = chalk.white.bold(tokens.url(req, res)) // White for URL
  const formattedStatus = `Status: ${statusColor(status)}`
  const responseTime = chalk.cyan(tokens['response-time'](req, res) + ' ms') // Cyan for response time
  const params = req.query && Object.keys(req.query).length ? `\n${chalk.inverse.bold('PARAMS:')} ${formatObject(req.query)}` : ''
  const body = req.body && Object.keys(req.body).length ? `\n${chalk.white.bold('BODY')} ${formatObject(req.body)}` : ''
  return `${spacer} \n${formattedMethod} \n${formattedUrl} \n${formattedStatus} - ${responseTime} \n${params} \n${body}`
})

module.exports = morganColor
