/**
 * Classe représentant un adulte.
 * 
 * @class
 * @export
 *
 * @description
 * Cette classe contient les informations d'un adulte, notamment ses identifiants,
 * ses coordonnées personnelles et son adresse. Elle est utilisée dans le contexte
 * d'une application gérant des relations entre adultes et enfants.
 *
 * @property {string} username - Nom d'utilisateur unique pour l'adulte.
 * @property {string} hash - Mot de passe haché pour l'authentification.
 * @property {string} sel - Sel utilisé pour sécuriser le hachage du mot de passe.
 * @property {string} nom - Nom de famille de l'adulte.
 * @property {string} prenom - Prénom de l'adulte.
 * @property {Date} dateNaissance - Date de naissance de l'adulte.
 * @property {string} genre - Genre de l'adulte (par exemple : "Homme", "Femme", etc.).
 * @property {string} nationalite - Nationalité de l'adulte.
 * @property {string} telephone - Numéro de téléphone de l'adulte.
 * @property {string} adresse - Adresse de l'adulte.
 * @property {string} ville - Ville de résidence de l'adulte.
 * @property {string} codePostal - Code postal de la ville de résidence.
 * @property {string} pays - Pays de résidence.
 */
export class Adulte {
    constructor(username, hash, sel, nom, prenom, dateNaissance, genre, nationalite, telephone, adresse, ville, codePostal, pays) {
        this.username = username;
        this.hash = hash;
        this.sel = sel;
        this.nom = nom;
        this.prenom = prenom;
        this.dateNaissance = dateNaissance;
        this.genre = genre;
        this.nationalite = nationalite;
        this.telephone = telephone;
        this.adresse = adresse;
        this.ville = ville;
        this.codePostal = codePostal;
        this.pays = pays;
    }
}

/**
 * Classe représentant un enfant.
 * 
 * @class
 * @export
 *
 * @description
 * Cette classe contient les informations d'un enfant, telles que son identité et
 * son lien avec un adulte responsable.
 *
 * @property {string} nom - Nom de famille de l'enfant.
 * @property {string} prenom - Prénom de l'enfant.
 * @property {Date} dateNaissance - Date de naissance de l'enfant.
 * @property {string} genre - Genre de l'enfant (par exemple : "Garçon", "Fille", etc.).
 * @property {Adulte} adulteResponsable - Instance de la classe `Adulte` représentant
 * l'adulte responsable de l'enfant.
 */
export class Enfant {
    constructor(/*id_enfant,*/ nom, prenom, dateNaissance, genre, adulteResponsable) {
        // this.id_enfant = id_enfant; // Non utilisé dans cette version
        this.nom = nom;
        this.prenom = prenom;
        // this.username = username; // Nom visible sur l'application (non utilisé dans cette version)
        this.dateNaissance = dateNaissance;
        this.genre = genre;
        this.adulteResponsable = adulteResponsable; // Fait référence à l'adulte responsable
    }
}

/**
 * Classe représentant une évaluation.
 * 
 * @class
 *
 * @description
 * Cette classe contient les informations d'une évaluation, qui est associée à un enfant.
 *
 * @property {number} id_eval - Identifiant unique de l'évaluation.
 * @property {number} id_enfant - Identifiant unique de l'enfant associé à l'évaluation.
 * @property {string} intitule - Intitulé de l'évaluation.
 * @property {number} tempsImparti - Temps imparti pour effectuer l'évaluation, en minutes.
 */
class Evaluation {
    constructor(id_eval, id_enfant, intitule, tempsImparti) {
        this.id_eval = id_eval;
        this.id_enfant = id_enfant;
        this.intitule = intitule;
        this.tempsImparti = tempsImparti;
    }
}
