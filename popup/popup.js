function load() {
    var opcion = document.getElementsByName("opcion");
    for (var i = 0; i < opcion.length; i++) {
        opcion[i].addEventListener('click', function () {
            if (this.value != "personalizado")
                chrome.runtime.sendMessage({ action: this.value })
        })
    }

    document.getElementById("numero").addEventListener('focusout', function () {
        chrome.runtime.sendMessage({ action: "personalizado", minutos: Number(this.value) })
    })

    setInterval(function () {
        chrome.runtime.sendMessage({ action: "getRemainingTime" }, function (response) {
            let remainingTime = response && response.remainingTime;

            if (remainingTime !== undefined) {

                let dateTime = remainingTime - new Date().getTime()

                let hours = Math.floor(dateTime / 3600000);
                let minutes = Math.floor(dateTime / 60000) % 60;
                let seconds = Math.floor(dateTime / 1000) % 60;

                let remainingTimeString = "Tiempo restante: " + hours + " horas, " + minutes + " minutos y " + seconds + " segundos";

                document.getElementById("remainingTime").innerHTML = remainingTimeString;
            } else {
                document.getElementById("remainingTime").innerHTML = "Tiempo restante: no disponible";
            }
        });
    }, 1000);
}

window.onload = load