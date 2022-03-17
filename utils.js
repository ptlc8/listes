/* Les 3 (et d'autres) fonctions toujours utiles d'Ambi ;) */
function sendRequest(method, url, body=undefined, headers={"Content-Type":"application/x-www-form-urlencoded"}) {
    var promise = new (Promise||ES6Promise)(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url);
        for (let h of Object.keys(headers))
            xhr.setRequestHeader(h, headers[h]);
        xhr.onreadystatechange = function() {
            if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                resolve(this.response);
            }
        };
        xhr.onerror = reject;
        xhr.send(body);
    });
    return promise;
}
function createElement(tag, properties={}, inner=[], eventListeners={}) {
    let el = document.createElement(tag);
    for (let p of Object.keys(properties)) if (p!="style" && p!="dataset") el[p] = properties[p];
    if (properties.style) for (let p of Object.keys(properties.style)) el.style[p] = properties.style[p];
    if (properties.dataset) for (let p of Object.keys(properties.dataset)) el.dataset[p] = properties.dataset[p];
    if (typeof inner == "object") for (let i of inner) el.appendChild(typeof i == "string" ? document.createTextNode(i) : i);
    else el.innerText = inner;
    for (let l of Object.keys(eventListeners)) el.addEventListener(l, eventListeners[l]);
    return el;
}
var __seed = 0;
function random() {
	let x = Math.sin(__seed++) * 10000;
	return x - Math.floor(x);
}
function setRandomSeed(seed) {
    __seed = seed;
}
function sleep(ms) {
    return new (Promise||ES6Promise)(function(resolve, reject) {
        setTimeout(resolve, ms);
    });
}
function escapeHtml(text) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}