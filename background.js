let TIMEOUT
let INTERVAL
function load() {
    crear(30, true)

    chrome.extension.onConnect.addListener(function (port) {
        port.onMessage.addListener(function (msg) {
            switch (msg) {
                case "hora":
                    crear(60, true)
                    break

                case "mediaHora":
                    crear(30, true)
                    break

                default:
                    crear(msg)
                    break
            }
        })
    })
}

function crear(minutos, fijo) {
    console.log(minutos);
    clearTimeout(TIMEOUT)
    clearInterval(INTERVAL)

    let miliTimeout = cuentaMinutos(minutos, fijo)

    TIMEOUT = setTimeout(function () {
        speak()
        let miliInterval = cuentaMinutos(minutos)
        INTERVAL = setInterval(function () {
            speak()
        }, miliInterval)
    }, miliTimeout)
}

function cuentaMinutos(minutos, fijo) {
    let d = new Date()
    let d2 = new Date()

    if (fijo)
        if (d2.getMinutes() > minutos) {
            d2.setMinutes(0)
            d2.setHours(d2.getHours() + 1)
        } else
            d2.setMinutes(minutos)
    else
        d2.setMinutes(d2.getMinutes() + minutos)
    d2.setSeconds(1)

    let total = d2.getTime() - d.getTime()

    return total
}

function speak() {
    let d = new Date()

    let minutos
    switch (d.getMinutes()) {
        case 0:
            minutos = " en punto"
            break

        case 15:
            minutos = " y cuarto"
            break

        case 30:
            minutos = " y media"
            break

        case 45:
            d.setHours(d.getHours() + 1)
            minutos = " menos cuarto"
            break

        default:
            minutos = " y " + d.getMinutes()
    }

    let hora = d.getHours() > 12 ? d.getHours() - 12 : d.getHours()


    let decir = "son las " + hora + minutos
    let utterThis = new SpeechSynthesisUtterance(decir)
    window.speechSynthesis.speak(utterThis)
}

window.onload = load