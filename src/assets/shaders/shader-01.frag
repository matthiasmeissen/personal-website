precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

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

    p = mix(p * 0.2, p, atan(u_mouse.y, u_mouse.x * p.x));

    vec2 p1 = mix(p, tan(p * 10.0), u_mouse.x * 0.2);

    vec2 t = mod(vec2(0.4 * p1.x, p.y) * 2.0, rotate(p1, tan(p.y) + u_time * 0.4).x);
    
    float t1 = t.x / max(t.y, 0.0001);

    t1 = t1 / max(length(p * 8.0), 0.0001);

    float t2 = step(mod(p.x, abs(sin(u_time * 0.4))) + 0.2, t1);
    t1 = smoothstep(0.0, abs(sin(u_time * 0.2)) + 0.4, t1);

    t1 = mix(t1, t2, length(p));

    vec3 color = palette(t1 + 0.4);

    gl_FragColor = vec4(color,1.0);
}