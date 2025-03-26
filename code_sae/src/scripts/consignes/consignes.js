import './../../styles/consignes.css';
import iconSrc from './../../assets/icons/sons.png'

export class Consignes {
    constructor(container, audioSrc) {
        this.container = container;
        this.audioSrc = audioSrc;
        this.init();
    }

    async init() {
        this.playAudio(this.audioSrc);
        this.addReplayButton();
    }

    playAudio(audioSrc) {
        let audio = new Audio(audioSrc);
        audio.play();
    }

    createReplayButton() {
        const replayButton = document.createElement("button");
        const icon = document.createElement("img"); 
        icon.src = iconSrc; 
        icon.alt = "Replay sound";
        
        icon.style.width = "30px"; 
        icon.style.height = "30px"; 

        replayButton.appendChild(icon);
        replayButton.classList.add("replay-audio");
        replayButton.addEventListener("click", () => this.playAudio(this.audioSrc));
        return replayButton;
    }

    addReplayButton() {
        let existingButton = this.container.querySelector(".replay-audio");
        if (!existingButton) {
            const button = this.createReplayButton();
            this.container.appendChild(button);
        }
    }
}
