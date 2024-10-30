const categories = {
    a: "Animaux",
    m: "Musiques",
    c: "Couleurs",
    e: "Écarts",
    v: "Adversaires",
    y: "Années",
    b: "BDE",
    p: "Prédécesseurs",
    s: "Successeurs",
    r: "Résultats"
};

async function answerQuiz(quiz, answerIndex) {
    if (quiz.questions[quiz.progress].answered != null || quiz.progress == quiz.questions.length)
        return;
    let success = answerIndex == quiz.questions[quiz.progress].correctAnswer;
    quiz.questions[quiz.progress].answered = answerIndex;
    if (success)
        quiz.score++;
    await new Promise(resolve => setTimeout(resolve, 1000));
    quiz.progress++;
}

function generateQuiz(annees, amount, categories, yearMin = null, yearMax = null) {
    var quiz = { questions: [], progress: 0, score: 0 };
    for (let i = 0; i < amount; i++)
        quiz.questions.push(generateQuestion(annees, categories, yearMin, yearMax));
    return quiz;
}

function generateQuestion(annees, categories, anneeMinIndex = 0, anneeMaxIndex = undefined) {
    annees = annees.slice(anneeMinIndex, anneeMaxIndex);
    var category = pickRandom(categories);
    var question, answers = [], color = null, textColor = null;
    if (category == "a") {
        var liste = getRandomListe(annees, l => l.animal);
        question = `Quel est l'animal de la liste ${liste.nom} ?`;
        answers.push({ text: liste.animal });
        while (answers.length < 4) {
            var randomListe = getRandomListe(annees, l => l.animal);
            if (randomListe.animal !== liste.animal)
                answers.push({ text: randomListe.animal });
        }
        color = liste.couleur;
        textColor = liste.texte;
    } else if (category == "m") {
        var liste = getRandomListe(annees, l => l.musique);
        question = `Quelle est la musique de la liste ${liste.nom} ?`;
        answers.push({ text: liste.musique });
        while (answers.length < 4) {
            var randomListe = getRandomListe(annees, l => l.musique);
            if (randomListe.musique !== liste.musique)
                answers.push({ text: randomListe.musique });
        }
        color = liste.couleur;
        textColor = liste.texte;
    } else if (category == "c") {
        var liste = getRandomListe(annees, l => l.couleur);
        question = `Quelle est la couleur de la liste ${liste.nom} ?`;
        answers.push({ text: liste.couleur, color: liste.couleur, textColor: liste.couleur });
        while (answers.length < 4) {
            var randomListe = getRandomListe(annees, l => l.couleur);
            if (randomListe.couleur !== liste.couleur)
                answers.push({ text: randomListe.couleur, color: randomListe.couleur, textColor: randomListe.couleur });
        }
    } else if (category == "e") {
        var bde = getRandomListe(annees, l => l.ecart);
        question = `Quel est l'écart de vote du BDE ${bde.nom} ?`;
        answers.push({ text: "+" + bde.ecart });
        while (answers.length < 4) {
            var randomBDE = getRandomListe(annees, l => l.ecart);
            if (randomBDE.ecart !== bde.ecart)
                answers.push({ text: "+" + randomBDE.ecart });
        }
        color = bde.couleur;
        textColor = bde.texte;
    } else if (category == "v") {
        var annee = pickRandom(annees, a => a.listes.length > 1);
        var liste = pickRandom(annee.listes);
        var adversaire = pickRandom(annee.listes, l => l !== liste);
        question = `Quelle est la liste adverse de ${liste.nom} en ${annee.annee} ?`;
        answers.push({ text: adversaire.nom, color: adversaire.couleur, textColor: adversaire.texte });
        for (let i = 0; i < 3; i++) {
            let otherAnnee = pickRandom(annees, a => a !== annee);
            let otherListe = pickRandom(otherAnnee.listes, l => l !== liste);
            answers.push({ text: otherListe.nom, color: otherListe.couleur, textColor: otherListe.texte });
        }
        color = liste.couleur;
        textColor = liste.texte;
    } else if (category == "y") {
        var annee = pickRandom(annees);
        var liste = pickRandom(annee.listes);
        question = `Quelle est l'année de la liste ${liste.nom} ?`;
        answers.push({ text: annee.annee });
        for (let i = 0; i < 3; i++)
            answers.push({ text: pickRandom(annees, a => a !== annee).annee });
        color = liste.couleur;
        textColor = liste.texte;
    } else if (category == "b") {
        var annee = pickRandom(annees, a => !a.unfinished);
        var bde = annee.listes[0];
        question = `Quel est le nom du BDE en ${annee.annee} ?`;
        answers.push({ text: bde.nom, color: bde.couleur, textColor: bde.texte });
        for (let i = 0; i < 3; i++) {
            let otherAnnee = pickRandom(annees, a => a !== annee && !answers.includes(a.listes[0].nom));
            let otherBDE = otherAnnee.listes[0];
            answers.push({ text: otherBDE.nom, color: otherBDE.couleur, textColor: otherBDE.texte });
        }
    } else if (category == "s") {
        var annee = pickRandom(annees.slice(1), a => !a.unfinished);
        var anneeIndex = annees.indexOf(annee);
        var bde = annee.listes[0];
        var nextBDE = annees[anneeIndex - 1].listes[0];
        question = `Quelle est le BDE successeur du BDE ${bde.nom} ?`;
        answers.push({ text: nextBDE.nom, color: nextBDE.couleur, textColor: nextBDE.texte });
        for (let i = 0; i < 3; i++) {
            let otherAnnee = pickRandom(annees, a => a !== annees[anneeIndex - 1] && !answers.includes(a.listes[0].nom));
            let otherBDE = otherAnnee.listes[0];
            answers.push({ text: otherBDE.nom, color: otherBDE.couleur, textColor: otherBDE.texte });
        }
        color = bde.couleur;
        textColor = bde.texte;
    } else if (category == "p") {
        var annee = pickRandom(annees.slice(0, -1), a => !a.unfinished);
        var anneeIndex = annees.indexOf(annee);
        var bde = annee.listes[0];
        var previousBDE = annees[anneeIndex + 1].listes[0];
        question = `Quelle est le BDE précédant le BDE ${bde.nom} ?`;
        answers.push({ text: previousBDE.nom, color: previousBDE.couleur, textColor: previousBDE.texte });
        for (let i = 0; i < 3; i++) {
            let otherAnnee = pickRandom(annees, a => a !== annees[anneeIndex + 1] && !answers.includes(a.listes[0].nom));
            let otherBDE = otherAnnee.listes[0];
            answers.push({ text: otherBDE.nom, color: otherBDE.couleur, textColor: otherBDE.texte });
        }
        color = bde.couleur;
        textColor = bde.texte;
    } else if (category == "r") {
        var annee = pickRandom(annees, a => !a.unfinished);
        question = `Quelle liste a gagné en ${annee.annee} ?`;
        answers.push({ text: annee.listes[0].nom, color: annee.listes[0].couleur, textColor: annee.listes[0].texte });
        for (let i = 1; i < Math.min(4, annee.listes.length); i++)
            answers.push({ text: annee.listes[i].nom, color: annee.listes[i].couleur, textColor: annee.listes[i].texte });
        for(let i = answers.length; i < 4; i++) {
            let otherAnnee = pickRandom(annees, a => a !== annee);
            let otherBDE = otherAnnee.listes[0];
            answers.push({ text: otherBDE.nom, color: otherBDE.couleur, textColor: otherBDE.texte });
        }
    }
    var correctAnswer = answers[0];
    answers = shuffle(answers);
    correctAnswer = answers.indexOf(correctAnswer);
    return {
        question,
        answers,
        correctAnswer,
        color,
        textColor,
        answered: null
    };
}

function getRandomListe(annees, filter = null) {
    do {
        var liste = pickRandom(pickRandom(annees).listes);
    } while (filter !== null && !filter(liste));
    return liste;
}

function pickRandom(array, filter = null) {
    if (filter !== null)
        array = array.filter(filter);
    return array[Math.floor(Math.random() * array.length)];
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex > 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}