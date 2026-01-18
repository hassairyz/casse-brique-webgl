import * as cpn from "./components.js";

let mPrevTime;
let mLagTime;

const physicsSystem = (entities, components, ecs) => {
    let currentTime = performance.now();
    let elapsedTime = mPrevTime ? currentTime - mPrevTime : 0;
    mPrevTime = currentTime;
    mLagTime += elapsedTime;

    for (const entity of entities) {
        if (components.PhysicsTag[entity] &&
            components.PositionComponent[entity] &&
            components.VelocityComponent[entity]
        ) {
            components.PositionComponent[entity].x += components.VelocityComponent[entity].dx * elapsedTime;
            components.PositionComponent[entity].y += components.VelocityComponent[entity].dy * elapsedTime;

            if (components.BallTag[entity]) {

                if (components.PositionComponent[entity].x < 5) {
                    components.PositionComponent[entity].x = 5;
                    components.VelocityComponent[entity].dx = Math.abs(components.VelocityComponent[entity].dx);
                }

                if (components.PositionComponent[entity].x > 335) {
                    components.PositionComponent[entity].x = 335;
                    components.VelocityComponent[entity].dx = -Math.abs(components.VelocityComponent[entity].dx);
                }

                if (components.PositionComponent[entity].y < 5) {
                    components.PositionComponent[entity].y = 5;
                    components.VelocityComponent[entity].dy = Math.abs(components.VelocityComponent[entity].dy);
                }

                if (components.PositionComponent[entity].y > 450) {
                    components.PositionComponent[entity].x = 175;
                    components.PositionComponent[entity].y = 250;
                    components.VelocityComponent[entity].dy = -Math.abs(components.VelocityComponent[entity].dy);

                    for (const stateEntity of Object.getOwnPropertySymbols(components[cpn.GameStateComponent.name])) {
                        if (components.LifeComponent[stateEntity]) {
                            components.LifeComponent[stateEntity].life -= 1;

                            if (components.LifeComponent[stateEntity].life <= 0) {
                                ecs.eventEmitter.emit('gameover');
                            }
                        }
                    }
                }
            }
        }
    }
};

export { physicsSystem }