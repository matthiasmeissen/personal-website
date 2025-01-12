// Get WebGL context
const canvas = document.getElementById('webgl');
const gl = canvas.getContext('webgl');

if (!gl) {
    console.error('WebGL not supported');
    document.body.innerHTML = 'WebGL is not supported by your browser.';
}

// Vertex shader source
const vsSource = `
    attribute vec4 aVertexPosition;
    void main() {
        gl_Position = aVertexPosition;
    }
`;

// Fragment shader source
const fsSource = `
precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_a, u_b, u_c, u_d;

vec2 rotate(vec2 p, float a) {
    mat2 m = mat2(cos(a), -sin(a), sin(a), cos(a));
    return p * m;
}

// https://iquilezles.org/articles/palettes/
vec3 palette( float t ) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.0,0.10,0.20);

    return a + b*cos( 6.28318*(c*t+d) );
}


void main() {    
    vec2 p = (2.0 * gl_FragCoord.xy - u_resolution.xy) / u_resolution.y;

    p = vec2(length(p), sin(p.y));

    p = mix(p * 0.2, p, u_a);

    vec2 p1 = mix(p, tan(p * 10.0), u_b * 0.04);

    vec2 t = mod(vec2(0.4 * p1.x, p.y) * 2.0, rotate(p1, tan(p.y) + u_time * 0.4).x);
    
    float t1 = t.x / max(t.y, 0.0001); // Avoid division by zero

    t1 = t1 / max(length(p * 8.0), 0.0001); // Avoid division by zero

    float t2 = step(mod(p.x, abs(sin(u_time * 0.4))) + 0.2, t1);
    t1 = smoothstep(0.0, abs(sin(u_time * 0.2)) + 0.4, t1);

    t1 = mix(t1, t2, length(p));

    vec3 color = palette(t1 + 0.4);

    gl_FragColor = vec4(color,1.0);
}
`;

// Compile shader
function compileShader(gl, source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

// Create shader program
function createShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = compileShader(gl, vsSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, fsSource, gl.FRAGMENT_SHADER);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

// Initialize buffers
function initBuffers(gl) {
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
        -1.0,  1.0,
         1.0,  1.0,
        -1.0, -1.0,
         1.0, -1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    return positionBuffer;
}

// Main function
function runShader(a, b, c, d) {
    const shaderProgram = createShaderProgram(gl, vsSource, fsSource);
    const positionBuffer = initBuffers(gl);

    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        },
        uniformLocations: {
            time: gl.getUniformLocation(shaderProgram, 'u_time'),
            resolution: gl.getUniformLocation(shaderProgram, 'u_resolution'),
            a: gl.getUniformLocation(shaderProgram, 'u_a'),
            b: gl.getUniformLocation(shaderProgram, 'u_b'),
            c: gl.getUniformLocation(shaderProgram, 'u_c'),
            d: gl.getUniformLocation(shaderProgram, 'u_d'),
        },
    };

    // Resize the canvas to match its displayed size and update the WebGL viewport
    resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Bind the position buffer and set up the vertex attributes
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

    // Use the shader program
    gl.useProgram(programInfo.program);

    // Set static uniform values for 'a', 'b', 'c', 'd', and 'resolution'
    gl.uniform1f(programInfo.uniformLocations.a, a);
    gl.uniform1f(programInfo.uniformLocations.b, b);
    gl.uniform1f(programInfo.uniformLocations.c, c);
    gl.uniform1f(programInfo.uniformLocations.d, d);
    gl.uniform2f(programInfo.uniformLocations.resolution, gl.canvas.width, gl.canvas.height);

    // Render loop
    function render(time) {
        time *= 0.001;  // convert to seconds

        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform1f(programInfo.uniformLocations.time, time);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

// Resize canvas
function resizeCanvasToDisplaySize(canvas) {
    const displayWidth  = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    
    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width  = displayWidth;
        canvas.height = displayHeight;
        console.log(`Resized canvas to ${canvas.width}x${canvas.height}`);
    }
}

runShader(0.5, 0.5, 0.5, 0.5);
