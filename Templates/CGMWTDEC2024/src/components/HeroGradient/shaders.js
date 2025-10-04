export const backgroundVertexShader = `
  precision highp float;
  attribute vec4 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = position;
  }
`;

export const backgroundFragmentShader = `
  precision highp float;
  varying vec2 vUv;
  uniform float time;
  uniform float scale;
  uniform float timeSpeed;
  uniform vec2 resolution;
  uniform vec3 color1, color2, color3, color4;
  uniform float ax, ay, az, aw;
  uniform float bx, by;
  
  const float PI = 3.141592654;
  
  float cheapNoise(vec3 stp) {
    vec3 p = vec3(stp.st, stp.p);
    vec4 a = vec4(ax, ay, az, aw);
    return mix(
      sin(p.z + p.x * a.x + cos(p.x * a.x - p.z)) * 
      cos(p.z + p.y * a.y + cos(p.y * a.x + p.z)),
      sin(1. + p.x * a.z + p.z + cos(p.y * a.w - p.z)) * 
      cos(1. + p.y * a.w + p.z + cos(p.x * a.x + p.z)), 
      .436
    );
  }
  
  void main() {
    vec2 aR = vec2(resolution.x/resolution.y, 1.);
    vec2 st = vUv * aR * scale;
    float adjustedTime = time * timeSpeed;
    float S = sin(adjustedTime * 0.0005);
    float C = cos(adjustedTime * 0.0005);
    vec2 v1 = vec2(cheapNoise(vec3(st, 2.)), cheapNoise(vec3(st, 1.)));
    vec2 v2 = vec2(
      cheapNoise(vec3(st + bx*v1 + vec2(C * 1.7, S * 9.2), 0.015 * adjustedTime)),
      cheapNoise(vec3(st + by*v1 + vec2(S * 8.3, C * 2.8), 0.0126 * adjustedTime))
    );
    float n = .5 + .5 * cheapNoise(vec3(st + v2, 0.));
    
    vec3 color = mix(color1,
      color2,
      clamp((n*n)*8.,0.0,1.0));
    color = mix(color,
      color3,
      clamp(length(v1),0.0,1.0));
    color = mix(color,
                color4,
                clamp(length(v2.x),0.0,1.0));
    
    color /= n*n + n * 7.;
    gl_FragColor = vec4(color,1.);
  }
`;

export const sphereVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const sphereFragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  uniform float time;
  uniform float scale;
  uniform float timeSpeed;
  uniform float brightness;
  uniform vec3 color1;
  uniform vec3 color2;
  uniform vec3 color3;
  uniform vec3 color4;  
  uniform float ax, ay, az, aw;
  uniform float bx, by;
  
  float cheapNoise(vec3 stp) {
    vec3 p = vec3(stp.st, stp.p);
    vec4 a = vec4(ax, ay, az, aw);
    return mix(
      sin(p.z + p.x * a.x + cos(p.x * a.x - p.z)) *
       cos(p.z + p.y * a.y + cos(p.y * a.x + p.z)),
      sin(1. + p.x * a.z + p.z + cos(p.y * a.w - p.z)) *
       cos(1. + p.y * a.w + p.z + cos(p.x * a.x + p.z)),
       .436
    );
  }
  
  void main() {
    vec2 st = vUv * scale;
    float adjustedTime = time * timeSpeed;
    float S = sin(adjustedTime * 0.0005);
    float C = cos(adjustedTime * 0.0005);
    
    vec3 pos = normalize(vPosition);
    st += pos.xy * 0.5;
    
    vec2 v1 = vec2(cheapNoise(vec3(st, 2.)), cheapNoise(vec3(st, 1.)));
    vec2 v2 = vec2(
      cheapNoise(vec3(st + bx*v1 + vec2(C * 1.7, S * 9.2), 0.015 * adjustedTime)),
      cheapNoise(vec3(st + by*v1 + vec2(S * 8.3, C * 2.8), 0.0126 * adjustedTime))
    );
    float n = .5 + .5 * cheapNoise(vec3(st + v2, 0.));
    
    vec3 color = mix(color1, color2, clamp((n*n)*8.,0.0,1.0));
    color = mix(color, color3, clamp(length(v1),0.0,1.0));
    color = mix(color, color4, clamp(length(v2.x),0.0,1.0));
    
    float specular = pow(max(dot(normalize(vec3(1.0, 1.0, 1.0)), vNormal), 0.0), 32.0);
    color += vec3(specular * 0.5);
    
    color /= n*n + n * 7.;
    color *= brightness;
    gl_FragColor = vec4(color, 1.0);
  }
`;
