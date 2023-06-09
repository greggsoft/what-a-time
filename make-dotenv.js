const fs = require('node:fs/promises')

const dotEnv = getDotEnv()

fs.writeFile('.env', dotEnv, 'utf8')

function getDotEnv() {
    return process.env.ICAL_URL ? 'ICAL_URL=' + process.env.ICAL_URL : ''
}