const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const ical = require('ical');

const calendarIcalUrl = process.env.ICAL_URL

if (!calendarIcalUrl) {
    console.error('No ICAL_URL env var found')
    process.exit(2)
}

console.log(`ICAL_URL=${calendarIcalUrl}`)

function getEvents() {
    return fetch(calendarIcalUrl).then((resp) => resp.text()).then((content) => {
        const data = ical.parseICS(content)
        const mapped = Object.values(data).filter(({ type }) => type === 'VEVENT').map(({ start, end, summary }) => Object.assign({ start, end, summary }))
    
        return mapped
    })
}

const express = require('express')
const app = express()
const port = process.env.PORT ?? 3000

app.get('/', (req, res) => {
    const now = new Date()

    getEvents().then(events => {
        const currentEvent = events.find(({start, end}) => start <= now && end >= now)
        const nextEvent = currentEvent && events.find(({start}) => currentEvent.end.getTime() === start.getTime())
        const message = (currentEvent ? `Сейчас ${currentEvent.summary}.` : '') +
            (nextEvent ? `\nПотом ${nextEvent.summary} в ${getTimeWithOffset(nextEvent.start, 300)}.` : '') ??
            'Пока ничего не ясно'

        res.set('Content-Type', 'text/plain')
        res.send(message)
    })
})

app.get('/events', (req, res) => {
    res.set('Content-Type', 'application/json')

    getEvents().then(events => res.send(events))
})

app.listen(port, () => {
    console.log(`What-A-Time app listening on port ${port}`)
})

function getTimeWithOffset(date, offset) {
    const localOffset = date.getTimezoneOffset()
    const hours = date.getHours()
    const minutes = date.getMinutes() + hours * 60
    const offsetMinutes = minutes + offset + localOffset
    const resultMinutes = offsetMinutes % 60
    const resultHours = Math.floor(offsetMinutes / 60)

    return `${resultHours < 10 ? '0' : ''}${resultHours}:${resultMinutes < 10 ? '0' : ''}${resultMinutes}`
}