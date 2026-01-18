import * as engine from "./engine.js";
import * as entitites from "./entities.js";
import * as cpn from "./components.js";

function sceneSetup() {
    const ball = entitites.Ball(175, 200, 10, 10, 0.2, 0.2);
    const raquette = entitites.Raquette(150, 400, 60, 10);
    let offsetx = 35;
    let offsety = 40;
    let deltax = 60;
    let deltay = 25;
    for (let i = 0; i < 5; i++)
        for (let j = 0; j < 5; j++) {
            const br = entitites.Brique(offsetx + i * deltax, offsety + j * deltay, 50, 15);
        }
}

window.onload = function () {
    engine.init("GLCanvas");

    const gameState = entitites.GameState();
    sceneSetup();

    engine.ecs.eventEmitter.on('leftDown', handleLeftDown)
    engine.ecs.eventEmitter.on('leftUp', handleLeftUp)
    engine.ecs.eventEmitter.on('rightDown', handleRightDown)
    engine.ecs.eventEmitter.on('rightUp', handleRightUp)
    engine.ecs.eventEmitter.on('hit', handleHit)
    engine.ecs.eventEmitter.on('gameover', handleGameover)
    engine.ecs.eventEmitter.on('victory', handleVictory)

    engine.update();
}

function handleHit(event) {
    for (const state of Object.getOwnPropertySymbols(engine.ecs.components[cpn.GameStateComponent.name])) {
        engine.ecs.components.GameStateComponent[state].hits += 1;
    }
}

function handleGameover(event) {
    for (const state of Object.getOwnPropertySymbols(engine.ecs.components[cpn.GameStateComponent.name])) {
        engine.ecs.components.GameStateComponent[state].state = 'gameover';
        engine.ecs.isRunning = false;
    }
}

function handleVictory(event) {
    setTimeout(() => {
        for (const state of Object.getOwnPropertySymbols(engine.ecs.components[cpn.GameStateComponent.name])) {
            engine.ecs.components.GameStateComponent[state].state = 'victory';
            engine.ecs.isRunning = false;
        }
    }, 100);
}

function handleLeftDown(event) {
    for (const state of Object.getOwnPropertySymbols(engine.ecs.components[cpn.GameStateComponent.name])) {
        engine.ecs.components.GameStateComponent[state].leftControl = true;
    }
}

function handleLeftUp(event) {
    for (const state of Object.getOwnPropertySymbols(engine.ecs.components[cpn.GameStateComponent.name])) {
        engine.ecs.components.GameStateComponent[state].leftControl = false;
    }
}

function handleRightUp(event) {
    for (const state of Object.getOwnPropertySymbols(engine.ecs.components[cpn.GameStateComponent.name])) {
        engine.ecs.components.GameStateComponent[state].rightControl = false;
    }
}

function handleRightDown(event) {
    for (const state of Object.getOwnPropertySymbols(engine.ecs.components[cpn.GameStateComponent.name])) {
        engine.ecs.components.GameStateComponent[state].rightControl = true;
    }
}