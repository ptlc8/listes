window.addEventListener("load", function(){
    sendRequest("GET", "listes.json").then(function(listesJSON){
        var annees = JSON.parse(listesJSON);
        var listesDiv = document.getElementById("listes");
        for (let annee of annees) {
            listesDiv.appendChild(annee.unfinished ? createElement("div", {className:"annee"}, annee.annee) : createElement("div", {className:"annee",style:{backgroundColor:annee.listes[0].couleur,color:annee.listes[0].texte}}, annee.annee+" - BDE "+annee.listes[0].nom));
            listesDiv.appendChild(createElement("div", {className:"listes",title:annee.annee}, annee.listes.map(function(liste){
                return createElement("div", {style:{backgroundColor:liste.couleur, color:liste.texte}}, [
                    liste.image?createElement("img", {src:liste.image}):"",
                    createElement("span", {}, liste.nom),
                    liste.ecart?createElement("span", {className:"ecart"}, "+"+liste.ecart):""
                ], {click: function() {
                    popupListe(liste);
                }})
            })));
        }
    });
});
function popupListe(liste) {
    let popup;
    document.body.appendChild(popup = createElement("div", {className:"popup-wrapper"}, [
        createElement("div", {className:"popup liste", style:{backgroundColor:liste.couleur, color:liste.texte}}, [
            createElement("div", {className:"nom"}, liste.nom),
            createElement("img", {className:"logo", src:liste.image}),
            liste.couleur ? createElement("div", {}, "Couleur : "+liste.couleur) : "",
            liste.animal ? createElement("div", {}, "Animal : "+liste.animal) : "",
            liste.musique ? createElement("div", {}, "Musique : "+liste.musique) : "",
            liste.votes ? createElement("div", {}, "Votes : "+liste.votes) : "",
            liste.ecart ? createElement("div", {}, "Écart : "+liste.ecart) : "",
            liste.liens ? createElement("div", {className:"liens"},
                Object.entries(liste.liens).map(([reseau,lien]) => createElement("a", {href:lien, title:reseau, target:"_blank"}, [
                    createElement("img", {src:"assets/icon-"+reseau+".svg", alt:reseau})
                ]))
            ) : ""
        ], {click: function(e) {
            e.stopPropagation();
        }})
    ], {click: function() {
        popup.parentElement.removeChild(popup);
    }}));
}