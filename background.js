// Service worker (Manifest V3): no hay window ni timers persistentes,
// así que se usan chrome.alarms para programar y chrome.tts para hablar.
const ALARMA = "telltime"

chrome.runtime.onInstalled.addListener(iniciar)
chrome.runtime.onStartup.addListener(iniciar)

async function iniciar() {
    let { config } = await chrome.storage.local.get("config")
    if (!config)
        config = { minutos: 30, fijo: true }
    crear(config.minutos, config.fijo)
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.action) {
        case "hora":
            crear(60, true)
            break

        case "mediaHora":
            crear(30, true)
            break

        case "personalizado":
            crear(request.minutos)
            break

        case "getRemainingTime":
            chrome.alarms.get(ALARMA).then(function (alarma) {
                sendResponse({ remainingTime: alarma ? alarma.scheduledTime : undefined })
            })
            return true
    }
})

chrome.alarms.onAlarm.addListener(function (alarma) {
    if (alarma.name === ALARMA)
        speak()
})

async function crear(minutos, fijo) {
    if (!(minutos > 0))
        return

    await chrome.storage.local.set({ config: { minutos: minutos, fijo: !!fijo } })
    await chrome.alarms.clear(ALARMA)

    chrome.alarms.create(ALARMA, {
        when: Date.now() + cuentaMinutos(minutos, fijo),
        periodInMinutes: minutos
    })
}

function cuentaMinutos(minutos, fijo) {
    let d = new Date()
    let d2 = new Date()

    if (fijo)
        if (d2.getMinutes() >= minutos) {
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
    chrome.tts.speak(decir, { lang: "es-ES" })
}
