function load() {
    let minutos = 1
    let timeout = cuentaMinutos(minutos)

    setTimeout(function () {
        speak()
        let interval = cuentaMinutos(minutos)
        setInterval(function () {
            speak()
        }, interval)
    }, timeout)

    chrome.extension.onConnect.addListener(function (port) {
        port.onMessage.addListener(function (msg) {
            switch (msg) {
                case "":

                    break

                default:
                    speak()
                    break
            }
        })
    })
}

function cuentaMinutos(minutos) {
    let d = new Date()
    let d2 = new Date()

    d2.setMinutes(d2.getMinutes() + minutos)
    d2.setSeconds(0)
    d2.setMilliseconds(500)

    let total = d2.getTime() - d.getTime()

    return total
}

function speak() {
    let d = new Date()
    let hora = " son las " + (d.getHours() > 12 ? d.getHours() - 12 : d.getHours()) + " y " + d.getMinutes()
    let utterThis = new SpeechSynthesisUtterance(hora)
    window.speechSynthesis.speak(utterThis)
}

window.onload = load