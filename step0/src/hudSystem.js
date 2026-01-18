import * as cpn from "./components.js";

const hudSystem = (entities, components, root) => {
    root.innerHTML = '';

    for (const stateEntity of Object.getOwnPropertySymbols(components[cpn.GameStateComponent.name])) {

        let hits = components.GameStateComponent[stateEntity].hits;
        let score = hits * 10;
        let lives = 0;
        if (components.LifeComponent[stateEntity]) {
            lives = components.LifeComponent[stateEntity].life;
        }

        let bestScore = localStorage.getItem('casseBrique_bestScore');
        if (!bestScore) bestScore = 0;

        if (score > bestScore) {
            bestScore = score;
            localStorage.setItem('casseBrique_bestScore', bestScore);
        }

        if (components.GameStateComponent[stateEntity].state == 'running') {
            root.innerHTML = '<div id="gameHUD"> <div id="score"> Score : ' + score + ' | Vies : ' + lives + ' <br> <span style="font-size:16px; color: yellow;">Best: ' + bestScore + '</span></div> </div>';
        }
        else if (components.GameStateComponent[stateEntity].state == 'gameover') {
            root.innerHTML = '<div id="gameHUD"> <div id="score"> Score : ' + score + '</div> <div id="gameOver" style="color:red">PERDU <br> <span style="font-size:20px; color:white">Best: ' + bestScore + '</span> <br> <button onclick="window.location.reload()">Rejouer</button> </div></div>';
        }
        else if (components.GameStateComponent[stateEntity].state == 'victory') {
            root.innerHTML = '<div id="gameHUD"> <div id="score"> Score : ' + score + '</div> <div id="gameOver" style="color:green">VICTOIRE <br> <span style="font-size:20px; color:white">Best: ' + bestScore + '</span> <br> <button onclick="window.location.reload()">Rejouer</button> </div></div>';
        }
    }
};

export { hudSystem }