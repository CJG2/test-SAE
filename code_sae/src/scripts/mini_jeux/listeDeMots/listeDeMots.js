import "./../../../styles/listeMot.css";

import vraiIcon from "./../../../assets/icons/vrai.png";
import fauxIcon from "./../../../assets/icons/faux.png";

import successSound from './../../../assets/sons/appSound/goodAnswer.mp3';
import failSound from './../../../assets/sons/appSound/wrongAnswer.mp3';

let tabMots = [];
let tabButtons = [];
let tabExos = [];
let idExo = 0;
const emplacement = document.getElementById("modal-body");
let compteur = 0;
let selected = null;
let idSelected = null;
let niveauActuel = "1";
let bonneReponse = niveauActuel;
const enfantConnecte = JSON.parse(sessionStorage.getItem('enfantConnecte'));
let nbErreur = 0;
let score;
let nbPoints = 0;
let nb_tentative = 0;

// Liste des polices pour les mots
const polices = [
    "Joti-One", "Verdana", "Times New Roman", "Georgia", "Courier New",
    "Comic Sans MS", "Trebuchet MS", "Impact", "Lucida Console",
    "Palatino Linotype", "Garamond"
];

/**
 * Fonction associé au jeu "Liste de Mots"
 *
 * @export
 * @async
 * @returns {*}
 */
export async function jeuListeDeMots() 
{
    emplacement.innerHTML = "";
    nbPoints = 0;
    await recupererExercice("Liste de Mots");
    idExo = tabExos[0].id_exercice;
    await recupererDernierExerciceFait(enfantConnecte.id, idExo);
    console.log("Numéro de tentative : " + nb_tentative);
    let niveau = document.createElement("select");

    let niveau1 = document.createElement("option");
    niveau1.textContent = "Niveau 1";
    niveau1.value = "1";

    let niveau2 = document.createElement("option");
    niveau2.textContent = "Niveau 2";
    niveau2.value = "2";

    let niveau3 = document.createElement("option");
    niveau3.textContent = "Niveau 3";
    niveau3.value = "3";

    let niveau4 = document.createElement("option");
    niveau4.textContent = "Niveau 4";
    niveau4.value = "4";

    let niveau5 = document.createElement("option");
    niveau5.textContent = "Niveau 5";
    niveau5.value = "5";

    niveau.appendChild(niveau1);
    niveau.appendChild(niveau2);
    niveau.appendChild(niveau3);
    niveau.appendChild(niveau4);
    niveau.appendChild(niveau5);

    niveau.value = niveauActuel;

    score = document.createElement("label");
    score.textContent = "Score : " + Math.round(nbPoints);
    exercice(niveauActuel);

    emplacement.appendChild(niveau);
    emplacement.appendChild(score);

    niveau.addEventListener("change", async () => {
        niveauActuel = niveau.value;
        bonneReponse = niveauActuel;
        idExo = tabExos[niveauActuel-1].id_exercice;
        await recupererDernierExerciceFait(enfantConnecte.id, idExo);
        console.log("Numéro de tentative : " + nb_tentative);
        emplacement.innerHTML = "";
        nbPoints = 0;
        score.textContent = "Score : " + Math.round(nbPoints);
        emplacement.appendChild(niveau);
        emplacement.appendChild(score);
        exercice(niveauActuel);
    });
}


/**
 * Fonction qui fait une action par rapport au mot sélectionné par l'enfant
 *
 * @param {*} motSelected
 */
