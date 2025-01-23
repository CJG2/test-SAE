# SAE-S3.A.01-2023-sujet01

## I. Membres du groupe et fonctions

| Nom | Prénom | Fonction(s) |
| --- | --- | --- |
| GIRARDIN | Mael             | Développeur                  |
| GODBILLOT | Damien          | Développeur                  |
| GODBILLOT | Rémy            | Scrum Master & Développeur   |
| GONCALVES-FERREIRA | Mathias| Développeur                  |
| GUILLERMO GOMEZ | Carlos J. | Product Owner & Développeur  |

## II. Commanditaire
Mme Barbara SZAFRAJZEN

## III. Sujet

*Création d’une application permettant d’aider à apprendre à lire des enfants rentrant à l’école primaire (environ 6-7 ans).*  
*Prise en compte des acquis de l’enfant (sortie de maternelle avec uniquement la découverte de l’alphabet), des difficultés liées à l’âge (et aux éventuelles difficultés ou fragilités attentionnelles), des intérêts des enfants et du besoin d’intégration d’un caractère ludique dans les exercices proposés. Possibilité de mise en place d’une forme de permis à points ou d’un jeu intégrant une progression valorisant l’enfant dans les résultats obtenus.*

## IV. Contraintes

Bien que le projet n’ait pas de contrainte technique spécifique sur l’aspect développement, il reste important de noter les contraintes suivantes :
- Captiver un enfant, qu’il ait des troubles de l’attention ou non
- Avoir une application ludique et simple
- Éviter de surcharger l’application avec des médias (photos, vidéos, animations)

### A. Langages à utiliser 

- HTML
- CSS
- JavaScript
- JSON
- Serveur : Node.js
- Hébergeur : Heroku

Explication du choix :  
Faire une application web avec HTML, CSS et JavaScript est la plus adaptée par rapport au sujet, car une application web est accessible de partout. Il n’y a donc pas de problème par rapport aux systèmes d’exploitation utilisés (Windows, Linux, MacOS). De plus, il n’est pas nécessaire de développer une application avec un langage très complexe comme le C++ ou Java, surtout pour le public visé (les enfants).

### B. Liste des fonctionnalités principales de l’application

1. **Système d'authentification**
   - Création de comptes utilisateurs (enfant + parent)
   - Un parent peut avoir plusieurs enfants
   - Connexion avec nom d'utilisateur et mot de passe (du parent)

1.a. **Choix du compte**
   - Choix des différents comptes si il y a plusieurs enfants par parent

2. **Test de niveau initial**
   - Évaluation du niveau de l'enfant lors de la première connexion
   - Adaptation du contenu en fonction du niveau détecté

3. **Interface responsive**
   - Accessibilité sur téléphone, tablette et ordinateur

4. **Page d'accueil**
   - Présentation de l'application

5. **Section "Apprendre"**
   - Exercices de lecture de syllabes
   - Activités de reconnaissance de sons
   - Système d'enregistrement des progrès

6. **Mini-jeux éducatifs**
   - Mots croisés
   - Association images-syllabes
   - Autres jeux ludiques pour renforcer l'apprentissage

7. **Suivi et évaluation des progrès**
   - Évaluations régulières (tous les 5 à 10 niveaux)
   - Affichage de la progression
   - Mini-jeux de récompense (ex: puzzle)

8. **Page de profil utilisateur**
   - Accès aux informations personnelles
   - Option de personnalisation du thème visuel

### Fonctionnalités optionnelles

9. **Contrôle parental**
   - Interface de supervision pour les parents

10. **Personnalisation avancée**
    - Choix de différents thèmes visuels

## V. Collaboration

Afin de mener à bien ce projet, nous avons un dépôt *GitLab*. C'est dans ce dépôt que tout notre travail est stocké.

