import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
export function createScene(container,onSelect){
 const low=new URLSearchParams(location.search).get('gpu')==='false'||!!window.websim?.lowGpu;
 const scene=new THREE.Scene();scene.background=new THREE.Color('#e6e9de');scene.fog=new THREE.Fog('#e6e9de',125,260);
 const camera=new THREE.PerspectiveCamera(35,innerWidth/innerHeight,0.5,400);camera.position.set(93,91,111);
 const renderer=new THREE.WebGLRenderer({antialias:!low,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,low?1:1.6));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=!low;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;container.appendChild(renderer.domElement);
 const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,0,0);controls.enableDamping=!low;controls.dampingFactor=.065;controls.maxPolarAngle=Math.PI*.43;controls.minPolarAngle=.15;controls.minDistance=48;controls.maxDistance=190;controls.maxTargetRadius=40;controls.enablePan=true;
 const hemi=new THREE.HemisphereLight('#fff8de','#78876d',3);scene.add(hemi);const sun=new THREE.DirectionalLight('#fff1d7',4);sun.position.set(-45,70,-30);sun.castShadow=!low;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-80,right:80,top:80,bottom:-80,near:1,far:180});sun.shadow.normalBias=.05;sun.shadow.bias=-.0003;scene.add(sun);scene.add(sun.target);
 const mats={};const mat=(color,roughness=.82,metalness=0)=>mats[color+roughness+metalness]||(mats[color+roughness+metalness]=new THREE.MeshStandardMaterial({color,roughness,metalness}));
 const cream=mat('#e3dfca'),stone=mat('#c1c3a9'),white=mat('#e9e7d9'),terracotta=mat('#b77959'),wood=mat('#977955'),dark=mat('#4b5e50'),glass=new THREE.MeshPhysicalMaterial({color:'#9eccc0',transparent:true,opacity:.46,roughness:.2,metalness:.1,side:THREE.DoubleSide}),solar=mat('#455d5b',.38,.28);
 function mesh(geo,m,x=0,y=0,z=0,parent=scene){const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=!low;o.receiveShadow=!low;parent.add(o);return o;}
 function box(x,y,z,w,h,d,m,parent=scene){return mesh(new THREE.BoxGeometry(w,h,d),m,x,y,z,parent);}
 function cyl(x,y,z,r,h,m,parent=scene,rt=r){return mesh(new THREE.CylinderGeometry(rt,r,h,32),m,x,y,z,parent);}
 function disk(x,z,r,m,y=.04){return mesh(new THREE.CircleGeometry(r,64),m,x,y,z).rotateX(-Math.PI/2);}
 box(0,-1.2,0,114,2.2,108,mat('#d3d5c2'));box(0,-2.5,0,116,.6,110,mat('#b7bfa8'));box(0,-3.3,0,500,1,500,mat('#e0e5d4'));
 const lawn=mat('#b5c397');box(0,-.05,0,110,.12,104,lawn);
 // Walkable square and four wide branches, all in metre-scale coordinates.
 const paving=mat('#dedcc6');box(0,.025,0,15,.1,77,paving);box(0,.03,0,73,.11,13,paving);
 const path=(x,z,angle,len)=>{const o=box(x,.055,z,5,.12,len,paving);o.rotation.y=angle;};
 path(-9,-9,-Math.PI/4,26);path(9,-9,Math.PI/4,26);path(-9,9,Math.PI/4,26);path(9,9,-Math.PI/4,26);
 disk(0,0,14,paving,.1);disk(0,0,10.4,mat('#d1d3bb'),.12);disk(0,0,9.9,mat('#e0ddc7'),.14);
 const ring=mesh(new THREE.TorusGeometry(11.6,.045,6,100),mat('#acb393'),0,.19,0);ring.rotation.x=Math.PI/2;
 // The assembly: open, not a monumental center of authority.
 cyl(0,.45,0,4.8,.5,cream);cyl(0,.8,0,3.8,.25,white);disk(0,0,2.4,mat('#a7b389'),.94);
 for(let i=0;i<12;i++){const a=i/12*Math.PI*2;const b=box(Math.sin(a)*6.3,.6,Math.cos(a)*6.3,2.3,.5,.7,wood);b.rotation.y=a;}
 for(let i=0;i<8;i++){const a=i/8*Math.PI*2;cyl(Math.sin(a)*8.4,2.5,Math.cos(a)*8.4,.12,5,wood);}
 const pergola=mesh(new THREE.TorusGeometry(8.4,.13,6,64),wood,0,5,0);pergola.rotation.x=Math.PI/2;
 for(let i=0;i<9;i++)box((i-4)*1.65,5,0,.13,.16,15.5,wood);
 function windows(x,z,w,h,d){for(let i=0;i<Math.floor(w/3);i++){const px=x-w/2+1.7+i*3;box(px,h*.52,z+d/2+.02,1.8,h*.45,.08,dark);box(px,h*.52,z-d/2-.02,1.8,h*.45,.08,dark);}for(let i=0;i<Math.floor(d/3);i++)box(x+w/2+.02,h*.52,z-d/2+1.5+i*3,.08,h*.45,1.7,dark);}
 function building(x,z,w,d,h){box(x,h/2,z,w,h,d,cream);box(x,.3,z,w+1,.6,d+1,stone);box(x,h+.18,z,w+.6,.36,d+.6,white);windows(x,z,w,h,d);box(x,h+.55,z-d/2,w+.4,.7,.3,white);box(x,h+.55,z+d/2,w+.4,.7,.3,white);box(x-w/2,h+.55,z,.3,.7,d,white);box(x+w/2,h+.55,z,.3,.7,d,white);return h;}
 function panels(x,y,z,cols,rows){for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){const p=box(x+(i-(cols-1)/2)*2.1,y,z+(j-(rows-1)/2)*2.5,1.9,.12,2.2,solar);p.rotation.x=-.15;for(let k=0;k<3;k++)box(p.position.x+(k-1)*.53,y+.1,p.position.z,.025,.025,2.1,mat('#8ca5a0'));}}
 // Kitchen, terracotta portico, vegetable roof.
 building(-30,-25,19,15,5.4);box(-30,6.2,-25,15,.3,11,mat('#9aaa7c'));
 for(let i=0;i<6;i++)box(-36+i*2.3,6.5,-25,1.2,.5,9,mat(i%2?'#819863':'#9aa865'));
 box(-20.2,3.4,-25,1.4,.5,12,terracotta);for(let i=0;i<5;i++)cyl(-19.8,1.6,-30+i*2.6,.15,3.2,terracotta);
 box(-24,1,-15.7,7,.25,2.2,wood);for(let i=0;i<3;i++)cyl(-34+i*4,1,-14.7,1, .12,white);
 // Creation commons: two volumes and a light industrial shed.
 building(30,-24,18,17,5.8);building(36,-29,8,7,8);panels(29,6.45,-23,5,4);panels(36,8.5,-29,3,2);
 box(20,4,-24,2,.4,17,terracotta);for(let i=0;i<6;i++)box(20,2,-31+i*2.7,.2,4,.2,wood);
 box(29,.6,-11,13,.25,5,cream);for(let i=0;i<4;i++){box(25+i*3,1.5,-11,1.5,1.6,1.4,terracotta);}
 // Homes: modest, private, no luxury gate around basic shelter.
 for(let i=0;i<5;i++){const x=(i-2)*10.8;building(x,-43,8.4,7.6,4.6+(i%2));box(x,2,-38.9,5,.22,1.8,wood);panels(x,5.3+(i%2),-43,2,2);box(x,1.3,-38.9,1.5,2.6,.1,dark);}
 // Restorative sanctuary: open cylindrical pavilions and a courtyard.
 cyl(30,2.7,26,9,5.4,cream);cyl(30,5.55,26,9.5,.35,white);cyl(30,5.8,26,7.6,.25,mat('#a6b08a'));cyl(30,6.4,26,4.4,1,glass,scene,3.5);
 for(let i=0;i<18;i++){const a=i/18*Math.PI*2;const o=box(30+Math.sin(a)*9,2.7,26+Math.cos(a)*9,1.9,3.2,.1,i%3===0?wood:dark);o.rotation.y=a;}
 box(20.5,2.5,26,2,.25,8,white);for(let i=0;i<4;i++)cyl(20,1.2,23+i*2,.12,2.4,wood);
 for(let i=0;i<4;i++){const x=24+i*4;box(x,.3,39,3.1,.6,2.5,stone);box(x,.65,39,2.9,.15,2.2,mat('#91a174'));}
 // Garden greenhouses with transparent pitched roofs.
 for(let i=0;i<3;i++){const x=-37+i*6;box(x,.3,27,5,.5,16,stone);box(x,2,27,4.7,3.5,15.7,glass);const a=box(x-1.17,4.3,27,2.9,.08,15.8,glass);a.rotation.z=.56;const b=box(x+1.17,4.3,27,2.9,.08,15.8,glass);b.rotation.z=-.56;for(let j=0;j<6;j++){box(x,2.3,20+j*2.8,4.9,.08,.1,white);box(x-2.4,2,20+j*2.8,.08,4,.08,white);box(x+2.4,2,20+j*2.8,.08,4,.08,white);}for(let j=0;j<2;j++)box(x-1+j*2,.9,27,1,.7,14,mat('#6c8a53'));}
 for(let i=0;i<5;i++){box(-34+i*3.4,.3,13,2.4,.6,6,wood);box(-34+i*3.4,.7,13,2,.2,5.6,mat(i%2?'#88a262':'#6f8957'));}
 // Rainwater wetland, rocky edge, footbridge.
 const water=mesh(new THREE.CircleGeometry(1,64),new THREE.MeshPhysicalMaterial({color:'#7dafa6',roughness:.25,metalness:.15,transparent:true,opacity:.9}),-41,.09,0);water.rotation.x=-Math.PI/2;water.scale.set(7,15,1);
 const bank=disk(-41,0,1,mat('#a5b095'),.02);bank.scale.set(8,16,1);
 box(-41,.65,3,15,.35,2.6,wood);for(let i=0;i<16;i++)box(-48+i*.9,.86,3,.65,.08,2.6,mat('#b49b72'));
 // Trees are instanced geometry, not textures. Deterministic placement.
 let seed=1301;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const points=[];for(let i=0;i<500&&points.length<120;i++){const x=(random()-.5)*106,z=(random()-.5)*98;const clear= Math.abs(x)<8||Math.abs(z)<8||Math.abs(Math.abs(x)-Math.abs(z))<4||Math.hypot(x,z)<16||(z<-35&&Math.abs(x)<28)||(x<-18&&z<-13&&z>-35)||(x>18&&z<-12&&z>-36)||(x<-20&&z>9&&z<38)||(Math.hypot(x-30,z-26)<12)||(x<-32&&Math.abs(z)<18);if(!clear)points.push([x,z,.85+random()*.6]);}
 const trunks=new THREE.InstancedMesh(new THREE.CylinderGeometry(.13,.23,3,6),wood,points.length);const foliage=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1,2),mat('#78925f'),points.length*3);const dummy=new THREE.Object3D();points.forEach(([x,z,s],i)=>{dummy.position.set(x,1.5*s,z);dummy.scale.set(s,s,s);dummy.rotation.set(0,0,0);dummy.updateMatrix();trunks.setMatrixAt(i,dummy.matrix);for(let k=0;k<3;k++){dummy.position.set(x+(k-1)*.55*s,(3.1+k*.6)*s,z+Math.sin(k*2)*s*.5);dummy.scale.set(1.6*s,(1.9-k*.2)*s,1.6*s);dummy.rotation.y=random()*6;dummy.updateMatrix();foliage.setMatrixAt(i*3+k,dummy.matrix);foliage.setColorAt(i*3+k,new THREE.Color(['#8da173','#71875e','#a3af7d'][Math.floor(random()*3)]));}});trunks.castShadow=foliage.castShadow=!low;foliage.receiveShadow=!low;scene.add(trunks,foliage);
 // Small landscape details: path lights, seats, stones and a distant wind farm.
 for(let i=0;i<16;i++){const a=i/16*Math.PI*2;const x=Math.sin(a)*18,z=Math.cos(a)*18;cyl(x,.8,z,.08,1.6,dark);cyl(x,1.6,z,.18,.12,white);}
 const turbines=[];for(let i=0;i<3;i++){const x=38+i*7,z=-43+i*4;cyl(x,7,z,.35,14,white,scene,.17);const g=new THREE.Group();g.position.set(x,14,z+.5);scene.add(g);cyl(x,14,z,.6,.7,white).rotation.x=Math.PI/2;for(let j=0;j<3;j++){const pivot=new THREE.Group();pivot.rotation.z=j*Math.PI*2/3;box(0,2.7,0,.33,5.7,.12,white,pivot);g.add(pivot);}turbines.push(g);}
 const labels=[];for(const [text,x,y,z]of [['Abundance kitchen',-30,7,-25],['Creation commons',30,10,-24],['Living gardens',-30,6,28],['Restorative sanctuary',30,9,27],['The assembly',0,7,0],['Residences',0,8,-44]]){const el=document.createElement('div');el.className='world-label';el.innerHTML='<span></span>'+text;document.querySelector('#labels').appendChild(el);labels.push({el,position:new THREE.Vector3(x,y,z)});}
 const agentMeshes=new Map(),palette=['#b57452','#6a8b75','#b6a06c','#647d85','#9b7968','#7d8260'];
 const bodyGeo=new THREE.CapsuleGeometry(.26,.65,3,6),headGeo=new THREE.SphereGeometry(.22,10,8),legGeo=new THREE.CylinderGeometry(.085,.075,.55,5);
 function addAgent(a){const g=new THREE.Group();g.userData.id=a.id;const color=palette[agentMeshes.size%palette.length];mesh(bodyGeo,mat(color),0,1.05,0,g);mesh(headGeo,mat('#bd9977'),0,1.76,0,g);mesh(new THREE.SphereGeometry(1.1,8,6),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}),0,1,0,g);const legs=[mesh(legGeo,dark,-.13,.35,0,g),mesh(legGeo,dark,.13,.35,0,g)];const arms=[mesh(legGeo,mat(color),-.36,1.04,0,g),mesh(legGeo,mat(color),.36,1.04,0,g)];scene.add(g);agentMeshes.set(a.id,{g,legs,arms,a,px:a.x,pz:a.z});g.position.set(a.x,.2,a.z);}
 const sphere=new THREE.Group();const globe=mesh(new THREE.SphereGeometry(1,32,20,0,Math.PI*2,0,Math.PI/2),new THREE.MeshBasicMaterial({color:'#c4cfa9',transparent:true,opacity:.12,depthWrite:false}),0,0,0,sphere);const globeWire=mesh(new THREE.SphereGeometry(1,20,10,0,Math.PI*2,0,Math.PI/2),new THREE.MeshBasicMaterial({color:'#718c57',wireframe:true,transparent:true,opacity:.08,depthWrite:false}),0,0,0,sphere);const groundRing=mesh(new THREE.RingGeometry(.97,1,80),new THREE.MeshBasicMaterial({color:'#74945d',side:THREE.DoubleSide,transparent:true,opacity:.7}),0,.09,0,sphere);groundRing.rotation.x=-Math.PI/2;scene.add(sphere);
 let selected='demo-0';const marker=cyl(0,4,0,.18,.3,terracotta,scene,0);marker.rotation.z=Math.PI;
 function update(agents){const ids=new Set(agents.map(a=>a.id));for(const [id,o]of agentMeshes)if(!ids.has(id)){scene.remove(o.g);agentMeshes.delete(id);}for(const a of agents){if(!agentMeshes.has(a.id))addAgent(a);else agentMeshes.get(a.id).a=a;}}
 const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();let down=null;
 renderer.domElement.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY};});renderer.domElement.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>5)return;pointer.set(e.clientX/innerWidth*2-1,-e.clientY/innerHeight*2+1);raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects([...agentMeshes.values()].map(o=>o.g),true)[0];if(hit){let obj=hit.object;while(!obj.userData.id&&obj.parent)obj=obj.parent;if(obj.userData.id){selected=obj.userData.id;onSelect(selected);}}});
 const clock=new THREE.Clock();let previousRender=-2;
 function frame(){requestAnimationFrame(frame);const dt=Math.min(clock.getDelta(),.1),t=clock.elapsedTime;controls.update();for(const [id,o]of agentMeshes){const oldX=o.g.position.x,oldZ=o.g.position.z;o.g.position.x=THREE.MathUtils.damp(oldX,o.a.x,8,dt);o.g.position.z=THREE.MathUtils.damp(oldZ,o.a.z,8,dt);const radius=Math.hypot(o.g.position.x,o.g.position.z);o.g.position.y=radius<3.8?.95:radius<4.8?.7:.2;const dx=o.g.position.x-oldX,dz=o.g.position.z-oldZ,moving=Math.hypot(dx,dz)>.002;if(moving)o.g.rotation.y=Math.atan2(dx,dz);const stride=moving?Math.sin(t*8+o.g.id)*.45:0;o.legs[0].rotation.x=stride;o.legs[1].rotation.x=-stride;o.arms[0].rotation.x=-stride;o.arms[1].rotation.x=stride;
  if(id===selected){const r=o.a.cfg?.privacy||3.4;sphere.position.set(o.g.position.x,o.g.position.y+.03,o.g.position.z);sphere.scale.set(r,r*.8,r);marker.position.set(o.g.position.x,o.g.position.y+4+Math.sin(t*2)*.15,o.g.position.z);}}
 for(const g of turbines)g.rotation.z=t*.22;
 if(low&&t-previousRender<1)return;previousRender=t;for(const {el,position}of labels){const p=position.clone().project(camera);el.style.left=(p.x*.5+.5)*innerWidth+'px';el.style.top=(-p.y*.5+.5)*innerHeight+'px';el.style.display=p.z>1?'none':'';}renderer.render(scene,camera);}
 frame();window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
 return {update,select(id){selected=id;},zoom(f){camera.position.sub(controls.target).multiplyScalar(f).add(controls.target);controls.update();},reset(){camera.position.set(93,91,111);controls.target.set(0,0,0);controls.update();},low};
}
