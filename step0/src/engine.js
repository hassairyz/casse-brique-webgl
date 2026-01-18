import * as cssRenderSystem from "./renderSystemCSS.js";
import * as renderSystem from "./renderSystem.js";
import * as components from "./components.js";
import * as physicsSystem from "./physicsSystem.js";
import * as collisionSystem from "./collisionSystem.js";
import * as inputSystem from "./inputSystem.js";
import * as hudSystem from "./hudSystem.js";
import * as gameoverSystem from "./gameoverSystem.js";

function generateUUID() {
    var d = new Date().getTime();
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16;
        if (d > 0) {
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(eventName, listener) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(listener);
    }

    off(eventName, listener) {
        if (!this.events[eventName]) {
            return;
        }
        this.events[eventName] = this.events[eventName].filter(l => l !== listener);
    }

    emit(eventName, ...args) {
        if (!this.events[eventName]) {
            return;
        }
        this.events[eventName].forEach(listener => {
            listener.apply(this, args);
        });
    }
}


class ECS {
    constructor() {
        this.entities = new Set();
        this.components = {};
        this.entitiesToComponents = {};
        this.systems = [];
        this.entitiesToRemove = [];
        this.eventEmitter = new EventEmitter();
        this.isRunning = true;
    }

    createEntity() {
        const entity = Symbol(generateUUID());
        this.entities.add(entity);
        return entity;
    }
    removeEntity(entity){
        console.log( "removeEntity:");
        console.log( entity);

        this.entitiesToRemove.push(entity);
    }

    addComponent(entity, component) {
        if (!this.components[component.name]) {
            this.components[component.name] = {};
        }
        this.components[component.name][entity] = component;

        if( ! this.entitiesToComponents[entity] )
        {
            this.entitiesToComponents[entity] = []
        }
        this.entitiesToComponents[entity].push(component);
    }

    getComponent(entity, componentName) {
        return this.components[componentName] ? this.components[componentName][entity] : null;
    }

    addSystem(system) {
        this.systems.push(system);
    }

    update() {
        this.entitiesToRemove = [];

        for (const system of this.systems) {
            system(this.entities, this.components);
        }

        for(const entity of this.entitiesToRemove){
            for(const c of this.entitiesToComponents[entity])
            {
                delete (this.components[c.name])[entity]
            }
            this.entities.delete(entity)
        }
    }
}

let ecs;
let mGL = null;
function getGL() { return mGL; }

function initWebGL(htmlCanvasID) {
    let canvas = document.getElementById(htmlCanvasID);
    mGL = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!mGL) {
        alert('WebGL not supported');
        return null;
    }
    mGL.viewport(0, 0, canvas.width, canvas.height);
    return mGL;
}

function init(htmlCanvasID) {
    ecs = new ECS();
    initWebGL(htmlCanvasID);
    let canvas = document.getElementById(htmlCanvasID);
    let root = document.createElement("div");
    document.body.appendChild(root);

    let rootHUD = document.createElement("div");
    document.body.appendChild(rootHUD);


    ecs.addSystem(entities => inputSystem.inputSystem(entities, ecs.components, ecs));
    ecs.addSystem(entities => physicsSystem.physicsSystem(entities, ecs.components, ecs));
    ecs.addSystem(entities => collisionSystem.collisionSystem(entities, ecs.components,ecs));
    ecs.addSystem(entities => renderSystem.webGLRenderSystem(entities, ecs.components, mGL));
    ecs.addSystem(entities => gameoverSystem.gameoverSystem(entities, ecs.components, ecs,25));
    ecs.addSystem(entities => hudSystem.hudSystem(entities, ecs.components,rootHUD));

    document.addEventListener('keydown', function(event) {
        if ( event.key === 'ArrowLeft') {
            ecs.eventEmitter.emit('leftDown');
        } else if ( event.key === 'ArrowRight') {
            ecs.eventEmitter.emit('rightDown');
        }
    });

    document.addEventListener('keyup', function(event) {
        if (event.key === 'ArrowLeft') {
            ecs.eventEmitter.emit('leftUp');
        } else if (event.key === 'ArrowRight') {
            ecs.eventEmitter.emit('rightUp');
        }
    });
}

function update() {
    ecs.update();
    if(ecs.isRunning){
        requestAnimationFrame(update);
    }
}

export { getGL, ecs, update, init, components }