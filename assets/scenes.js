/* ============ 代码绘制的场景：战国地图、蜀山、关中 ============ */
const NS="http://www.w3.org/2000/svg";
function sv(tag,attrs={},...kids){const el=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(attrs))if(v!=null)el.setAttribute(k,v);kids.flat().forEach(c=>c!=null&&el.append(c.nodeType?c:document.createTextNode(c)));return el}
const svgRoot=bgc=>{const s=sv("svg",{viewBox:"0 0 1600 900",class:"scsvg",preserveAspectRatio:"xMidYMid meet"});
  s.append(sv("defs",{},
    sv("filter",{id:"rough"},sv("feTurbulence",{type:"fractalNoise",baseFrequency:"0.035",numOctaves:"3",seed:"4"}),sv("feDisplacementMap",{in:"SourceGraphic",scale:"6"})),
    sv("filter",{id:"glow"},sv("feGaussianBlur",{stdDeviation:"8",result:"b"}),sv("feMerge",{},sv("feMergeNode",{in:"b"}),sv("feMergeNode",{in:"SourceGraphic"}))),
    sv("radialGradient",{id:"paper",cx:"50%",cy:"45%",r:"75%"},sv("stop",{offset:"0","stop-color":"#f6ecd2"}),sv("stop",{offset:"1","stop-color":"#d9c49a"})),
    sv("pattern",{id:"tiles",width:"28",height:"16",patternUnits:"userSpaceOnUse"},sv("rect",{width:"28",height:"16",fill:"#5a2a1c"}),sv("path",{d:"M0 14 Q7 4 14 14 Q21 4 28 14",stroke:"#2b1610",fill:"none","stroke-width":"2.5"}),sv("path",{d:"M0 8 L28 8",stroke:"#8b4a2a","stroke-width":"1"})),
    sv("linearGradient",{id:"sky",x1:0,y1:0,x2:0,y2:1},sv("stop",{offset:"0","stop-color":"#c9d3cf"}),sv("stop",{offset:"1","stop-color":"#efe6cf"}))));
  s.append(sv("rect",{width:1600,height:900,fill:bgc||"url(#paper)"}));return s};

/* ---------- 战国七国（真实地形底图 + 诸国水彩图层） ---------- */
const MP=(lo,la)=>[800+(lo-111.5)*35.94,(43.5-la)*42.857];
const STATES={qin:{n:"秦",lamp:[106.8,33.4]},han:{n:"韩",lamp:[112.4,34.25]},wei:{n:"魏",lamp:[114.7,35.5]},zhao:{n:"赵",lamp:[113.3,38.6]},yan:{n:"燕",lamp:[118.6,40.5]},qi:{n:"齐",lamp:[119.3,36.6]},chu:{n:"楚",lamp:[115,30.2]}};
const ovRoot=()=>sv("svg",{viewBox:"0 0 1600 900",class:"scsvg ov",preserveAspectRatio:"xMidYMid meet"},sv("defs",{},
  sv("filter",{id:"glow"},sv("feGaussianBlur",{stdDeviation:"8",result:"b"}),sv("feMerge",{},sv("feMergeNode",{in:"b"}),sv("feMergeNode",{in:"SourceGraphic"}))),
  sv("pattern",{id:"tiles",width:"22",height:"13",patternUnits:"userSpaceOnUse"},sv("rect",{width:"22",height:"13",fill:"#4a2418"}),sv("path",{d:"M0 11 Q5.5 3 11 11 Q16.5 3 22 11",stroke:"#1f0f0a",fill:"none","stroke-width":"2"}),sv("path",{d:"M0 6.5 L22 6.5",stroke:"#7a3d24","stroke-width":".8"}))));
const lbl=(x,y,t,cls)=>sv("text",{x,y,class:cls},t);
function cartouche(x,y,t1,t2){return sv("g",{transform:`translate(${x} ${y})`},sv("rect",{x:0,y:0,width:300,height:78,rx:4,fill:"rgba(250,243,225,.9)",stroke:"#7a5a36","stroke-width":2}),sv("rect",{x:5,y:5,width:290,height:68,rx:2,fill:"none",stroke:"#b89a6a","stroke-width":1}),
  sv("text",{x:150,y:36,class:"cart1"},t1),sv("text",{x:150,y:62,class:"cart2"},t2))}
