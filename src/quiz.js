const answersCount = 4;
const categories = {
    a: {
        text: "Animaux",
        check: annees => annees.reduce((acc, a) => acc + a.listes.filter(l => l.animal).length, 0) >= answersCount,
        generate(annees) {
            let listes = getRandomListes(annees, answersCount, l => l.animal);
            return {
                text: `Quel est l'animal de la liste ${listes[0].nom} ?`,
                color: listes[0].couleur,
                textColor: listes[0].texte,
                answers: listes.map(l => ({ text: l.animal }))
            };
        }
    },
    m: {
        text: "Musiques",
        check: annees => annees.reduce((acc, a) => acc + a.listes.filter(l => l.musique).length, 0) >= answersCount,
        generate(annees) {
            let listes = getRandomListes(annees, answersCount, l => l.musique);
            return {
                text: `Quelle est la musique de la liste ${listes[0].nom} ?`,
                color: listes[0].couleur,
                textColor: listes[0].texte,
                answers: listes.map(l => ({ text: l.musique }))
            };
        }
    },
    c: {
        text: "Couleurs",
        check: annees => annees.reduce((acc, a) => acc + a.listes.filter(l => l.couleur).length, 0) >= answersCount,
        generate(annees) {
            let listes = getRandomListes(annees, answersCount, l => l.couleur);
            return {
                text: `Quelle est la couleur de la liste ${listes[0].nom} ?`,
                color: null,
                textColor: null,
                answers: listes.map(l => ({ text: l.couleur, color: l.couleur, textColor: l.couleur }))
            };
        }
    },
    e: {
        text: "Écarts",
        check: annees => annees.filter(a => a.listes[0].ecart).length >= answersCount,
        generate(annees) {
            let bdes = getRandomListes(annees, answersCount, l => l.ecart);
            return {
                text: `Quel est l'écart de vote du BDE ${bdes[0].nom} ?`,
                color: bdes[0].couleur,
                textColor: bdes[0].texte,
                answers: bdes.map(l => ({ text: "+" + l.ecart }))
            };
        }
    },
    v: {
        text: "Adversaires",
        check: annees => annees.some(a => a.listes.length > 1) && annees.reduce((acc, a) => acc + a.listes.length, 0) >= answersCount,
        generate(annees) {
            let annee = pickRandom(annees.filter(a => a.listes.length > 1))[0];
            let listes = pickRandom(annee.listes, 2);
            let otherListes = getRandomListes(annees.filter(a => a !== annee), answersCount - 1);
            return {
                text: `Quelle est la liste adverse de ${listes[0].nom} en ${annee.annee.split("-")[0]} ?`,
                color: listes[0].couleur,
                textColor: listes[0].texte,
                answers: [listes[1], ...otherListes].map(l => ({ text: l.nom, color: l.couleur, textColor: l.texte }))
            };
        }
    },
    y: {
        text: "Années",
        check: annees => annees.reduce((acc, a) => acc + a.listes.length, 0) >= answersCount,
        generate(annees) {
            let annee = pickRandom(annees)[0];
            let liste = pickRandom(annee.listes)[0];
            let otherAnnees = pickRandom(annees.filter(a => a !== annee), answersCount - 1);
            return {
                text: `Quelle est l'année de la liste ${liste.nom} ?`,
                color: liste.couleur,
                textColor: liste.texte,
                answers: [annee, ...otherAnnees].map(a => ({ text: a.annee.split("-")[0] }))
            };
        }
    },
    b: {
        text: "BDE",
        check: annees => annees.filter(a => !a.unfinished).length >= answersCount,
        generate(annees) {
            annees = pickRandom(annees.filter(a => !a.unfinished), answersCount);
            return {
                text: `Quel est le nom du BDE en ${annees[0].annee} ?`,
                color: null,
                textColor: null,
                answers: annees.map(a => ({ text: a.listes[0].nom, color: a.listes[0].couleur, textColor: a.listes[0].texte }))
            };
        }
    },
    p: {
        text: "Prédécesseurs",
        check: annees => annees.filter(a => !a.unfinished).length >= answersCount,
        generate(annees) {
            let annee = pickRandom(annees.filter(a => !a.unfinished).slice(0, -1))[0];
            let anneeIndex = annees.indexOf(annee);
            let bde = annee.listes[0];
            let previousBDE = annees[anneeIndex + 1].listes[0];
            let otherBDEs = pickRandom(annees.filter((a, i) => ![anneeIndex, anneeIndex + 1].includes(i)), answersCount - 1).map(a => a.listes[0]);
            return {
                text: `Quel est le BDE précédent le BDE ${bde.nom} ?`,
                color: bde.couleur,
                textColor: bde.texte,
                answers: [previousBDE, ...otherBDEs].map(l => ({ text: l.nom, color: l.couleur, textColor: l.texte }))
            };
        }
    },
    s: {
        text: "Successeurs",
        check: annees => annees.filter(a => !a.unfinished).length >= answersCount,
        generate(annees) {
            let annee = pickRandom(annees.filter(a => !a.unfinished).slice(1))[0];
            let anneeIndex = annees.indexOf(annee);
            let bde = annee.listes[0];
            let nextBDE = annees[anneeIndex - 1].listes[0];
            let otherBDEs = pickRandom(annees.filter((a, i) => ![anneeIndex, anneeIndex - 1].includes(i)), answersCount - 1).map(a => a.listes[0]);
            return {
                text: `Quel est le BDE successeur du BDE ${bde.nom} ?`,
                color: bde.couleur,
                textColor: bde.texte,
                answers: [nextBDE, ...otherBDEs].map(l => ({ text: l.nom, color: l.couleur, textColor: l.texte }))
            };
        }
    },
    r: {
        text: "Résultats",
        check: annees => annees.some(a => a.listes.length > 1) && annees.reduce((acc, a) => acc + a.listes.length, 0) >= answersCount,
        generate(annees) {
            let annee = pickRandom(annees)[0];
            let otherListes = getRandomListes(annees.filter(a => a !== annee), answersCount - annee.listes.length);
            return {
                text: `Quelle liste a gagné en ${annee.annee.split("-")[0]} ?`,
                color: null,
                textColor: null,
                answers: [...annee.listes, ...otherListes].slice(0, answersCount).map(l => ({ text: l.nom, color: l.couleur, textColor: l.texte }))
            };
        }
    }
};

