const fs = require('node:fs/promises')

fs.writeFile('.env', getDotEnv(), 'utf8')

function getDotEnv() {
    return `ICAL_URL=${process.env.ICAL_URL}`
}