function sceneMap6(layer){layer.append(h("img",{class:"scimg",src:IMG.MAP6,alt:"战国形势图"}));const imgs={};
  for(const k of Object.keys(STATES)){const im=h("img",{class:"stimg"+(k!=="qin"&&S.fx.m6?" conq":""),src:IMG["MAP6_"+k],alt:""});imgs[k]=im;layer.append(im)}
  const s=ovRoot();const lab={};
  for(const[k,st]of Object.entries(STATES)){const[x,y]=MP(...st.lamp);lab[k]=lbl(x,y+(k==="qin"?0:48),st.n,"stl"+(k==="qin"?" qin":"")+(k!=="qin"&&S.fx.m6?" out":""));s.append(lab[k])}
  const city=(lo,la,t,dx=14,dy=8,big)=>{const[x,y]=MP(lo,la);s.append(sv("rect",{x:x-(big?8:6),y:y-(big?8:6),width:big?16:12,height:big?16:12,fill:big?"#b23a24":"#3a2a1a",stroke:"#fff8e8","stroke-width":2.5,transform:`rotate(45 ${x} ${y})`}),lbl(x+dx,y+dy,t,"city sm"))};
  city(108.75,34.38,"咸阳",16,-12,true);city(104.06,30.66,"蜀",14,8);
  [[107.3,40.6,"黄河"],[117.2,30.0,"长江"],[106.6,34.85,"渭水"],[125.5,31,"东海"]].forEach(([lo,la,t])=>{const[x,y]=MP(lo,la);s.append(lbl(x,y,t,t==="东海"?"mapsea":"rvl"))});
  s.append(compass(1530,700),cartouche(26,96,"战国形势图","约公元前 260 年"));layer.append(s);
  return {s,lab,imgs,conquer(k){imgs[k].classList.add("conq");lab[k].classList.add("out")},unconquer(k){imgs[k].classList.remove("conq");lab[k].classList.remove("out")}}}
function compass(x,y){return sv("g",{transform:`translate(${x},${y})`,class:"cmp"},sv("circle",{r:46,fill:"rgba(255,250,235,.85)",stroke:"#6b5233","stroke-width":2}),sv("circle",{r:39,fill:"none",stroke:"#b89a6a","stroke-width":1}),sv("path",{d:"M0 -38 L10 0 L0 38 L-10 0Z",fill:"#6b5233"}),sv("path",{d:"M0 -38 L10 0 L-10 0Z",fill:"#b23a24"}),sv("text",{y:-52,class:"cmpn"},"北"),sv("text",{y:70,class:"cmpn"},"南"),sv("text",{x:-64,y:7,class:"cmpn"},"西"),sv("text",{x:64,y:7,class:"cmpn"},"东"))}

/* ---------- 蜀山：在画里砍树（底图 + 逐块显现的“砍后”图） ---------- */
const SHU_CFG=()=>IMG.SHU0?{base:"SHU0",top:"S10",cam:{x:30,y:55,z:1.15,mz:1.25,mx:28},end:{x:50,y:50,z:1},r:16,
   spots:[[8,40],[20,36],[32,40],[44,44],[10,53],[24,50],[38,55],[52,57],[8,67],[22,66],[36,70],[52,71]]}
  :{base:"S10",top:"S10W",cam:{x:84,y:47,z:1.7},end:{x:50,y:50,z:1},r:6.5,
   spots:[[74,37],[80,35],[87,37],[94,40],[73,45],[79,43],[86,46],[93,49],[76,54],[82,53],[89,57],[96,59]]};
const TREES=SHU_CFG().spots;
function sceneShu(layer){const C=SHU_CFG();layer.append(h("img",{class:"scimg",src:IMG[C.base],alt:"蜀山"}));const tops=[];
  const reveal=(i,instant)=>{const[x,y]=C.spots[i];const d=h("div",{class:"shurev"+(instant?" on":""),style:`background-image:url(${IMG[C.top]});-webkit-mask-image:radial-gradient(circle at ${x}% ${y}%, #000 ${C.r*0.45}%, transparent ${C.r}%);mask-image:radial-gradient(circle at ${x}% ${y}%, #000 ${C.r*0.45}%, transparent ${C.r}%)`});layer.append(d);if(!instant)requestAnimationFrame(()=>requestAnimationFrame(()=>d.classList.add("on")));tops.push(d)};
  const full=h("div",{class:"shurev full"+(S.fx.chop?" on":""),style:`background-image:url(${IMG[C.top]})`});layer.append(full);
  return {C,reveal,finish(){full.classList.add("on")}}}
