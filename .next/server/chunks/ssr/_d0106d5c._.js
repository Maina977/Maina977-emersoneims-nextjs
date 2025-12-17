module.exports=[57659,a=>{"use strict";var b=a.i(72131);function c(){let[a,c]=(0,b.useState)(!1);return(0,b.useEffect)(()=>{},[]),a}a.s(["useReducedMotion",()=>c])},43657,a=>{"use strict";var b=a.i(39705),c=a.i(72131),d=a.i(5457),e=a.i(99777),f=a.i(35258);let g=c.forwardRef(({envMap:a,resolution:g=256,frames:h=1/0,makeDefault:i,children:j,...k},l)=>{let m=(0,d.useThree)(({set:a})=>a),n=(0,d.useThree)(({camera:a})=>a),o=(0,d.useThree)(({size:a})=>a),p=c.useRef(null);c.useImperativeHandle(l,()=>p.current,[]);let q=c.useRef(null),r=function(a,b,e){let g=(0,d.useThree)(a=>a.size),h=(0,d.useThree)(a=>a.viewport),i="number"==typeof a?a:g.width*h.dpr,j=g.height*h.dpr,{samples:k=0,depth:l,...m}=("number"==typeof a?void 0:a)||{},n=c.useMemo(()=>{let a=new f.WebGLRenderTarget(i,j,{minFilter:f.LinearFilter,magFilter:f.LinearFilter,type:f.HalfFloatType,...m});return l&&(a.depthTexture=new f.DepthTexture(i,j,f.FloatType)),a.samples=k,a},[]);return c.useLayoutEffect(()=>{n.setSize(i,j),k&&(n.samples=k)},[k,n,i,j]),c.useEffect(()=>()=>n.dispose(),[]),n}(g);c.useLayoutEffect(()=>{k.manual||(p.current.aspect=o.width/o.height)},[o,k]),c.useLayoutEffect(()=>{p.current.updateProjectionMatrix()});let s=0,t=null,u="function"==typeof j;return(0,e.useFrame)(b=>{u&&(h===1/0||s<h)&&(q.current.visible=!1,b.gl.setRenderTarget(r),t=b.scene.background,a&&(b.scene.background=a),b.gl.render(b.scene,p.current),b.scene.background=t,b.gl.setRenderTarget(null),q.current.visible=!0,s++)}),c.useLayoutEffect(()=>{if(i)return m(()=>({camera:p.current})),()=>m(()=>({camera:n}))},[p,i,m]),c.createElement(c.Fragment,null,c.createElement("perspectiveCamera",(0,b.default)({ref:p},k),!u&&j),c.createElement("group",{ref:q},u&&j(r.texture)))});a.s(["PerspectiveCamera",()=>g],43657)},9486,a=>{"use strict";var b=a.i(87924),c=a.i(72131),d=a.i(10129),e=a.i(99777),f=a.i(35258),g=a.i(73974),h=a.i(43657),i=a.i(57659);function j({position:a,color:d,size:g,mousePosition:h}){let i=(0,c.useRef)(null),j=(0,c.useRef)(null);(0,c.useRef)(new f.Vector3((Math.random()-.5)*.01,(Math.random()-.5)*.01,(Math.random()-.5)*.01));let k=(0,c.useRef)(new f.Vector3(...a)),l=(0,c.useRef)(Math.random()*Math.PI*2),[m,n]=(0,c.useState)(!1),o=(0,c.useMemo)(()=>new f.ShaderMaterial({uniforms:{uTime:{value:0},uColor:{value:new f.Color(d)},uMouse:{value:new f.Vector3},uHover:{value:0}},vertexShader:`
        uniform float uTime;
        uniform vec3 uMouse;
        uniform float uHover;
        
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
          vPosition = position;
          vNormal = normal;
          
          vec3 pos = position;
          
          // Morphing effect based on noise
          float noise = sin(pos.x * 2.0 + uTime) * 
                       cos(pos.y * 3.0 + uTime * 0.7) * 
                       sin(pos.z * 2.5 + uTime * 0.5) * 0.1;
          
          // Mouse interaction
          float dist = distance(pos, uMouse);
          float mouseInfluence = 1.0 / (1.0 + dist * 2.0);
          pos += normal * noise * (1.0 + mouseInfluence * uHover * 0.5);
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,fragmentShader:`
        uniform vec3 uColor;
        uniform float uTime;
        uniform float uHover;
        
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
          vec3 color = uColor;
          
          // Animated color shift
          color.r += sin(uTime * 0.5) * 0.1;
          color.g += cos(uTime * 0.7) * 0.1;
          color.b += sin(uTime * 0.6) * 0.1;
          
          // Fresnel effect
          float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          color += fresnel * 0.3;
          
          // Hover glow
          color += uHover * 0.2;
          
          gl_FragColor = vec4(color, 0.7 + uHover * 0.3);
        }
      `,transparent:!0,side:2}),[d]);return(0,e.useFrame)(b=>{if(!i.current||!j.current)return;let c=b.clock.getElapsedTime();j.current.uniforms.uTime.value=c+l.current,j.current.uniforms.uMouse.value.copy(h),j.current.uniforms.uHover.value=+!!m;let d=Math.sin(.5*c+l.current)*Math.cos(.3*c),e=Math.cos(.7*c+l.current)*Math.sin(.4*c),f=Math.sin(.6*c+l.current)*Math.cos(.5*c);if(k.current.x=a[0]+3*d,k.current.y=a[1]+3*e+2*Math.sin(c),k.current.z=a[2]+3*f,i.current.position.lerp(k.current,.03),3>i.current.position.distanceTo(h)){let a=i.current.position.clone().sub(h).normalize();i.current.position.add(a.multiplyScalar(.1))}let g=1+.4*Math.sin(.8*c+l.current),n=1+.4*Math.cos(.6*c+l.current),o=1+.4*Math.sin(.7*c+l.current);i.current.scale.set(g,n,o),i.current.rotation.x+=.003,i.current.rotation.y+=.005,i.current.rotation.z+=.002}),(0,b.jsxs)("mesh",{ref:i,position:a,material:j,onPointerEnter:()=>n(!0),onPointerLeave:()=>n(!1),children:[(0,b.jsx)("icosahedronGeometry",{args:[g,3]}),(0,b.jsx)("primitive",{object:o,ref:j,attach:"material"})]})}function k({mousePosition:a}){let d=(0,i.useReducedMotion)(),e=(0,c.useMemo)(()=>d?[]:Array.from({length:12},(a,b)=>({position:[(Math.random()-.5)*15,8*Math.random()+2,(Math.random()-.5)*15],color:`hsl(${240+15*b}, 85%, ${60+b%3*10}%)`,size:.4+.5*Math.random()})),[d]);return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("ambientLight",{intensity:.5}),(0,b.jsx)("pointLight",{position:[10,10,10],intensity:1,color:"#ffffff"}),(0,b.jsx)("pointLight",{position:[-10,-10,-10],intensity:.8,color:"#4a90e2"}),(0,b.jsx)("pointLight",{position:[0,10,-10],intensity:.6,color:"#ff6b9d"}),e.map((c,d)=>(0,b.jsx)(j,{...c,mousePosition:a},`blob-${d}`))]})}function l({className:a=""}){let[e,i]=(0,c.useState)(new f.Vector3(0,0,0)),j=(0,c.useRef)(null);return(0,c.useEffect)(()=>{let a=a=>{if(!j.current)return;let b=j.current.getBoundingClientRect(),c=((a.clientX-b.left)/b.width-.5)*20,d=((b.bottom-a.clientY)/b.height-.5)*20;i(new f.Vector3(c,d,5))};if(j.current)return j.current.addEventListener("mousemove",a),()=>{j.current?.removeEventListener("mousemove",a)}},[]),(0,b.jsx)("div",{ref:j,className:`relative w-full h-full ${a}`,children:(0,b.jsxs)(d.Canvas,{camera:{position:[0,8,15],fov:60},gl:{antialias:!0,alpha:!0},dpr:1,children:[(0,b.jsx)(h.PerspectiveCamera,{makeDefault:!0,position:[0,8,15],fov:60}),(0,b.jsx)(k,{mousePosition:e}),(0,b.jsx)(g.OrbitControls,{enableZoom:!1,enablePan:!1,autoRotate:!0,autoRotateSpeed:.3})]})})}a.s(["default",()=>l])}];

//# sourceMappingURL=_d0106d5c._.js.map