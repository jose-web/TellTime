function load() {
    var port = chrome.extension.connect({
        name: "tellTime"
    });

    document.getElementById("botonSpeak").addEventListener('click', function () {
        port.postMessage("Hi BackGround")
    })
}


window.onload = load