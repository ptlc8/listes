window.addEventListener("load", () => {
    fetch("listes.json").then(res => res.json()).then(annees => {
        var listesDiv = document.getElementById("listes");
        for (let annee of annees) {
            listesDiv.appendChild(annee.unfinished
                ? createElement("div", { className: "annee" }, annee.annee)
                : createElement("div", { className: "annee", style: { backgroundColor: annee.listes[0].couleur, color: annee.listes[0].texte } }, annee.annee + " - BDE " + annee.listes[0].nom + (annee.votes ? " - " + annee.votes + " votants" : "")));
            listesDiv.appendChild(createElement("div", { className: "listes", title: annee.annee }, annee.listes.map(liste => {
                return createElement("div", { style: { backgroundColor: liste.couleur, color: liste.texte } }, [
                    liste.image ? createElement("img", { src: liste.image }) : "",
                    createElement("span", {}, liste.nom),
                    liste.ecart ? createElement("span", { className: "ecart" }, "+" + liste.ecart) : ""
                ], {
                    click: () => popupListe(liste)
                })
            })));
        }
    });
});

function popupListe(liste) {
    let popup;
    document.body.appendChild(popup = createElement("div", { className: "popup-wrapper" }, [
        createElement("div", { className: "popup liste", style: { backgroundColor: liste.couleur, color: liste.texte } }, [
            createElement("div", { className: "nom" }, liste.nom),
            createElement("img", { className: "logo", src: liste.image }),
            liste.couleur ? createElement("div", {}, "Couleur : " + liste.couleur) : "",
            liste.animal ? createElement("div", {}, "Animal : " + liste.animal) : "",
            liste.musique ? createElement("div", {}, "Musique : " + liste.musique) : "",
            liste.votes ? createElement("div", {}, "Votes : " + liste.votes) : "",
            liste.ecart ? createElement("div", {}, "Écart : " + liste.ecart) : "",
            liste.liens ? createElement("div", { className: "liens" },
                Object.entries(liste.liens).map(([reseau, lien]) => createElement("a", { href: lien, title: reseau, target: "_blank" }, [
                    createElement("img", { src: "assets/icons/" + reseau + ".svg", alt: reseau })
                ]))
            ) : ""
        ], {
            click: e => e.stopPropagation()
        })
    ], {
        click: () => popup.parentElement.removeChild(popup)
    }));
}

function createElement(tag, properties = {}, inner = [], eventListeners = {}) {
    let el = document.createElement(tag);
    for (let p of Object.keys(properties)) if (p != "style" && p != "dataset") el[p] = properties[p];
    if (properties.style) for (let p of Object.keys(properties.style)) el.style[p] = properties.style[p];
    if (properties.dataset) for (let p of Object.keys(properties.dataset)) el.dataset[p] = properties.dataset[p];
    if (typeof inner == "object") for (let i of inner) el.appendChild(typeof i == "string" ? document.createTextNode(i) : i);
    else el.innerText = inner;
    for (let l of Object.keys(eventListeners)) el.addEventListener(l, eventListeners[l]);
    return el;
}