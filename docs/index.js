const now = Date.now()

checkMessage()

function setMessage(text) {
    const message = document.getElementById('message')
    message.textContent = text
}

function checkMessage() {
    const message = localStorage.getItem('message')

    if (!message) {
        console.log('no local message')
        updateMessage()
        return
    }

    const lastUpdate = parseInt(localStorage.getItem('last_update') ?? '0')
    const timeLeft = now - lastUpdate
    const refreshInterval = 60 * 1000

    console.log('time left: ' + timeLeft)

    if (timeLeft > 0 && timeLeft < refreshInterval) {
        console.log('set local message: ' + message)
        setMessage(message)
        return
    }

    updateMessage()
}

function updateMessage() {
    const apiUrl = 'https://bba3vlt10rv473e7elmu.containers.yandexcloud.net/'
    fetch(apiUrl).then(response => response.text()).then(text => {
        localStorage.setItem('last_update', now)
        localStorage.setItem('message', text)
        console.log('set message from api: ' + text)
        setMessage(text)
    })
}