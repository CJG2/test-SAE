import { choixCompte } from "./connexion";
import { hachage } from "./hachage.js";

/**
 * Fonction qui fait une requête à la BDD pour vérifier l'username et le mot de passe
 *
 * @export
 * @async
 * @param {*} usernameInput
 * @param {*} passwordInput
 * @returns {*}
 */
 export function verifConnexion(identifiant, mdp) {
    // On effectue une requête pour obtenir tous les adultes
    fetch("https://test-sae.onrender.com/api/responsable")
        .then(response => {
            if (!response.ok) {
                throw new Error("Erreur de serveur");
            }
            return response.json();
        })
        .then(data => {
            // Recherche de l'adulte dont le username correspond à l'identifiant
            const utilisateur = data.find(adulte => adulte.username === identifiant);

            // Si aucun utilisateur n'est trouvé, on affiche un message d'erreur
            if (!utilisateur) {
                throw new Error("Utilisateur introuvable");
            }

            // Récupérer le hash et le sel de l'utilisateur trouvé
            const { hash: hashBdd, sel: selBdd } = utilisateur;

            // Calculer le hash du mot de passe + sel
            const hashUtilisateur = hachage(mdp + selBdd, false);

            // Comparer le hash calculé avec celui de la base de données
            if (hashUtilisateur == hashBdd) 
            {
                console.log("Connexion réussie !");
                const adulteConnecte = {
                    username: utilisateur.username,
                    hash: utilisateur.hash,
                    sel: utilisateur.sel,
                    nom: utilisateur.nom_adulte,
                    prenom: utilisateur.prenom_adulte,
                    dateNaissance: utilisateur.date_naissance,
                    genre: utilisateur.genre,
                    nationalite: utilisateur.nationalite,
                    dateCreation: utilisateur.date_creation,
                    tel: utilisateur.numeroTelephone,
                };
                sessionStorage.setItem(
                    "adulteConnecte",
                    JSON.stringify(adulteConnecte)
                  );
                choixCompte(utilisateur); // Passe à l'écran suivant
            } 
            else {
                alert("Mot de passe incorrect");
            }
        })
        .catch(err => {
            console.error("Erreur:", err);
            alert(err.message);
        });
}
