let mandelbrotShader;

let position = [0, 0]; // x, y
let previousMouse = [null, null]; // x, y
let zoomStep = 0; // exponent
let zoom = 1; // starts at 1 bc x^0 = 1
let scaleFactors; // x, y

function getNewScaleFactors(width, height, scale) {
    const aspect_ratio_x = width;
    const aspect_ratio_y = height;
    let scaleX = scale;
    let scaleY = scale;

    // the larger dimension is changed
    if (aspect_ratio_x < aspect_ratio_y) {
        scaleY = scale * aspect_ratio_y / aspect_ratio_x;
    }
    else if (aspect_ratio_x > aspect_ratio_y) {
        scaleX = scaleY * aspect_ratio_x / aspect_ratio_y;
    }

    return [scaleX, scaleY];
}

async function setup() {
    mandelbrotShader = await loadShader('shader.vert', 'shader.frag');

    const border = 16;
    createCanvas(windowWidth - border, windowHeight - border, WEBGL);

    previousMouse[0] = mouseX;
    previousMouse[1] = mouseY;
    scaleFactors = getNewScaleFactors(width, height, zoom);
}

function windowResized() {
    const border = 16;
    resizeCanvas(windowWidth - border, windowHeight - border);
    scaleFactors = getNewScaleFactors(width, height, zoom);
}

function draw() {
    // movement

    // mouse
    if (mouseIsPressed) {
        // the simplified conversion of screen space to mandelbrot space and taking the difference between current and previous mouse location
        position[0] -= (mouseX - previousMouse[0]) * scaleFactors[0] / width;
        position[1] += (mouseY - previousMouse[1]) * scaleFactors[1] / height;
    }

    previousMouse[0] = mouseX;
    previousMouse[1] = mouseY;

    // keyboard
    if (keyIsPressed) {
        // forwards and backwards
        if (keyCode == 87) { // 87: w
            position[1] += scaleFactors[1] / height * 10;
        }
        else if (keyCode == 83) { // 83: s
            position[1] -= scaleFactors[1] / height * 10;
        }

        // side
        else if (keyCode == 65) { // 65: a
            position[0] -= scaleFactors[0] / width * 10;
        }
        else if (keyCode == 68) { // 68: d
            position[0] += scaleFactors[0] / width * 10;
        }

        // zoom in and out
        else if (keyCode == 16) { // 16: shift | out
            // flip the exponential function so that it decreases as x increases
            // 1.025 has an ok zoom rate. 1.01 is too slow. 1.05 is too fast
            zoomStep--;
            zoom = Math.pow(1.025, -zoomStep);

            scaleFactors = getNewScaleFactors(width, height, zoom);
        }
        else if (keyCode == 32) { // 32: space | in
            zoomStep++;
            zoom = Math.pow(1.025, -zoomStep);

            scaleFactors = getNewScaleFactors(width, height, zoom);
        }
    }

    //---------------------------------------------

    shader(mandelbrotShader);

    mandelbrotShader.setUniform('resolution', [width, height]);
    mandelbrotShader.setUniform('maxIterations', 1024);
    mandelbrotShader.setUniform('canvasPosition', position);
    mandelbrotShader.setUniform('scale', scaleFactors);

    // apply the shader to a rectangle taking up the full canvas
    rect(0, 0, width, height);
}
