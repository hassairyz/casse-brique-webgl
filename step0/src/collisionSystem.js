import * as cpn from "./components.js";

function getOverlap(boxA, boxB) {
    let halfWidthA = boxA.width / 2;
    let halfHeightA = boxA.height / 2;
    let halfWidthB = boxB.width / 2;
    let halfHeightB = boxB.height / 2;

    let centerA = { x: boxA.x + halfWidthA, y: boxA.y + halfHeightA };
    let centerB = { x: boxB.x + halfWidthB, y: boxB.y + halfHeightB };

    let diffX = centerA.x - centerB.x;
    let diffY = centerA.y - centerB.y;

    let minDistX = halfWidthA + halfWidthB;
    let minDistY = halfHeightA + halfHeightB;

    let depthX = diffX > 0 ? minDistX - diffX : -minDistX - diffX;
    let depthY = diffY > 0 ? minDistY - diffY : -minDistY - diffY;

    return { x: depthX, y: depthY };
}

const collisionSystem = (entities, components, ecs) => {
    for (const ball of Object.getOwnPropertySymbols(components[cpn.BallTag.name])) {
        for (const obj of Object.getOwnPropertySymbols(components[cpn.CollisionTag.name])) {

            if (ball === obj) continue;

            if (components.PositionComponent[ball].x < components.PositionComponent[obj].x + components.CollisionBoxComponent[obj].width &&
                components.PositionComponent[ball].x + components.CollisionBoxComponent[ball].width > components.PositionComponent[obj].x &&
                components.PositionComponent[ball].y < components.PositionComponent[obj].y + components.CollisionBoxComponent[obj].height &&
                components.PositionComponent[ball].y + components.CollisionBoxComponent[ball].height > components.PositionComponent[obj].y) {

                components.CollisionBoxComponent[obj].hit = true;

                let boxBall = {
                    x: components.PositionComponent[ball].x,
                    y: components.PositionComponent[ball].y,
                    width: components.CollisionBoxComponent[ball].width,
                    height: components.CollisionBoxComponent[ball].height
                };
                let boxObj = {
                    x: components.PositionComponent[obj].x,
                    y: components.PositionComponent[obj].y,
                    width: components.CollisionBoxComponent[obj].width,
                    height: components.CollisionBoxComponent[obj].height
                };

                let overlap = getOverlap(boxBall, boxObj);

                if (Math.abs(overlap.x) < Math.abs(overlap.y)) {
                    components.PositionComponent[ball].x += overlap.x;
                    components.VelocityComponent[ball].dx = -components.VelocityComponent[ball].dx;
                } else {
                    components.PositionComponent[ball].y += overlap.y;
                    components.VelocityComponent[ball].dy = -components.VelocityComponent[ball].dy;
                }

                if (components.BriqueTag[obj]) {
                    ecs.removeEntity(obj);
                    ecs.eventEmitter.emit('hit');
                }
            }
        }
    }
};

export { collisionSystem }