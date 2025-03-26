const enfantConnecte = JSON.parse(sessionStorage.getItem('enfantConnecte'));

export function changeFont() 
{
    if (enfantConnecte.dys)
        document.documentElement.style.setProperty('--font-family', "'Joti-One', truetype");
    else
        document.documentElement.style.setProperty('--font-family', "'OpenDyslexicAlta-Regular', opentype");
}

changeFont();