function selectMot(motSelected) 
{
    motSelected.classList.remove("incorrect");
    if (compteur === 0) 
    {
        // Première sélection
        motSelected.classList.add("selected");
        idSelected = motSelected;
        selected = motSelected.textContent;
        compteur++;
    } 
    else 
    {
        if (motSelected === idSelected) 
        {
            compteur = 0;
            idSelected = null;
            selected = null;
            motSelected.classList.remove("selected");
        } 
        else 
        {
            if (motSelected.textContent === selected) 
            {
                idSelected.classList.remove("incorrect");
                motSelected.classList.remove("selected");
                idSelected.classList.add("correct");
                motSelected.classList.add("correct");
                idSelected.disabled = true;
                motSelected.disabled = true;
                compteur = 0;
                bonneReponse--;
                nbPoints += 100/niveauActuel;
                score.textContent = "Score : " + Math.round(nbPoints);
                const imgVrai = document.createElement("img");
                imgVrai.src = vraiIcon;
                imgVrai.style.width = "5%";
                imgVrai.style.height = "auto";
                emplacement.appendChild(imgVrai);

                if (bonneReponse === 0) 
                {
                    const goodAudio = new Audio(successSound);
                    goodAudio.play();  

                    for (let i = 0; i < tabButtons.length; i++)
                        tabButtons[i].disabled = true;

                    let exoSuivant = document.createElement("button");
                    exoSuivant.className = "exoSuivantBoutton";
                    exoSuivant.textContent = "Suivant";
                    exoSuivant.addEventListener("click", jeuListeDeMots);
                    emplacement.appendChild(exoSuivant);
                    bonneReponse = niveauActuel;
                    stockerExercice(enfantConnecte.id, idExo, nb_tentative, nbPoints);
                }
            } 
            else 
            {
                const wrongAudio = new Audio(failSound);
                wrongAudio.play();

                idSelected.classList.add("incorrect");
                motSelected.classList.add("incorrect");
                compteur = 0;
                idSelected = null;
                selected = null;
                nbErreur += 1;
                nbPoints -= 10;
                score.textContent = "Score : " + nbPoints;
                const imgFaux = document.createElement("img");
                imgFaux.src = fauxIcon;
                imgFaux.style.width = "5%";
                imgFaux.style.height = "auto";
                emplacement.appendChild(imgFaux);
            }
        }
    }
}

/**
 * Fonction qui permet de récupérer les mots de la base de données pour l'exercice
 *
 * @export
 * @async
 * @returns {unknown}
 */
export async function recupererMots() 
{
    const reponse = await fetch("https://test-sae.onrender.com/api/mot");

    const words = await reponse.json();

    // Ajouter les mots récupérés au tableau fourni
    tabMots.push(...words);
    return tabMots; // Retourne le tableau mis à jour
}


/**
 * Fonction qui lance l'exercice avec un niveau donné
 *
 * @async
 * @param {int} level
 * @returns {*}
 */
async function exercice(level) 
{
    tabMots = [];
    let tabMotsRecup = [];
    let nbrMot = 12;
    await recupererMots();

    let listesMots = document.createElement("div");
    listesMots.id = "listesMots";
    let gauche = document.createElement("div");
    gauche.id = "gauche";
    let droite = document.createElement("div");
    droite.id = "droite";
    let boutonsGauche = [];
    let boutonsDroite = [];
    let max = tabMots.length - 1;
    const exerciceTitle = document.createElement("div");
    const exerciceTitleContent = document.createElement("p");
    exerciceTitleContent.className = "exerciceTitleContent";
    exerciceTitleContent.textContent = "Trouve le ou les mots qui se trouvent dans les 2 listes.";

    exerciceTitle.appendChild(exerciceTitleContent);

    emplacement.appendChild(exerciceTitle);

    if (level == 1) 
    {
        let motGauche = Math.floor(Math.random() * (nbrMot / 2 - 1));
        let motDroit = Math.floor(Math.random() * (nbrMot - 1 - nbrMot / 2 + 1)) + nbrMot / 2;

        for (let i = 0; i < nbrMot; i++) 
        {
            let randomInt = Math.floor(Math.random() * max);
            const btn = document.createElement("button");
            btn.className = "boutonList";

            // Assigner une police différente
            btn.style.fontFamily = polices[i % polices.length];

            if (i != motDroit) 
            {
                for (let j = 0; j < tabMotsRecup.length - 1; j++) 
                {
                    while (tabMotsRecup.includes(tabMots[randomInt].mot))
                        randomInt = Math.floor(Math.random() * max);
                }

                btn.textContent = tabMots[randomInt].mot;
                tabMotsRecup.push(tabMots[randomInt].mot);
                tabButtons.push(btn);
                btn.addEventListener("click", () => selectMot(btn));
            } 
            else 
            {
                btn.textContent = tabMotsRecup[motGauche];
                tabMotsRecup.push(tabMotsRecup[motGauche]);
                tabButtons.push(btn);
                btn.addEventListener("click", () => selectMot(btn));
            }

            if (i < nbrMot / 2)
                gauche.appendChild(btn);
            else
                droite.appendChild(btn);
        }

        listesMots.appendChild(gauche);
        listesMots.appendChild(droite);

        emplacement.appendChild(listesMots);
    } 
    else 
    {
        for (let i = 0; i < nbrMot / 2; i++) 
        {
            let randomInt = Math.floor(Math.random() * max);
            const btn = document.createElement("button");
            btn.className = "boutonList";

            // Assigner une police différente
            btn.style.fontFamily = polices[i % polices.length];

            while (tabMotsRecup.includes(tabMots[randomInt].mot))
                randomInt = Math.floor(Math.random() * max);

            btn.textContent = tabMots[randomInt].mot;
            tabMotsRecup.push(tabMots[randomInt].mot);
            tabButtons.push(btn);
            boutonsGauche.push(btn);
            btn.addEventListener("click", () => selectMot(btn));
        }

        for (let i = 0; i < nbrMot / 2; i++) 
        {
            const btn = document.createElement("button");
            btn.className = "boutonList";

            // Assigner une police différente
            btn.style.fontFamily = polices[(i + nbrMot / 2) % polices.length];

            if (i < level)
                btn.textContent = boutonsGauche[i].textContent;
            else 
            {
                let randomInt = Math.floor(Math.random() * max);

                while (tabMotsRecup.includes(tabMots[randomInt].mot))
                    randomInt = Math.floor(Math.random() * max);

                btn.textContent = tabMots[randomInt].mot;
                tabMotsRecup.push(tabMots[randomInt].mot);
                tabButtons.push(btn);
            }
            boutonsDroite.push(btn);
            btn.addEventListener("click", () => selectMot(btn));
        }
        melange(boutonsGauche);
        melange(boutonsDroite);

        boutonsGauche.forEach(btn => gauche.appendChild(btn));
        boutonsDroite.forEach(btn => droite.appendChild(btn));

        listesMots.appendChild(gauche);
        listesMots.appendChild(droite);

        emplacement.appendChild(listesMots);
    }
}