### A. Structure de notre dépôt *GitLab*
```
- / Depot-GitLab
   - ├── / annexes 
      - ├── / BDD
      - ├── / Gestion (1) 
      - ├── / Maquette (2) 

   - ├── / code_sae
      - ├── / backend
         - ├── /node_modules
         - ├── /routes
            - ├── adulte.js
            - ├── contenir.js
            - ├── enfant.js
            - ├── exercice.js
            - ├── mot.js
            - ├── realiser.js
         - ├── /config
            - ├── db.js
         - ├── /controllers
            - ├── adulteController.js
            - ├── contenirController.js
            - ├── enfantController.js
            - ├── exerciceController.js
            - ├── motController.js
            - ├── realiserController.js
         - .env
         - app.js    # point d'entrée du serveur
         - package.json

      - ├── / node_modules (3)
      - ├── / src (4)
         - ├── / assets (5)
            - ├── / icons (6)
            - ├── / fonts
            - ├── / images
            - ├── / sons

         - ├── / public (7) 
            - ├── accueil.html
            - ├── apprendre.html
            - ├── connexion.html
            - ├── profil.html
            - ├── progression.html
            - ├── miniJeux.html

         - ├── / scripts (8)
            - ├── / accueil
               - ├── accueil.js

            - ├── / apprendre
               - ├── / alphabet
                  - ├── alphabet.js
               - ├── / ecrire
                  - ├── ecrire.js
                  - ├── fetchMots.js
                  - ├── process.js
               - ├── /sonToImage
                  - ├── sonToImage.js
               - ├── /syllabe
                  - ├── exerciceSyllabe.js
               - ├── apprendre.js
               - ├── popUp.js

            - ├── / connexion
               - ├── checks.js
               - ├── connexion.js
               - ├── inscrire.js
               - ├── hachage.js
               - ├── registerAdult.js

            - ├── / mini_jeux
               - ├── / association
                  - ├── associationGame.js
               - ├── / listeDeMots
                  - ├── listeDeMots.js
               - ├── / motATrou
                  - ├── motAtrou.js
               - ├── /motscroises
                  - ├── motscroises.js
               - ├── miniJeux.js
               - ├── popUp_exercice.js

            - ├── / profil
               - ├── profil.js
            
            - ├── / progression
               - ├── progression.js

            - ├── app.js
            - ├── carousel.js
            - ├── classes.js
            - ├── inclusionImage.js
            - ├── responsive.js

         - ├── / styles (9)
            - ├── accueil.css
            - ├── apprendre.css
            - ├── associationGame.css
            - ├── caroussel.css
            - ├── connexion.css
            - ├── inscription.css
            - ├── main.css
            - ├── miniJeux.css
            - ├── modal.css
            - ├── motscroises.css
            - ├── navigation.css
            - ├── profil.css
            - ├── progression.css
            - ├── syllabe.css

      - ├── package.json (10)
      - ├── package-lock.json (11)
      - ├── sandbox.config.json
      - ├── webpack.config.js (12)

   - ├── FeuilleDeTemps.xlsx (13)
   - ├── README.md (14)


1 : Dossier comportant tout ce qui est relatif à la gestion, par exemple : Roadmap, Product Backlog  
2 : Dossier comportant la ou les différentes maquettes de l'application  
3 : Dossier généré par l'installation de Webpack pour les dépendances  
4 : Dossier où se trouve le code source de l'application  
5 : Dossier comportant les médias à utiliser  
6 : Dossier où se trouvent les icônes  
7 : Dossier où se trouvent tous les fichiers .html  
8 : Dossier où se trouvent tous les fichiers .js  
9 : Dossier où se trouvent tous les fichiers .css et/ou .scss  
10 : Fichier généré par Webpack pour les dépendances  
11 : Fichier généré par Webpack pour les dépendances verrouillées  
12 : Fichier de configuration du bundler Webpack  
13 : Feuille de temps où se trouvent les heures travaillées, la tâche associée et le nombre d'heures par personne  
14 : Le fichier README.md 
```

### B. Utilisation de *GitLab*
Il est important de savoir utiliser le dépôt correctement et d'exécuter des commandes logiques.

Si vous êtes nouveau, exécutez les commandes ci-dessous :
```bash
mkdir nomDossier
cd nomDossier
git clone git@etulab.univ-amu.fr:sae-s3.a.01-2024/sae-s3.a.01-2024-sujet01.git
git config user.name "NOM Prénom"
git config user.email "votre.mail@mail.com"
```

