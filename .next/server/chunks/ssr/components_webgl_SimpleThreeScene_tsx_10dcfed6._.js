module.exports=[26390,a=>{"use strict";var b=a.i(87924),c=a.i(72131),d=a.i(10129),e=a.i(73974),f=a.i(1236),g=a.i(39705),h=a.i(35258),i=a.i(3885),j=a.i(5457),k=a.i(99777);let l=parseInt(h.REVISION.replace(/\D+/g,""));class m extends h.ShaderMaterial{constructor(){super({uniforms:{time:{value:0},pixelRatio:{value:1}},vertexShader:`
        uniform float pixelRatio;
        uniform float time;
        attribute float size;  
        attribute float speed;  
        attribute float opacity;
        attribute vec3 noise;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vOpacity;

        void main() {
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          modelPosition.y += sin(time * speed + modelPosition.x * noise.x * 100.0) * 0.2;
          modelPosition.z += cos(time * speed + modelPosition.x * noise.y * 100.0) * 0.2;
          modelPosition.x += cos(time * speed + modelPosition.x * noise.z * 100.0) * 0.2;
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectionPostion = projectionMatrix * viewPosition;
          gl_Position = projectionPostion;
          gl_PointSize = size * 25. * pixelRatio;
          gl_PointSize *= (1.0 / - viewPosition.z);
          vColor = color;
          vOpacity = opacity;
        }
      `,fragmentShader:`
        varying vec3 vColor;
        varying float vOpacity;
        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float strength = 0.05 / distanceToCenter - 0.1;
          gl_FragColor = vec4(vColor, strength * vOpacity);
          #include <tonemapping_fragment>
          #include <${l>=154?"colorspace_fragment":"encodings_fragment"}>
        }
      `})}get time(){return this.uniforms.time.value}set time(a){this.uniforms.time.value=a}get pixelRatio(){return this.uniforms.pixelRatio.value}set pixelRatio(a){this.uniforms.pixelRatio.value=a}}let n=a=>a&&a.constructor===Float32Array,o=a=>a instanceof h.Vector2||a instanceof h.Vector3||a instanceof h.Vector4,p=a=>Array.isArray(a)?a:o(a)?a.toArray():[a,a,a];function q(a,b,d){return c.useMemo(()=>{if(void 0!==b)if(n(b))return b;else{if(b instanceof h.Color){let c=Array.from({length:3*a},()=>[b.r,b.g,b.b]).flat();return Float32Array.from(c)}if(o(b)||Array.isArray(b)){let c=Array.from({length:3*a},()=>p(b)).flat();return Float32Array.from(c)}return Float32Array.from({length:a},()=>b)}return Float32Array.from({length:a},d)},[b])}let r=c.forwardRef(({noise:a=1,count:b=100,speed:d=1,opacity:e=1,scale:f=1,size:l,color:o,children:r,...s},t)=>{c.useMemo(()=>(0,i.extend)({SparklesImplMaterial:m}),[]);let u=c.useRef(null),v=(0,j.useThree)(a=>a.viewport.dpr),w=p(f),x=c.useMemo(()=>Float32Array.from(Array.from({length:b},()=>w.map(h.MathUtils.randFloatSpread)).flat()),[b,...w]),y=q(b,l,Math.random),z=q(b,e),A=q(b,d),B=q(3*b,a),C=q(void 0===o?3*b:b,n(o)?o:new h.Color(o),()=>1);return(0,k.useFrame)(a=>{u.current&&u.current.material&&(u.current.material.time=a.clock.elapsedTime)}),c.useImperativeHandle(t,()=>u.current,[]),c.createElement("points",(0,g.default)({key:`particle-${b}-${JSON.stringify(f)}`},s,{ref:u}),c.createElement("bufferGeometry",null,c.createElement("bufferAttribute",{attach:"attributes-position",args:[x,3]}),c.createElement("bufferAttribute",{attach:"attributes-size",args:[y,1]}),c.createElement("bufferAttribute",{attach:"attributes-opacity",args:[z,1]}),c.createElement("bufferAttribute",{attach:"attributes-speed",args:[A,1]}),c.createElement("bufferAttribute",{attach:"attributes-color",args:[C,3]}),c.createElement("bufferAttribute",{attach:"attributes-noise",args:[B,3]})),r||c.createElement("sparklesImplMaterial",{transparent:!0,pixelRatio:v,depthWrite:!1}))});function s(){return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("ambientLight",{intensity:.3}),(0,b.jsx)("pointLight",{position:[10,10,10],intensity:.5,color:"#fbbf24"}),(0,b.jsx)("pointLight",{position:[-10,-10,-10],intensity:.5,color:"#00ffff"}),(0,b.jsxs)("mesh",{position:[0,0,-5],rotation:[0,0,0],children:[(0,b.jsx)("boxGeometry",{args:[2,2,2]}),(0,b.jsx)("meshStandardMaterial",{color:"#fbbf24",emissive:"#fbbf24",emissiveIntensity:.2})]}),(0,b.jsxs)("mesh",{position:[3,2,-3],rotation:[Math.PI/4,Math.PI/4,0],children:[(0,b.jsx)("sphereGeometry",{args:[1,32,32]}),(0,b.jsx)("meshStandardMaterial",{color:"#00ffff",emissive:"#00ffff",emissiveIntensity:.2})]}),(0,b.jsx)(r,{count:50,scale:10,size:2,speed:.4,color:"#fbbf24"}),(0,b.jsx)(e.OrbitControls,{autoRotate:!0,autoRotateSpeed:.5,enableZoom:!1,enablePan:!1}),(0,b.jsx)(f.Environment,{preset:"city"})]})}function t(){return(0,b.jsx)(d.Canvas,{camera:{position:[0,0,10],fov:50},gl:{antialias:!0,alpha:!0},style:{width:"100%",height:"100%"},children:(0,b.jsx)(c.Suspense,{fallback:null,children:(0,b.jsx)(s,{})})})}a.s(["default",()=>t],26390)}];

//# sourceMappingURL=components_webgl_SimpleThreeScene_tsx_10dcfed6._.js.map