function load() {
    var port = chrome.extension.connect({
        name: "TellTime"
    });

    var opcion = document.getElementsByName("opcion");
    for (var i = 0; i < opcion.length; i++) {
        opcion[i].addEventListener('click', function () {
            if (this.value != "personalizado")
                port.postMessage(this.value)
        })
    }

    document.getElementById("numero").addEventListener('focusout', function () {
        port.postMessage(Number(this.value))
    })
}

window.onload = load