Une fois connecté à *GitLab*, exécutez ces commandes :
```bash
cd sae-s3.a.01-2023-sujet01
git pull
```

Si vous devez ajouter un fichier ou un dossier, faites :
```bash
cd sae-s3.a.01-2023-sujet01
git add *    # GitLab prendra seulement les fichiers qui ont été modifiés

git commit
# ou bien 
git commit -m "Titre du commit"

git push
```

### C. TRES IMPORTANT
Pour faciliter la récupération des données et ne pas surcharger le dépôt avec des fichiers inutiles, il est **important de supprimer le dossier "node_modules"** généré par Webpack.
Pour ce faire, ouvrez Powershell ***IMPÉRATIVEMENT*** et tapez :

```shell
cd sae-s3.a.01-2023-sujet01/code_sae/
rm node_modules
```

Le terminal vous demandera une confirmation pour supprimer le dossier, vous avez juste à taper : "O" et le dossier "node_modules" sera supprimé en conséquences. À partir de ce moment, vous pouvez effectuer un push.  
**NE NÉGLIGEZ PAS CETTE ÉTAPE !!!!**

Lorsque vous allez *git push*, vous devez prévenir le reste du groupe via le groupe *Discord*. De plus, **n'oubliez pas de modifier *FeuilleDeTemps.xlsx* en ajoutant vos heures de travail et ce que vous avez fait**, le tout dans le feuille qui vous correspond à votre prénom (en bas à gauche).

### D. Prise en main de Webpack

```bash
cd sae-s3.a.01-2023-sujet01/
git pull       # ça récupérera les données du dépôt GitLab
```
Lorsque vous avez *pull*
**NE TOUCHEZ PAS AUX FICHIERS DE CONFIGURATION DE *WEBPACK* !** 


```bash
cd code_sae
npm install    # pour générer "node_modules"

npm run start  # pour lancer l'application
# ou
npm start
```

## VI. Partie développement

Je vous impose plusieurs contraintes sur le développement, pour avoir un code source propre et organisé :
- Lorsque vous codez en HTML, ***je ne veux pas voir d'inclusion*** avec les balises *\<script>* ou *\<link>*. Webpack se charge des dépendances et des inclusions dans le HTML !
- Lorsque vous codez en JavaScript, je vous *impose* de créer un fichier .js par fonctionnalité. Par exemple : *connexion.js* ou *inscription.js* pour les pages d'inscription et de connexion
- Lorsque vous codez en CSS ou SCSS, vous devez faire un fichier .css ou .scss par page HTML, si vous devez changer le style d'une balise qui se trouve dans les 4 pages mettez ces changements dans le fichier *main.css*.
- Pour chaque fichier (HTML, CSS, JavaScript), il existe un répertoire qui les stocke (respectivement */public*, */styles*, */scripts*)
- **DOCUMENTEZ VOTRE PROGRAMME**, mettez des commentaires pour savoir ce que vous faites dans des lignes importantes. Les commentaires s'écrivent comme ci-dessous :
   ```
   // Commentaire sur une ligne en CSS et JavaScript

   /*
   Commentaire sur 
   plusieurs lignes
   en CSS et JavaScript
   */

   <!-- Commentaire en HTML, sur une ou plusieurs lignes -->
   ```

- Lisez la documentation, c'est vraiment utile ! Surtout pour le JavaScript. Voici le lien de la meilleure documentation selon moi pour le JavaScript :
[Documentation MDN](https://developer.mozilla.org/fr/docs/Web/JavaScript)
Il y a un onglet en haut à droite pour rechercher des documentation, par exemple pour chercher la documentation de la fonction *.querySelector()* tapez : " *querySelector* "

## VII. Contact
Si vous remarquez n'importe quel problème, que ce soit sur ce qui est décrit dans ce README.md ou autre, faites le savoir à votre Chef de Projet (ou *Product Owner*), pour essayer de le régler au plus vite. 

Si vous lisez ceci, cochez la case de votre prénom :
- [ ] Mael
- [x] Rémy
- [ ] Damien
- [ ] Mathias
- [x] Carlos J.
