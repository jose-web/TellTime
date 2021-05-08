let TIMEOUT
let INTERVAL
function load() {
    crear(30)

    chrome.extension.onConnect.addListener(function (port) {
        port.onMessage.addListener(function (msg) {
            switch (msg) {
                case "hora":
                    crear(60)
                    break

                case "mediaHora":
                    crear(30)
                    break

                default:
                    crear(msg)
                    break
            }
        })
    })
}

function crear(minutos) {
    console.log(minutos);
    clearTimeout(TIMEOUT)
    clearInterval(INTERVAL)

    let miliTimeout = cuentaMinutos(minutos)

    TIMEOUT = setTimeout(function () {
        speak()
        let miliInterval = cuentaMinutos(minutos)
        INTERVAL = setInterval(function () {
            speak()
        }, miliInterval)
    }, miliTimeout)
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