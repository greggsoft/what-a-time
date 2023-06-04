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
        const currentEvent = events.find(({start, end}) => (new Date(start)) <= now && (new Date(end)) >= now)
        const nextEvent = currentEvent && events.find(({start}) => new Date(currentEvent.end).getTime() === new Date(start).getTime())
        const nextEventStartDate = nextEvent && new Date(nextEvent.start)
        const message = (currentEvent ? `Сейчас ${currentEvent.summary}.` : '') +
            (nextEvent ? `\nПотом ${nextEvent.summary} в ${nextEventStartDate.toTimeString().split(':').slice(0, 2).join(':')}.` : '') ??
            'Пока ничего не ясно'

        res.set('Content-Type', 'text/plain')
        res.send(message)
    })
})

app.listen(port, () => {
    console.log(`What-A-Time app listening on port ${port}`)
})