function getCategories(annees, anneeMinIndex = 0, anneeMaxIndex = undefined) {
    annees = annees.slice(anneeMinIndex, anneeMaxIndex);
    return Object.fromEntries(Object.entries(categories).filter(entry => entry[1].check(annees)));
}

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

function generateQuiz(annees, amount, categoriesIds, anneeMinIndex = 0, anneeMaxIndex = undefined) {
    annees = annees.slice(anneeMinIndex, anneeMaxIndex);
    let categories = getCategories(annees);
    categoriesIds = categoriesIds.filter(id => id in categories);
    if (categoriesIds.length == 0)
        categoriesIds = Object.keys(categories);
    var quiz = { questions: [], progress: 0, score: 0 };
    for (let i = 0; i < amount; i++)
        quiz.questions.push(generateQuestion(annees, categoriesIds));
    return quiz;
}

function generateQuestion(annees, categoriesIds) {
    var category = categories[pickRandom(categoriesIds)[0]];
    var question = category.generate(annees);
    var correctAnswer = question.answers[0];
    question.answers = shuffle(question.answers);
    question.correctAnswer = question.answers.indexOf(correctAnswer);
    question.answered = null;
    return question;
}

function getRandomListes(annees, n = 1, filter = null) {
    if (n <= 0)
        return [];
    let listes = annees.flatMap(a => a.listes);
    if (filter)
        listes = listes.filter(filter);
    return pickRandom(listes, n);
}

function pickRandom(arr, n = 1) {
    if (n == 1)
        return [arr[Math.floor(Math.random() * arr.length)]];
    let shuffled = shuffle([...arr]);
    return shuffled.slice(0, n);
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