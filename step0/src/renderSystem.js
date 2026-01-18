import * as cpn from "./components.js";

const vsSource = `
    attribute vec2 a_position;
    uniform vec2 u_resolution;
    uniform vec2 u_translation;
    uniform vec2 u_scale;

    void main() {
        vec2 scaled = a_position * u_scale;
        vec2 position = scaled + u_translation;
        vec2 zeroToOne = position / u_resolution;
        vec2 zeroToTwo = zeroToOne * 2.0;
        vec2 clipSpace = zeroToTwo - 1.0; 
        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    }
`;

const fsSource = `
    precision mediump float;
    uniform vec4 u_color;
    void main() {
        gl_FragColor = u_color;
    }
`;

let program = null;
let positionBuffer = null;

const webGLRenderSystem = (entities, components, gl) => {

    // Init WebGL one time
    if (!program) {
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vsSource);
        gl.compileShader(vertexShader);

        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fsSource);
        gl.compileShader(fragmentShader);

        program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,0, 1,0, 0,1, 0,1, 1,0, 1,1]), gl.STATIC_DRAW);
    }

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const colorLocation = gl.getUniformLocation(program, "u_color");
    const translationLocation = gl.getUniformLocation(program, "u_translation");
    const scaleLocation = gl.getUniformLocation(program, "u_scale");

    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

    for (const entity of Object.getOwnPropertySymbols(components[cpn.RenderableTag.name])) {
        if (components.PositionComponent[entity] && components.GraphicsComponent[entity]) {
            const pos = components.PositionComponent[entity];
            const graphics = components.GraphicsComponent[entity];
            const info = graphics.shapeInfo;

            let color = [1, 1, 1, 1];
            if (info.color == 'red') color = [1.0, 0.0, 0.0, 1.0];
            else if (info.color == 'blue') color = [0.0, 0.0, 1.0, 1.0];
            else if (info.color == 'orange') color = [1.0, 0.64, 0.0, 1.0];
            else if (info.color == '#E1ABAE') color = [0.88, 0.67, 0.68, 1.0];

            gl.uniform4fv(colorLocation, color);
            gl.uniform2f(translationLocation, pos.x, pos.y);
            gl.uniform2f(scaleLocation, info.w, info.h);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
    }
};

export { webGLRenderSystem };