/* ---------- 关中（真实地形底图） ---------- */
const GP=(lo,la)=>[800+(lo-108.81)*929.9,(34.66-la)*1125];
const WEI_PX=[[-3612.5, -367.1], [-3608.7, -403.5], [-3597.6, -419.8], [-3573.1, -434.0], [-3557.3, -466.6], [-3527.3, -479.7], [-3503.9, -513.0], [-3455.2, -539.1], [-3344.7, -505.3], [-3265.1, -505.3], [-3204.3, -459.2], [-3111.7, -437.3], [-3033.1, -380.8], [-3017.2, -368.3], [-3002.9, -359.0], [-2990.0, -313.6], [-2989.3, -287.6], [-2994.9, -251.1], [-2969.5, -189.5], [-2943.4, -165.6], [-2923.7, -171.9], [-2885.7, -135.9], [-2802.2, -100.7], [-2713.8, -127.5], [-2700.8, -144.2], [-2680.8, -151.3], [-2580.0, -127.7], [-2560.9, -112.2], [-2426.8, -110.7], [-2323.2, -84.0], [-2286.3, -73.7], [-2268.8, -43.9], [-2242.5, -47.5], [-2229.5, -65.4], [-2159.4, -61.2], [-2108.9, -27.7], [-2052.3, 3.5], [-2034.9, 37.4], [-1967.9, 49.8], [-1946.4, 74.1], [-1933.4, 107.1], [-1856.7, 118.9], [-1824.9, 127.3], [-1802.6, 106.7], [-1787.1, 111.5], [-1748.3, 139.1], [-1730.4, 116.0], [-1681.3, 142.0], [-1648.2, 138.9], [-1617.1, 127.3], [-1561.1, 148.9], [-1490.7, 157.4], [-1370.7, 152.9], [-1349.9, 157.4], [-1327.6, 180.2], [-1302.2, 195.7], [-1258.9, 210.5], [-1235.5, 246.1], [-1216.4, 286.2], [-1184.2, 312.3], [-1060.7, 322.1], [-991.2, 299.9], [-968.7, 296.6], [-939.2, 304.0], [-912.1, 291.0], [-890.6, 290.4], [-825.3, 323.0], [-804.3, 325.5], [-783.3, 318.0], [-731.0, 341.7], [-585.9, 346.5], [-528.6, 365.5], [-460.2, 359.3], [-429.1, 379.4], [-368.7, 404.5], [-293.3, 407.1], [-237.1, 400.5], [-162.5, 422.1], [-129.0, 459.7], [48.4, 481.3], [151.1, 481.5], [194.6, 498.4], [228.8, 495.4], [248.9, 489.1], [272.5, 493.5], [303.8, 512.7], [463.7, 507.7], [494.9, 487.7], [526.2, 474.9], [615.7, 466.1], [635.3, 449.4], [727.4, 381.5], [762.4, 358.5], [830.1, 312.3], [935.7, 276.0], [1027.1, 234.2], [1066.4, 213.6], [1137.4, 256.5], [1163.7, 257.9], [1184.1, 251.3], [1201.9, 238.4], [1211.5, 216.4], [1217.4, 195.7], [1243.3, 180.4], [1235.9, 169.3], [1227.7, 157.9], [1260.9, 131.5], [1297.9, 130.8], [1332.2, 143.0], [1351.8, 118.9], [1380.5, 125.5], [1410.1, 106.6], [1440.7, 127.5], [1454.6, 136.5], [1505.2, 164.2], [1532.9, 163.9], [1563.9, 123.9], [1592.0, 86.8], [1651.4, 95.1], [1665.7, 91.7], [1668.5, 71.7], [1679.3, 51.3], [1699.6, 58.3], [1711.3, 50.3], [1735.2, 62.4], [1785.4, 65.1], [1829.9, 42.2], [1835.1, 27.8], [1845.7, 18.4], [1876.3, 16.3], [1884.6, -12.6], [1912.5, 26.1], [1973.3, 18.4], [2004.2, -7.5], [2022.4, -8.6], [2114.8, 44.7], [2179.5, 41.5]];
function weiY(x){const ys=[];for(let i=1;i<WEI_PX.length;i++){const[a,b]=[WEI_PX[i-1],WEI_PX[i]];if((x-a[0])*(x-b[0])<=0&&a[0]!==b[0])ys.push(a[1]+(x-a[0])/(b[0]-a[0])*(b[1]-a[1]))}return ys.length?ys.reduce((p,c)=>p+c,0)/ys.length:WEI_PX[x<WEI_PX[0][0]?0:WEI_PX.length-1][1]}
const GZ={xy:GP(108.71,34.40),ls:GP(109.21,34.36),afg:GP(108.83,34.25)};
function sceneGz(layer){layer.append(h("img",{class:"scimg",src:IMG.GZ,alt:"关中地形"}));const s=ovRoot();
  const sun=sv("g",{class:"sun",transform:"translate(1440 120)"},sv("circle",{r:54,fill:"#f2b33d",filter:"url(#glow)"}));s.append(sun);
  const roofs=sv("ellipse",{cx:GZ.afg[0],cy:GZ.afg[1],rx:0,ry:0,fill:"url(#tiles)",opacity:.92,class:"roofs"});s.append(roofs);
  const dim=sv("rect",{width:1600,height:900,fill:"#1a120a",opacity:0,class:"dim"});s.append(dim);
  const route=sv("path",{d:"",stroke:"#7a2416","stroke-width":20,fill:"none","stroke-linecap":"round","stroke-linejoin":"round","stroke-dasharray":"16 5",class:"route",opacity:.92});
  const route2=sv("path",{d:"",stroke:"#e8c06a","stroke-width":3.5,fill:"none","stroke-linejoin":"round"});s.append(route,route2);
  const[ax,ay]=GZ.afg;const wall=sv("rect",{x:ax-62,y:ay-40,width:124,height:80,fill:"rgba(122,36,22,.12)",stroke:"#7a2416","stroke-width":5,opacity:S.fx.cover?1:0,class:"wall"});s.append(wall);
  const flows=sv("g",{class:"flows"});s.append(flows);
  const[xx,xy]=GZ.xy;s.append(sv("rect",{x:xx-30,y:xy-22,width:60,height:40,fill:"#e8dcc0",stroke:"#3a2a1a","stroke-width":3}),sv("path",{d:`M${xx-30} ${xy-22} L${xx} ${xy-40} L${xx+30} ${xy-22}`,fill:"#3a2a1a"}),lbl(xx,xy-50,"咸阳","city"));
  const[lx,ly]=GZ.ls;s.append(lbl(lx,ly+60,"骊山","city"));
  const lab=(lo,la,t,c="rvl")=>{const[x,y]=GP(lo,la);s.append(lbl(x,y,t,c))};
  lab(108.25,34.25,"渭水");lab(108.86,34.585,"泾水");lab(109.03,34.06,"樊川");lab(108.55,33.93,"终 南 山","mtl");
  s.append(lbl(ax,ay+70,"阿房宫","city sm"),compass(1530,700),sv("g",{transform:"translate(1250 850)"},sv("path",{d:"M0 0 L253 0 M0 -8 L0 8 M253 -8 L253 8 M126 -5 L126 5",stroke:"#3a2a1a","stroke-width":3}),sv("text",{x:126,y:-14,class:"cmpn"},"25 公里")),
    cartouche(26,96,"关中","秦都咸阳一带"));
  layer.append(s);
  const api={s,roofs,dim,sun,route,route2,wall,flows,
    setCover(p){roofs.setAttribute("rx",30+p*760);roofs.setAttribute("ry",22+p*440);dim.setAttribute("opacity",(p*.45).toFixed(2));sun.style.opacity=String(1-p*.9)},
    routeD(stage){const[x0,y0]=GZ.ls;const yN=weiY(x0)+22;if(stage===0)return "";let d=`M${x0} ${y0-20} L${x0} ${yN.toFixed(0)}`;if(stage===1)return d;
      for(let x=x0-30;x>=GZ.xy[0];x-=30)d+=` L${x} ${(weiY(x)+22).toFixed(0)}`;return d+` L${GZ.xy[0]} ${GZ.xy[1]+20}`},
    setRoute(stage,anim){const d=api.routeD(stage);route.setAttribute("d",d);route2.setAttribute("d",d);if(anim&&d){const L=route2.getTotalLength();route2.style.transition="none";route2.style.strokeDasharray=L;route2.style.strokeDashoffset=L;route2.getBoundingClientRect();route2.style.transition="stroke-dashoffset 1.8s ease";route2.style.strokeDashoffset=0;route.style.transition="none";route.style.opacity=0;route.getBoundingClientRect();route.style.transition="opacity 1.8s";route.style.opacity=.92}}};
  if(S.fx.cover){api.setCover(1);roofs.setAttribute("opacity",.3);dim.setAttribute("opacity",.06)}
  api.setRoute(S.fx.route?2:0,false);if(S.fx.canal)["wei","fan"].forEach(k=>addFlow(api,k,false));
  return api}
function addFlow(api,k,anim){const[ax,ay]=GZ.afg;const d=k==="wei"?`M${ax+30} ${weiY(ax+30).toFixed(0)} Q${ax+46} ${ay-80} ${ax+18} ${ay-38}`:(()=>{const[fx,fy]=GP(108.9,34.19);return `M${fx} ${fy} Q${ax+30} ${ay+60} ${ax+8} ${ay+38}`})();
  const p=sv("path",{d,stroke:"#3f87b0","stroke-width":9,fill:"none","stroke-linecap":"round",class:"flow"+(anim?" anim":"")});api.flows.append(p);
  if(api.flows.querySelectorAll(".flow").length>=2&&!api.flows.querySelector(".pond"))api.flows.append(sv("ellipse",{cx:ax,cy:ay,rx:40,ry:20,fill:"#7fb6cf",class:"pond"}))}
const SCENE_SVG={map6:sceneMap6,shu:sceneShu,gz:sceneGz};
