function load() {
    const text = 'son las 8'
    const synth = window.speechSynthesis
    const utterThis = new SpeechSynthesisUtterance(text)
    synth.speak(utterThis)
}
window.onload = load;