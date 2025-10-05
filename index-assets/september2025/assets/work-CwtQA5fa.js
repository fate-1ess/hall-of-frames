import{g as u,S,r as y,a as T,b as C,c as z,s as R}from"./menu-CbjtpD-9.js";import{S as D,O as L,W as b,a as q,V as v,M as E,P as F,T as P,L as U}from"./three.module-CTTR9sde.js";import"./hover-uuUIMMQm.js";const d=[{title:"Gilded Noise",description:"Heat, gold, and the sharp glint of teeth caught in a half-lit confession.",type:"Still",field:"Cinematic",date:"2025",image:"/work/work-1.jpg",route:"/film"},{title:"White Rush",description:"Motion buried in snow. A body pressed against speed, swallowed by cold silence.",type:"Sequence",field:"Documentary",date:"2023",image:"/work/work-2.jpg",route:"/film"},{title:"Copper Skin",description:"Sweat, shadow, and the texture of closeness sculpted by unrelenting light.",type:"Portrait",field:"Experimental",date:"2024",image:"/work/work-3.jpg",route:"/film"},{title:"Static Youth",description:"Black and white glare. Two figures in defiance, gazes sharpened through the lens.",type:"Editorial",field:"Brutalist",date:"2022",image:"/work/work-4.jpg",route:"/film"}],k=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,M=`
  uniform sampler2D uTexture1;
  uniform sampler2D uTexture2;
  uniform float uProgress;
  uniform vec2 uResolution;
  uniform vec2 uTexture1Size;
  uniform vec2 uTexture2Size;
  varying vec2 vUv;
  
  vec2 getCoverUV(vec2 uv, vec2 textureSize) {
    vec2 s = uResolution / textureSize;
    float scale = max(s.x, s.y);
    vec2 scaledSize = textureSize * scale;
    vec2 offset = (uResolution - scaledSize) * 0.5;
    return (uv * uResolution - offset) / scaledSize;
  }
  
  vec2 getDistortedUv(vec2 uv, vec2 direction, float factor) {
    vec2 scaledDirection = direction;
    scaledDirection.y *= 2.0;
    return uv - scaledDirection * factor;
  }
  
  struct LensDistortion {
    vec2 distortedUV;
    float inside;
  };
  
  LensDistortion getLensDistortion(
    vec2 p,
    vec2 uv,
    vec2 sphereCenter,
    float sphereRadius,
    float focusFactor
  ) {
    vec2 distortionDirection = normalize(p - sphereCenter);
    float focusRadius = sphereRadius * focusFactor;
    float focusStrength = sphereRadius / 3000.0;
    float focusSdf = length(sphereCenter - p) - focusRadius;
    float sphereSdf = length(sphereCenter - p) - sphereRadius;
    float inside = smoothstep(0.0, 1.0, -sphereSdf / (sphereRadius * 0.001));
    
    float magnifierFactor = focusSdf / (sphereRadius - focusRadius);
    float mFactor = clamp(magnifierFactor * inside, 0.0, 1.0);
    mFactor = pow(mFactor, 5.0);
    
    float distortionFactor = mFactor * focusStrength;
    
    vec2 distortedUV = getDistortedUv(uv, distortionDirection, distortionFactor);
    
    return LensDistortion(distortedUV, inside);
  }
  
  void main() {
    vec2 center = vec2(0.5, 0.5);
    vec2 p = vUv * uResolution;
    
    vec2 uv1 = getCoverUV(vUv, uTexture1Size);
    vec2 uv2 = getCoverUV(vUv, uTexture2Size);
    
    float maxRadius = length(uResolution) * 1.5;
    float bubbleRadius = uProgress * maxRadius;
    vec2 sphereCenter = center * uResolution;
    float focusFactor = 0.25;
    
    float dist = length(sphereCenter - p);
    float mask = step(bubbleRadius, dist);
    
    vec4 currentImg = texture2D(uTexture1, uv1);
    
    LensDistortion distortion = getLensDistortion(
      p, uv2, sphereCenter, bubbleRadius, focusFactor
    );
    
    vec4 newImg = texture2D(uTexture2, distortion.distortedUV);
    
    float finalMask = max(mask, 1.0 - distortion.inside);
    vec4 color = mix(newImg, currentImg, finalMask);
    
    gl_FragColor = color;
  }
`;u.registerPlugin(S);u.config({nullTargetWarn:!1});let c=0,p=!1,o=[],r,m;function A(e){if(e.querySelectorAll(".char").length>0)return;const t=e.textContent.split(" ");e.innerHTML="",t.forEach((i,a)=>{const l=document.createElement("div");if(l.className="word",[...i].forEach(n=>{const s=document.createElement("div");s.className="char",s.innerHTML=`<span>${n}</span>`,l.appendChild(s)}),e.appendChild(l),a<t.length-1){const n=document.createElement("div");n.className="char space-char",n.innerHTML="<span> </span>",e.appendChild(n)}})}function g(e){new S(e,{type:"lines",linesClass:"line"}),e.querySelectorAll(".line").forEach(t=>{t.innerHTML=`<span>${t.textContent}</span>`})}function V(e){let t=!1,i=null;e.dataset.originalColor||(e.dataset.originalColor=getComputedStyle(e).color),e.addEventListener("mouseenter",()=>{t||(t=!0,i&&i.wordSplit?.revert(),i=R(e,0,{duration:.1,charDelay:25,stagger:10,maxIterations:5}),setTimeout(()=>{t=!1},250))}),e.addEventListener("mouseleave",()=>{e.style.color=e.dataset.originalColor||""})}function h(e){const t=e.querySelector(".slide-title h1");t&&A(t),e.querySelectorAll(".slide-description p").forEach(g);const i=e.querySelector(".slide-link a");i&&(g(i),V(i))}const w=e=>{const t=document.createElement("div");t.className="slider-content",t.style.opacity="0";const i=z(e.route);return t.innerHTML=`
    <div class="slide-title"><h1>${e.title}</h1></div>
    <div class="slide-description">
      <p>${e.description}</p>
      <div class="slide-info">
        <p>Type. ${e.type}</p>
        <p>Field. ${e.field}</p>
        <p>Date. ${e.date}</p>
      </div>
      <div class="slide-link">
        <a href="${i}">[ View Full Project ]</a>
      </div>
    </div>
  `,t},H=e=>{const t=document.querySelector(".slider-content"),i=document.querySelector(".slider"),a=u.timeline(),l=t.querySelector(".slide-title h1");l&&T(l,0),a.to([...t.querySelectorAll(".line span")],{y:"-100%",duration:.6,stagger:.025,ease:"power2.inOut"},.1).call(()=>{const n=w(d[e]);a.kill(),i.appendChild(n),u.set(n.querySelectorAll("span"),{y:"100%"}),setTimeout(()=>{h(n);const s=n.querySelector(".slide-title h1"),f=n.querySelectorAll(".line span");u.set(f,{y:"100%"}),u.set(n,{opacity:1}),u.timeline({onComplete:()=>{p=!1,c=e,t.remove()}}).call(()=>{s&&C(s,0)}).to(f,{y:"0%",duration:.5,stagger:.1,ease:"power2.inOut"},.3)},100)},null,.8)},I=()=>{const e=document.querySelector(".slider-content");h(e);const t=e.querySelectorAll(".line span");u.set(t,{y:"0%"})},W=async()=>{const e=new D,t=new L(-1,1,1,-1,0,1);m=new b({canvas:document.querySelector("canvas"),antialias:!0}),m.setSize(window.innerWidth,window.innerHeight),r=new q({uniforms:{uTexture1:{value:null},uTexture2:{value:null},uProgress:{value:0},uResolution:{value:new v(window.innerWidth,window.innerHeight)},uTexture1Size:{value:new v(1,1)},uTexture2Size:{value:new v(1,1)}},vertexShader:k,fragmentShader:M}),e.add(new E(new F(2,2),r));const i=new P;for(const l of d){const n=y(l.image),s=await new Promise((f,x)=>i.load(n,f,void 0,x));s.minFilter=s.magFilter=U,s.userData={size:new v(s.image.width,s.image.height)},o.push(s)}r.uniforms.uTexture1.value=o[0],r.uniforms.uTexture2.value=o[1],r.uniforms.uTexture1Size.value=o[0].userData.size,r.uniforms.uTexture2Size.value=o[1].userData.size;const a=()=>{requestAnimationFrame(a),m.render(e,t)};a()},$=()=>{if(p)return;p=!0;const e=(c+1)%d.length;r.uniforms.uTexture1.value=o[c],r.uniforms.uTexture2.value=o[e],r.uniforms.uTexture1Size.value=o[c].userData.size,r.uniforms.uTexture2Size.value=o[e].userData.size,H(e),u.fromTo(r.uniforms.uProgress,{value:0},{value:1,duration:2.5,ease:"power2.inOut",onComplete:()=>{r.uniforms.uProgress.value=0,r.uniforms.uTexture1.value=o[e],r.uniforms.uTexture1Size.value=o[e].userData.size}})},j=()=>{m.setSize(window.innerWidth,window.innerHeight),r.uniforms.uResolution.value.set(window.innerWidth,window.innerHeight);const e=document.querySelector(".slider-content");if(!e)return;const t=d[c],i=document.querySelector(".slider");e.remove();const a=w(t);i.appendChild(a),document.fonts.ready.then(()=>{h(a);const l=(c+1)%d.length;r.uniforms.uTexture1.value=o[c],r.uniforms.uTexture2.value=o[l],r.uniforms.uTexture1Size.value=o[c].userData.size,r.uniforms.uTexture2Size.value=o[l].userData.size,r.uniforms.uProgress.value=0;const n=a.querySelectorAll(".line span");u.set(n,{y:"0%"}),u.set(a,{opacity:"1"})})};window.addEventListener("load",()=>{document.fonts.ready.then(()=>{I(),W()})});document.addEventListener("click",e=>{e.target.closest(".slide-link a")||e.target.closest("nav")||e.target.closest(".nav-overlay")||e.target.closest(".menu-toggle-btn")||$()});window.addEventListener("resize",j);
