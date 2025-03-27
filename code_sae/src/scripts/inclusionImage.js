// page pour importer toutes les images

// images de la navigation
import home_Logo from "./../assets/icons/home.png";
import learn_Logo from "./../assets/icons/apprendreBlanc.png";
import learn_Logo_Black from "./../assets/icons/apprendre.png";
import miniGames_Logo from "./../assets/icons/miniJeuxBlanc.png";
import miniGames_Logo_Black from "./../assets/icons/miniJeux.png";
import logOut_Logo from "./../assets/icons/logOut.png";
import progress_Logo from "./../assets/icons/progression.png";
import logoApplication from "./../assets/icons/logo.png";
import profil_Logo from "./../assets/icons/profil.png";

//images de la page apprendre
import alphabetIcon_Logo from "./../assets/icons/alphabetIcon.png";
import lectureSyllabeIcon_Logo from "./../assets/icons/lectureSyllabeIcon.png";
import soundToLetterIcon_Logo from "./../assets/icons/soundToLetterIcon.png";
import writeIcon_Logo from "./../assets/icons/writeIcon.png";

//images de la page mini-jeux
import AssociationImages_Logo from "./../assets/icons/AssociationImages_Icon.png";
import motATrous_Logo from "./../assets/icons/motATrous_Icon.png";
import crossWord_Logo from "./../assets/icons/crossWord_Icon.png";
import listeDeMot_Logo from "./../assets/icons/listeDeMot.png";

//images pour le mini-jeux Mot A Trou
import falseImage from "./../assets/icons/faux.png";

/**
 * Fonction permmetant le chargement d'images et de logos sur l'application
 *
 * @export
 */
export function loadImages() {
  // partie navigation
  let homeNav_Logo = document.querySelector("#home-navigation");
  if (homeNav_Logo) {
    homeNav_Logo.src = home_Logo;
  }

  let learnNav_Logo = document.querySelector("#learn-navigation");
  if (learnNav_Logo) {
    learnNav_Logo.src = learn_Logo;
  }

  let miniGamesNav_Logo = document.querySelector("#miniGames-navigation");
  if (miniGamesNav_Logo) {
    miniGamesNav_Logo.src = miniGames_Logo;
  }

  let profileNav_Logo = document.querySelector("#logOut-navigation");
  if (profileNav_Logo) {
    profileNav_Logo.src = logOut_Logo;
  }

  let progressNav_Logo = document.querySelector("#progress-navigation");
  if (progressNav_Logo) {
    progressNav_Logo.src = progress_Logo;
  }

  let profilNav_Logo = document.querySelector("#profil-navigation");
  if (profilNav_Logo) {
    profilNav_Logo.src = profil_Logo;
  }

  let logoApplicationGeneral = document.querySelector("#logoApplication");
  if (logoApplicationGeneral) {
    logoApplicationGeneral.src = logoApplication;
    logoApplicationGeneral.style = "width: 80px; height: auto";
  }

  // partie responsive
  let homeNav_LogoResp = document.querySelector("#home-nav");
  if (homeNav_LogoResp) {
    homeNav_LogoResp.src = home_Logo;
  }

  let learnNav_LogoResp = document.querySelector("#learn-nav");
  if (learnNav_LogoResp) {
    learnNav_LogoResp.src = learn_Logo;
  }

  let miniGamesNav_LogoResp = document.querySelector("#miniGames-nav");
  if (miniGamesNav_LogoResp) {
    miniGamesNav_LogoResp.src = miniGames_Logo;
  }

  let logOutNav_LogoResp = document.querySelector("#logOut-nav");
  if (logOutNav_LogoResp) {
    logOutNav_LogoResp.src = logOut_Logo;
  }

  let progressNav_LogoResp = document.querySelector("#progress-nav");
  if (progressNav_LogoResp) {
    progressNav_LogoResp.src = progress_Logo;
  }

  let profilNav_LogoResp = document.querySelector("#profil-nav");
  if (profilNav_LogoResp) {
    profilNav_LogoResp.src = profil_Logo;
  }

  // partie apprendre
  let alphabetIcon = document.querySelector("#logoAlphabet");
  if (alphabetIcon) {
    alphabetIcon.src = alphabetIcon_Logo;
  }

  let lectureSyllabeIcon = document.querySelector("#logoLecture");
  if (lectureSyllabeIcon) {
    lectureSyllabeIcon.src = lectureSyllabeIcon_Logo;
  }

  let soundToLetterIcon = document.querySelector("#logoSon");
  if (soundToLetterIcon) {
    soundToLetterIcon.src = soundToLetterIcon_Logo;
  }

  let writeIcon = document.querySelector("#logoEcrire");
  if (writeIcon) {
    writeIcon.src = writeIcon_Logo;
  }

  // partie mini-jeux
  let AssociationImages_Icon = document.querySelector("#logoAssociation");
  if (AssociationImages_Icon) {
    AssociationImages_Icon.src = AssociationImages_Logo;
  }

  let motATrous_Icon = document.querySelector("#logoMotsATrou");
  if (motATrous_Icon) {
    motATrous_Icon.src = motATrous_Logo;
  }

  let crossWord_Icon = document.querySelector("#logoMotsCroises");
  if (crossWord_Icon) {
    crossWord_Icon.src = crossWord_Logo;
  }

  let listeDeMot_icon = document.querySelector("#logoMotsListe");
  if (listeDeMot_icon) {
    listeDeMot_icon.src = listeDeMot_Logo;
  }

  // images mot a trou
  let motAtrou_falseResponse = document.querySelector("#falseResponse");
  if (motAtrou_falseResponse) {
    motAtrou_falseResponse.src = falseImage;
  }

  // partie accueil
  let accueilLinkImagesApprendre = document.querySelector(
    "#accueilLinkImagesApprendre"
  );
  if (accueilLinkImagesApprendre) {
    accueilLinkImagesApprendre.src = learn_Logo_Black;
  }

  let accueilLinkImagesMiniGames = document.querySelector(
    "#accueilLinkImagesMiniGames"
  );
  if (accueilLinkImagesMiniGames) {
    accueilLinkImagesMiniGames.src = miniGames_Logo_Black;
  }
}