/**
 * Fonction qui mélange les mots des 2 listes pour qu'il ait des positions aléatoires
 *
 * @param {*} mots
 * @returns {*}
 */
function melange(mots) 
{
    for (let i = mots.length - 1; i > 0; i--) 
    {
        const j = Math.floor(Math.random() * (i + 1));
        [mots[i], mots[j]] = [mots[j], mots[i]];
    }
    return mots;
}


/**
 * Fonction qui permet de récupérer les exercices de la base de données
 *
 * @async
 * @param {string} libelle
 * @returns {unknown}
 */
async function recupererExercice(libelle) 
{
    const reponse = await fetch("https://test-sae.onrender.com/api/exercice");

    const exercices = await reponse.json();

    tabExos = exercices.filter(exercice => exercice.libelle === libelle);
    return tabExos; // Retourne le tableau mis à jour
}

/**
 * Fonction qui permet de récupérer le numéro de la dernière tentative de l'enfant selon l'exercice voulu
 *
 * @export
 * @async
 * @param {int} id_enfant
 * @param {int} id_exo
 * @returns {unknown}
 */
export async function recupererDernierExerciceFait(id_enfant, id_exo) 
{
    const reponse = await fetch("https://test-sae.onrender.com/api/realiser");

    const exercicesRealiser = await reponse.json();
    const tabExosRealiser = exercicesRealiser.filter(exerciceRealiser => exerciceRealiser.id_enfant === id_enfant && exerciceRealiser.id_exercice === id_exo);
    console.log("Dernier exercice récupéré :", exercicesRealiser); // Vérifiez ici le contenu
    nb_tentative = tabExosRealiser.length;
    console.log(tabExosRealiser);

    return nb_tentative;
}

/**
 * Fonction qui permet de sauvegarder dans la base de donnée l'exercice effectué par l'enfant
 *
 * @export
 * @async
 * @param {int} id_enfant
 * @param {int} id_exercice
 * @param {int} nb_tentative
 * @param {int} score
 * @returns {unknown}
 */
export function stockerExercice(id_enfant, id_exercice, nb_tentative, score) 
{
  console.log('Données envoyées :', { id_enfant, id_exercice, nb_tentative, score });

  fetch('http://localhost:3000/api/realiser/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_enfant, id_exercice, nb_tentative, score }),
  })
      .then(response => {
          if (!response.ok) {
              throw new Error(`Erreur HTTP : ${response.status}`);
          }
          return response.json();
      })
      .then(data => {
          console.log('Réponse du serveur :', data);
          if (data.success)
            console.log('Le résultat de l\'exercice a bien été sauvegardé.');
          else
          console.log('Erreur lors du stockage de l\'exercice.');
      })
      .catch(error => {
          console.error('Erreur lors du stockage de l\'exercice :', error);
          alert('Une erreur est survenue : ' + error.message);
      });
}
