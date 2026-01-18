import * as engine from "./engine.js";

function Ball(x, y, w, h, dx = 0, dy = 0) {
    const gameObj1 = engine.ecs.createEntity();
    engine.ecs.addComponent(gameObj1, engine.components.BallTag())
    engine.ecs.addComponent(gameObj1, engine.components.PhysicsTag());
    engine.ecs.addComponent(gameObj1, engine.components.PositionComponent(x, y, 1));
    engine.ecs.addComponent(gameObj1, engine.components.VelocityComponent(dx, dy));
    engine.ecs.addComponent(gameObj1, engine.components.RenderableTag());
    engine.ecs.addComponent(gameObj1, engine.components.GraphicsComponent("rectangle", { w: w, h: h, color: 'red' }));
    engine.ecs.addComponent(gameObj1, engine.components.CollisionTag());
    engine.ecs.addComponent(gameObj1, engine.components.CollisionBoxComponent(w*.9, h*.9));
    return gameObj1;
}

function Raquette(x, y, w, h) {
    const gameObj1 = engine.ecs.createEntity();
    engine.ecs.addComponent(gameObj1, engine.components.RaquetteTag())
    engine.ecs.addComponent(gameObj1, engine.components.PhysicsTag());
    engine.ecs.addComponent(gameObj1, engine.components.PositionComponent(x, y, 0));
    engine.ecs.addComponent(gameObj1, engine.components.RenderableTag());
    engine.ecs.addComponent(gameObj1, engine.components.GraphicsComponent("rectangle", { w: w, h: h, color: 'blue' }));
    engine.ecs.addComponent(gameObj1, engine.components.CollisionTag());
    engine.ecs.addComponent(gameObj1, engine.components.CollisionBoxComponent(w, h));
    return gameObj1;
}

function Brique(x, y, w, h) {
    const gameObj1 = engine.ecs.createEntity();
    engine.ecs.addComponent(gameObj1, engine.components.BriqueTag())
    engine.ecs.addComponent(gameObj1, engine.components.PositionComponent(x, y, 0));
    engine.ecs.addComponent(gameObj1, engine.components.RenderableTag());
    engine.ecs.addComponent(gameObj1, engine.components.GraphicsComponent("rectangle", { w: w, h: h, color: 'orange' }));
    engine.ecs.addComponent(gameObj1, engine.components.CollisionTag());
    engine.ecs.addComponent(gameObj1, engine.components.CollisionBoxComponent(w, h));
    return gameObj1;
}

function Mur(x, y, w, h) {
    const gameObj1 = engine.ecs.createEntity();
    engine.ecs.addComponent(gameObj1, engine.components.MurTag())
    engine.ecs.addComponent(gameObj1, engine.components.PositionComponent(x, y, 0));
    engine.ecs.addComponent(gameObj1, engine.components.RenderableTag());
    engine.ecs.addComponent(gameObj1, engine.components.GraphicsComponent("rectangle", { w: w, h: h, color: '#E1ABAE' }));
    engine.ecs.addComponent(gameObj1, engine.components.CollisionTag());
    engine.ecs.addComponent(gameObj1, engine.components.CollisionBoxComponent(w, h));
    return gameObj1;
}

function GameState() {
    const gameObj1 = engine.ecs.createEntity();
    engine.ecs.addComponent(gameObj1, engine.components.GameStateComponent());
    engine.ecs.addComponent(gameObj1, engine.components.LifeComponent(3));
    return gameObj1;
}

export { Ball, Raquette, Brique, Mur , GameState}