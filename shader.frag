#ifdef GL_ES
precision highp float;
precision highp int;
#endif

varying vec2 vTexCoord;

uniform vec2 resolution;
uniform int maxIterations;
uniform vec2 canvasPosition;
uniform vec2 scale;

const int loopLimit = 1280;

float normalizeConvert(in float value, in float min_one, in float max_one, in float min_two, in float max_two) {
    return (value - min_one) * (max_two - min_two) / (max_one - min_one) + min_two;
}

void main() {
    // because of the varying vTexCoord, we can access the current texture coordinate
    vec2 coordinate = vTexCoord;
    vec2 uv = gl_FragCoord.xy / resolution - 0.5; // normalize and move to center

    //---------------------------------------------

    vec2 z = canvasPosition + uv * scale; // give a center and scale the pixels around the center by a factor
    vec2 c = z;

    //---------------------------------------------

    float brightness = 0.0;
    // vec3 color = vec3(0.0, 0.0, 0.0);

    // loop index cant be compared with a non-constant expression so a break is used
    for (int i = 0; i < loopLimit; i++) {
        z = vec2(
            z.x * z.x - z.y * z.y,
            2.0 * z.x * z.y
        ) + c;

        if (dot(z, z) > 8.0 || i >= maxIterations) {
            if (i < maxIterations) {
                // no fade
                // brightness = float(i);

                // smooth out the colors
               brightness = float(i) - log2(log2(dot(z,z))) + 4.0; // longer fade
            //    brightness = float(i) - log2(log(dot(z,z)) / 2.0); // shorter fade

               brightness /= float(maxIterations);
            }

            break;
        }
    }

    float colorR = sin(brightness / 1.5) * 2.0;
    float colorG = sin(brightness + colorR) * 2.0;
    float colorB = sin(colorR + colorG) * 2.0;
    vec3 color = vec3(colorR, colorG, colorB);
    color = pow(color, vec3(0.5, 0.5, 0.5));

    gl_FragColor = vec4(color, 1.0);
}
