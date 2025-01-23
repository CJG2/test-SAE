const mobileNav = document.querySelector(".hamburger");
const navbar = document.querySelector(".menubar");

/**
 * Permet de modifier l'affichage de la barre de navigation selon si l'utilisateur utilise un ordinateur ou un téléphone / tablette
 */
export const toggleNav = () => {
  navbar.classList.toggle("active");
  mobileNav.classList.toggle("hamburger-active");
};
mobileNav.addEventListener("click", () => toggleNav());
