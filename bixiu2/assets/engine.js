/* ============ 视觉小说式互动课引擎 v2（镜头、场景、动手互动） ============ */
const TV=!!window.TEACHER_VIEW;const PROJ=!!window.PROJ;const PTS=()=>LX.ptsName||"片瓦";const LX=Object.assign({buildScene:"S2",pal:"S2",palName:"宫殿",palLabel:"我的阿房宫",buildMsg:"阿房宫建起一处",seal:"建宫",passText:"第一课时过关！",endTitle:"第一课时完成",flash:"S8",endQ:"先生，这么好的宫殿……后来呢？",endA:"下一课，我们走进宫里，看看住在这里的人。",intro:"约 40 分钟，七幕。熄灭六国、砍树建宫、指挥宫殿走向、走进宫里、擦开云雾……每答对一处，阿房宫就亮起一处。正确率达到 80% 才能交作业。建议戴耳机。",fx0:{}},LESSON);const KEY="afg-"+LESSON.id+"-v2"+(TV?"-teacher":"")+(PROJ?"-proj":"");if(PROJ)document.body.classList.add("proj");
const $=s=>document.querySelector(s);
function h(tag,attrs={},...kids){const el=document.createElement(tag);for(const[k,v]of Object.entries(attrs||{})){if(k==="class")el.className=v;else if(k==="html")el.innerHTML=v;else if(k.startsWith("on"))el.addEventListener(k.slice(2),v);else if(v!==false&&v!=null)el.setAttribute(k,v===true?"":v)}for(const c of kids.flat()){if(c==null||c===false)continue;el.append(c.nodeType?c:document.createTextNode(c))}return el}
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const fmtMin=ms=>`${Math.round(ms/60000)} 分钟`;
function toast(t){const el=h("div",{class:"toast",role:"status"},t);document.body.append(el);setTimeout(()=>el.remove(),2400)}
function blank(){return {v:2,name:"",cls:"",start:0,last:0,pos:0,q:null,at:{},log:[],built:(LESSON.built0||[]).slice(),wr:{},rc:{},test:{round:0},pts:0,streak:0,best:0,tm:0,snd:true,bgm:true,done:0,subAt:0,fx:Object.assign({},LX.fx0),hot:{}}}
function loadS(){let s=blank();try{const r=localStorage.getItem(KEY);if(r)s=Object.assign(blank(),JSON.parse(r))}catch(e){}return s}
let S=loadS();
function getStu(){try{return JSON.parse(localStorage.getItem("afg-student")||"{}")}catch(e){return {}}}
function setStu(n,c){try{localStorage.setItem("afg-student",JSON.stringify({name:n,cls:c}))}catch(e){}}
if(!S.name&&!TV){const _s=getStu();if(_s.name){S.name=_s.name;S.cls=_s.cls||"";S.start=Date.now()}}
function save(){S.last=Date.now();try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
const auKey=t=>{let x=5381;for(const c of t)x=((x<<5)+x+c.codePointAt(0))>>>0;return "s"+x.toString(36)};

/* ---------- 在线时长 ---------- */
let lastAct=Date.now(),tickAt=Date.now();
["pointerdown","keydown","pointermove"].forEach(e=>addEventListener(e,()=>{lastAct=Date.now()},{passive:true}));
setInterval(()=>{const now=Date.now(),dt=now-tickAt;tickAt=now;if(document.visibilityState==="visible"&&now-lastAct<120000&&S.name&&dt<20000){S.tm+=dt;save()}},5000);
document.addEventListener("visibilitychange",()=>{tickAt=Date.now()});

/* ---------- 声音：音效、背景音乐 ---------- */
let AC=null,noiseBuf=null,bgmG=null,bgmTimer=null,bgmMode="day";
function ac(){if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();if(AC.state==="suspended")AC.resume();return AC}
function env(g,t,a,peak,dur){g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+dur)}
function noise(){const c=ac();if(noiseBuf)return noiseBuf;noiseBuf=c.createBuffer(1,c.sampleRate*2,c.sampleRate);const d=noiseBuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return noiseBuf}
function nz({f=800,q=1,type="bandpass",dur=.1,vol=.2,a=.004,dest}={}){if(!S.snd)return;try{const c=ac(),t=c.currentTime;const s=c.createBufferSource();s.buffer=noise();const fl=c.createBiquadFilter();fl.type=type;fl.frequency.value=f;fl.Q.value=q;const g=c.createGain();env(g,t,a,vol,dur);s.connect(fl).connect(g).connect(dest||c.destination);s.start(t,Math.random());s.stop(t+dur+.05)}catch(e){}}
function osc(f,{type="sine",vol=.1,a=.01,dur=.5,at=0,dest,bend}={}){try{const c=ac(),t=c.currentTime+at;const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(bend)o.frequency.exponentialRampToValueAtTime(bend,t+dur);env(g,t,a,vol,dur);o.connect(g).connect(dest||c.destination);o.start(t);o.stop(t+dur+.05)}catch(e){}}
function pluck(f,{vol=.1,dur=1.8,at=0,dest}={}){osc(f,{type:"triangle",vol,a:.004,dur,at,dest});osc(f*2,{vol:vol*.35,a:.004,dur:dur*.6,at,dest});osc(f*3,{vol:vol*.12,a:.004,dur:dur*.3,at,dest})}
const tone=(fs,o={})=>{if(!S.snd)return;fs.forEach((f,i)=>osc(f,{vol:o.vol||.1,dur:o.dur||.5,type:o.type||"sine",at:i*(o.gap||.09)}))};
const SFX={ok:()=>tone([784,1175],{gap:.08,dur:.45}),no:()=>tone([294,220],{gap:.11,dur:.3,type:"triangle",vol:.07}),
 build:()=>tone([392,523,659,784],{gap:.09,dur:.8,vol:.08}),combo:()=>tone([523,659,784,1047,1319],{gap:.07,dur:.6}),done:()=>tone([392,523,659,784,1047,1319],{gap:.11,dur:1.1,vol:.08}),
 axe:()=>{if(!S.snd)return;nz({f:1800,q:3,dur:.07,vol:.5});osc(140,{vol:.35,dur:.18,bend:60})},fall:()=>{if(!S.snd)return;nz({f:400,type:"lowpass",dur:.6,vol:.25,a:.2});osc(90,{vol:.3,dur:.4,at:.45,bend:40})},
 step:()=>{if(!S.snd)return;nz({f:260+Math.random()*80,type:"lowpass",dur:.14,vol:.35})},
 bell:()=>{if(!S.snd)return;[1,2.76,5.4].forEach((m,i)=>osc(660*m,{vol:.06/(i+1),a:.003,dur:2.2-i*.5}))},
 qin:()=>{if(!S.snd)return;const sc=[294,330,370,440,494,587];pluck(sc[Math.floor(Math.random()*sc.length)],{vol:.12})},
 blow:()=>{if(!S.snd)return;nz({f:600,type:"lowpass",dur:.5,vol:.25,a:.05});osc(220,{vol:.05,dur:.4,bend:110})},
 water:()=>{if(!S.snd)return;for(let i=0;i<6;i++)osc(500+Math.random()*700,{vol:.04,dur:.12,at:i*.07,bend:900+Math.random()*600})},
 whoosh:()=>{if(!S.snd)return;nz({f:900,q:.7,dur:.9,vol:.18,a:.35})},
 tick:()=>{if(!S.snd)return;osc(1400,{vol:.05,dur:.05})}};
const BGM_SCALE={night:[147,165,196,220,247,294,330,392],day:[196,220,247,294,330,392,440,494],palace:[220,247,277,330,370,440,494,554]};
function bgmStart(){if(!S.bgm||bgmTimer)return;try{const c=ac();bgmG=c.createGain();bgmG.gain.value=0;bgmG.connect(c.destination);bgmG.gain.linearRampToValueAtTime(.55,c.currentTime+3);
  const dl=c.createDelay();dl.delayTime.value=.42;const fb=c.createGain();fb.gain.value=.35;const lp=c.createBiquadFilter();lp.type="lowpass";lp.frequency.value=1800;dl.connect(fb).connect(lp).connect(dl);dl.connect(bgmG);bgmG._dl=dl;
  const pad=f=>{const o=c.createOscillator(),g=c.createGain();o.type="sine";o.frequency.value=f;g.gain.value=.012;o.connect(g).connect(bgmG);o.start();return o};bgmG._pads=[pad(73.4),pad(110)];
  const play=()=>{const sc=BGM_SCALE[bgmMode]||BGM_SCALE.day;const f=sc[Math.floor(Math.random()*sc.length)];const vol=.05;pluck(f,{vol,dur:2.6,dest:bgmG});pluck(f,{vol:vol*.5,dur:2.6,dest:dl});
    if(Math.random()<.35)pluck(sc[Math.floor(Math.random()*sc.length)],{vol:vol*.7,dur:2.4,at:.45,dest:bgmG});bgmTimer=setTimeout(play,1700+Math.random()*1900)};play()}catch(e){}}
function bgmStop(){clearTimeout(bgmTimer);bgmTimer=null;if(bgmG){try{bgmG.gain.linearRampToValueAtTime(0,AC.currentTime+.6);const g=bgmG;setTimeout(()=>{g._pads.forEach(o=>o.stop());g.disconnect()},800)}catch(e){}bgmG=null}}
function bgmDuck(on){if(bgmG&&AC)try{bgmG.gain.cancelScheduledValues(AC.currentTime);bgmG.gain.linearRampToValueAtTime(on?.22:.55,AC.currentTime+.4)}catch(e){}}
let lastPt={x:innerWidth/2,y:innerHeight/2};addEventListener("pointerdown",e=>{lastPt={x:e.clientX,y:e.clientY};if(S.name)bgmStart()},{passive:true});
function floatTxt(t,pt=lastPt){const f=h("div",{class:"gain",style:`left:${pt.x}px;top:${pt.y-14}px`},t);document.body.append(f);setTimeout(()=>f.remove(),1100)}
const COMBO={3:"渐入佳境",5:"势如破竹",8:"胸有成竹",12:"所向披靡",20:"一字千金"};
function reward(ok,first){if(ok){S.streak++;S.best=Math.max(S.best,S.streak);const g=first?10:5;S.pts+=g;SFX.ok();floatTxt(`+${g} 片瓦`);
  const c=COMBO[S.streak];if(c){SFX.combo();const el=h("div",{class:"combo"},h("small",{},`连对 ${S.streak} 题`),h("b",{},c));document.body.append(el);setTimeout(()=>el.remove(),1900)}}
  else{S.streak=0;SFX.no()}updHud()}

/* ---------- 语音 ---------- */
let curAu=null;
function stopAu(){if(curAu){curAu.onended=null;curAu.pause();curAu=null;bgmDuck(false)}}
function playAu(id,done){stopAu();const A=AUD[id];if(!A){done&&setTimeout(done,600);return null}const au=new Audio(A);curAu=au;bgmDuck(true);
  au.onended=()=>{if(curAu===au){curAu=null;bgmDuck(false);done&&done()}};au.play().catch(()=>{if(curAu===au){curAu=null;bgmDuck(false);done&&setTimeout(done,300)}});return au}
function playSeq(ids,onEach,done){let i=0,stopped=false;const next=()=>{if(stopped)return;if(i>=ids.length){done&&done();return}const au=playAu(ids[i],()=>{i++;setTimeout(next,350)});onEach&&onEach(i,au,ids[i])};next();return ()=>{stopped=true;stopAu()}}

/* ---------- 题目 ---------- */
const HY_V=["名词作动词","形容词作动词","数词作动词"],HY_M=["使动用法","意动用法"];
function hyClash(a,x){return (HY_V.includes(a)&&HY_M.includes(x))||(HY_M.includes(a)&&HY_V.includes(x))}
function variantsOf(a){const A=ATOMS[a];if(A.k==="f")return A.v.map((_,i)=>"f"+i);const v=["mean","judge"];if(A.py)v.push("py");if(A.ben)v.push("ben");if(A.hy)v.push("hy");if(A.gj)v.push("gj");if(A.fill)v.push("fill");return v}
function pickV(a,first){const vs=variantsOf(a);if(first)return vs[0];const st=S.at[a]||{};const pool=vs.filter(v=>!(st.used||[]).includes(v));const p2=(pool.length?pool:vs).filter(v=>v!==st.lv);const P=p2.length?p2:vs;return P[Math.floor(Math.random()*P.length)]}
function makeQ(a,vk){const A=ATOMS[a];if(A.k==="f"){const x=A.v[+vk.slice(1)]||A.v[0];return {q:x.q,o:x.o,e:x.e}}
  const at=A.s.indexOf(A.c);const head=`“${A.s.slice(0,at)}⟦${A.c}⟧${A.s.slice(at+A.c.length)}”中加粗的“${A.c}”`;
  const ex=`${A.c}：${A.m}。`+(A.hy?`【${A.hy}】`:"")+(A.gj?`今天的“${A.c}”多指“${A.gj}”，古今异义。`:"")+(A.py?`读 ${A.py[0]}。`:"");
  switch(vk){case "mean":return {q:`${head}，意思是`,o:[A.m,...A.d],e:ex};
   case "judge":{const sh=Math.random()<.5?A.m:A.d[0];return {q:`判断：${head}，意思是“${sh}”。`,o:sh===A.m?["正确","错误"]:["错误","正确"],e:ex,fixed:true}}
   case "py":return {q:`${head}，读音是`,o:A.py,e:ex};
   case "ben":return {q:`${head}是通假字，通`,o:[A.ben,...shuffle(TJ_ALL.filter(x=>x!==A.ben)).slice(0,2)],e:ex};
   case "hy":return {q:`${head}属于哪种词类活用？`,o:[A.hy,...(A.hyd||shuffle(HY_ALL.filter(x=>x!==A.hy&&!hyClash(A.hy,x))).slice(0,2))],e:ex};
   case "gj":return {q:`${head}在这里是“${A.m}”。今天我们说“${A.c}”，常指“${A.gj}”。这种现象叫`,o:["古今异义","通假字","词类活用"],e:ex};
   case "fill":return {t:"fill",q:`${head}意思是“${A.fill[0].replace("＿","（　）")}”，填出括号里的字。`,a:A.fill[1],e:ex}}}
const boldParts=t=>String(t).split(/(⟦[^⟧]*⟧)/).filter(Boolean).map(x=>x.startsWith("⟦")?h("b",{class:"kw"},x.slice(1,-1)):x);

/* ---------- 队列 ---------- */
function initQ(){S.q=BEATS.map((b,i)=>({b:i}));S.pos=0;save()}
const beatOf=it=>it.b!=null?BEATS[it.b]:it;
function atomStat(a){return S.at[a]||(S.at[a]={n:0,ok:0,wr:0,fix:0,used:[],lv:null})}
function logQ(o){S.log.push(Object.assign({t:Date.now()},o));save()}
function afterAsk(it,a,vk,ok,ms){const st=atomStat(a);const first=!st.n;st.n++;st.used=[...new Set([...(st.used||[]),vk])];st.lv=vk;if(ok){st.ok++;if(it.rep||it.test)st.fix++}else st.wr++;
  logQ({a,v:vk,ok,first,rep:!!it.rep,test:it.test||0,ms});reward(ok,first&&!it.rep&&!it.test);
  const bt=beatOf(it);const rv=it.reveal||bt.reveal;if(ok&&rv)buildRegion(rv);
  if(!ok&&!it.test){st.re=st.re||0;const gaps=it.rep?(st.re<3?[4]:[]):[3,7];gaps.forEach(d=>{st.re++;S.q.splice(Math.min(S.q.length,S.pos+1+d),0,{t:"ask",a,rep:1,reveal:rv||null})})}save()}
function accStat(){const q=S.log.filter(l=>l.a&&(l.ok===true||l.ok===false));const ok=q.filter(l=>l.ok).length;return {n:q.length,ok,pct:q.length?Math.round(ok/q.length*100):100}}

/* ---------- 镜头与场景层 ---------- */
const PHOTO={S1:1,S2:1,S3:1,S4:1,S5:1,S6:1,S7:1,S9:1,BX:1,S13:1,DM:1,S6L:1,S6R:1,S8:1,S10:1,S11:1,S12:1,shu:1,map6:0,gz:0};
let SC={key:null,el:null,inner:null,api:null,cam:{x:50,y:50,z:1},w:0,h:0};
function curScene(){if(!S.q)return BEATS[0];for(let i=Math.min(S.pos,S.q.length-1);i>=0;i--){const b=beatOf(S.q[i]);if(b.t==="scene")return b}return BEATS[0]}
function curCam(){for(let i=Math.min(S.pos,S.q.length-1);i>=0;i--){const it=S.q[i],b=beatOf(it);if(b.t==="scene")return b.cam||{x:50,y:50,z:1};const c=it.cam||b.cam;if(c)return c}return {x:50,y:50,z:1}}
const narrow=()=>innerWidth<760&&innerHeight>innerWidth;
function sceneSize(){const vw=innerWidth,vh=innerHeight;let w,h;if(narrow()){w=vw*1.9;h=w*9/16}else if(PHOTO[SC.key]){if(vw/vh>16/9){w=vw;h=vw*9/16}else{h=vh;w=vh*16/9}}else{if(vw/vh>16/9){h=vh;w=vh*16/9}else{w=vw;h=vw*9/16}}return {w,h}}
function focusY(){const vh=innerHeight;return innerWidth<760?Math.max(140,(96+vh-180)/2-20):(64+vh-190)/2}
function applyCam(c,dur=1.6){SC.cam=c;if(!SC.inner)return;const {w,h}=sceneSize();SC.w=w;SC.h=h;if(narrow()&&c.mz)c=Object.assign({},c,{z:c.mz,x:c.mx??c.x,y:c.my??c.y});const vw=innerWidth,vh=innerHeight;let z=c.z||1;if(narrow()&&z<1.1)z=vw/w;
  let tx=vw/2-c.x/100*w*z,ty=focusY()-c.y/100*h*z;
  if(PHOTO[SC.key]&&!narrow()){tx=Math.min(0,Math.max(vw-w*z,tx));ty=Math.min(0,Math.max(vh-h*z,ty))}else{if(w*z<=vw)tx=(vw-w*z)/2;else tx=Math.min(0,Math.max(vw-w*z,tx));if(h*z<=vh)ty=Math.max(innerWidth<760?92:40,Math.min(ty,Math.max((vh-h*z)/2,90)));else ty=Math.min(60,Math.max(vh-h*z-180,ty))}
  if(c.d&&dur)dur=c.d;Object.assign(SC.inner.style,{width:w+"px",height:h+"px",transition:dur?`transform ${dur}s cubic-bezier(.45,.05,.25,1)`:"none",transform:`translate(${tx}px,${ty}px) scale(${z})`});if(!dur)SC.inner.getBoundingClientRect()}
addEventListener("resize",()=>applyCam(SC.cam,0));
function buildSceneContent(key,inner){if(SCENE_SVG[key])return SCENE_SVG[key](inner);if(PHOTO[key]||(IMG[key]&&PHOTO[key]===undefined)){if(key===LX.buildScene)inner.append(palaceLayers("full"));else inner.append(h("img",{class:"scimg",src:IMG[key],alt:""}));return null}
  return SCENE_SVG[key](inner)}
function ensureScene(sc){if(SC.key===sc.bg&&SC.el)return false;const wrap=$("#scn");const el=h("div",{class:"scn-layer entering"});const inner=h("div",{class:"scn-inner"});el.append(inner);
  if(!PHOTO[sc.bg])el.style.background="#d9c7a0";else{const bd=h("img",{class:"scback",src:IMG[sc.bg]||IMG.S10,alt:""});el.prepend(bd)}wrap.append(el);const old=SC.el;SC={key:sc.bg,el,inner,api:null,cam:sc.cam||{x:50,y:50,z:1}};SC.api=buildSceneContent(sc.bg,inner);
  applyCam(SC.cam,0);requestAnimationFrame(()=>el.classList.remove("entering"));if(old){old.classList.add("leaving");setTimeout(()=>old.remove(),900)}
  if(sc.bgm&&sc.bgm!==bgmMode)bgmMode=sc.bgm;return true}
function caption(t){if(!t)return;const c=h("div",{class:"caption"},t);document.body.append(c);setTimeout(()=>c.remove(),3600)}
function hotDot(x,y,label,onclick,cls=""){const b=h("button",{class:"hotdot "+cls,style:`left:${x}%;top:${y}%`,onclick:e=>{e.stopPropagation();onclick(e)}},h("i"),label?h("span",{},label):null);SC.inner.append(b);return b}
function clearSceneUI(){SC.inner&&SC.inner.querySelectorAll(".hotdot,.scratch,.scn-ov,.findring,.findhint,.flipc").forEach(x=>x.remove());SC.el&&SC.el.classList.remove("spin","warm","cold");const tint=$("#tint");if(tint)tint.style.cssText=""}

/* ---------- 宫殿画卷 ---------- */
function maskFor(ids){const L=ids.map(id=>REGIONS[id]).filter(Boolean).map(r=>`radial-gradient(circle at ${r.x}% ${r.y}%, #000 ${r.r*0.6}%, transparent ${r.r}%)`);return L.length?L.join(","):"linear-gradient(transparent,transparent)"}
function palaceLayers(cls=""){const wrap=h("div",{class:"palace "+cls});const base=h("img",{class:"pl-base"+(LX.ruinBase?" ruin":""),src:IMG[LX.ruinBase?"S8":LX.pal],alt:""});const top=h("img",{class:"pl-top",src:IMG[LX.pal],alt:"阿房宫"});
  const m=maskFor(S.built);top.style.webkitMaskImage=m;top.style.maskImage=m;wrap.append(base,top);return wrap}
function buildRegion(id){if(S.built.includes(id))return;S.built.push(id);save();const R=REGIONS[id];setTimeout(()=>{SFX.build();
  document.querySelectorAll(".palace").forEach(p=>{const top=p.querySelector(".pl-top");const m=maskFor(S.built);top.style.webkitMaskImage=m;top.style.maskImage=m;
    const ring=h("div",{class:"ring",style:`left:${R.x}%;top:${R.y}%`});p.append(ring);setTimeout(()=>ring.remove(),2600)});
  const AC=window.IL_ALBUM&&IL_ALBUM[LESSON.id]&&IL_ALBUM[LESSON.id].c[id];const t=AC?h("div",{class:"buildtoast albtoast"},h("div",{class:"tart",style:`background-image:url(${IMG[AC.img]});background-size:${AC.z*100}% auto;background-position:${AC.pos}`}),h("div",{},h("small",{},LX.buildMsg),h("b",{},AC.ep),AC.nm)):h("div",{class:"buildtoast"},h("small",{},LX.buildMsg),R.label);document.body.append(t);setTimeout(()=>t.remove(),2400);
  const mini=$(".minipal");if(mini){mini.classList.add("pop");setTimeout(()=>mini.classList.remove("pop"),2600)}updHud()},350)}
function albCard(L,id,c,got){const k=h("div",{class:"ecard"+(got?"":" lock"),tabindex:"0"});
  const art=h("div",{class:"art",style:`background-image:url(${IMG[c.img]});background-size:${c.z*100}% auto;background-position:${c.pos}`});
  const front=h("div",{class:"ef"},art,h("div",{class:"lab"},h("div",{class:"ep"},c.ep),h("div",{class:"nm"},c.nm)));
  const back=h("div",{class:"eb"},h("div",{class:"ep"},c.ep+c.nm),h("p",{},c.note),h("p",{class:"q"},"“"+c.q+"”"),h("small",{},IL_ALBUM[L].t));
  if(!got){k.append(h("div",{class:"ecin"},h("div",{class:"ef"},h("div",{class:"qm"},"？"),h("div",{class:"lab"},h("div",{class:"ep"},"未收集"),h("div",{class:"nm"},"· · ·")))))}
  else{k.append(h("div",{class:"ecin"},front,back));k.addEventListener("click",ev=>{ev.stopPropagation();k.classList.toggle("flip");SFX.whoosh&&SFX.whoosh()})}
  return k}
function albGot(L){if(L===LESSON.id)return S.built;try{const s=JSON.parse(localStorage.getItem("afg-"+L+"-v2"+(TV?"-teacher":""))||"null");return (s&&s.built)||[]}catch(x){return []}}
function showPalace(msg){if(LX.album){if(!window.IL_ALBUM){return}
  const Ls=Object.keys(IL_ALBUM);let cur=IL_ALBUM[LESSON.id]?LESSON.id:Ls[0];const tot=Ls.reduce((a,L)=>a+albGot(L).length,0),all=Ls.reduce((a,L)=>a+Object.keys(IL_ALBUM[L].c).length,0);
  const grid=h("div",{class:"agrid2"});const tabs=h("div",{class:"atabs"});
  const draw=()=>{grid.innerHTML="";const g=albGot(cur);Object.entries(IL_ALBUM[cur].c).forEach(([id,c])=>grid.append(albCard(cur,id,c,g.includes(id))));
    tabs.querySelectorAll("button").forEach(b=>b.classList.toggle("on",b.dataset.l===cur))};
  Ls.forEach((L,i)=>tabs.append(h("button",{"data-l":L,onclick:ev=>{ev.stopPropagation();cur=L;draw()}},"第"+"一二三四"[i]+"课时 ",h("small",{},albGot(L).length+"/"+Object.keys(IL_ALBUM[L].c).length))));
  const box=h("div",{class:"alb",onclick:ev=>ev.stopPropagation()},h("button",{class:"aclose",onclick:()=>m.remove()},"×"),
    h("div",{class:"ahead"},h("div",{class:"meander"}),h("h2",{},"荷马的修饰语卡册"),h("p",{},`已收集 ${tot} / ${all} 张　·　点一张卡，翻到背面看它的来历`),h("div",{class:"meander"})),tabs,grid);
  const m=h("div",{class:"modal albm",onclick:()=>m.remove()},box);document.body.append(m);draw();return}const m=h("div",{class:"modal",onclick:()=>m.remove()},h("div",{class:"bigpal"},palaceLayers(),h("p",{},msg||`你已经建起 ${S.built.length} 处。点任意处关闭。`)));document.body.append(m)}

/* ---------- HUD 与骨架 ---------- */
function updHud(){const a=accStat();const acc=$("#acc");if(acc){acc.textContent=a.n?`正确率 ${a.pct}%`:"正确率 —";acc.classList.toggle("lo",a.n>=10&&a.pct<80)}
  const p=$("#pts");if(p)p.textContent=S.pts;const b=$("#bld");if(b)b.textContent=`${LX.palName} ${S.built.length}/${Object.keys(REGIONS).length}`}
function hud(){const pct=S.q?Math.round(S.pos/S.q.length*100):0;
  return h("header",{class:"hud"},h("div",{class:"brand"},h("span",{class:"seal"},LX.brandSeal||"阿"),h("span",{},LX.brand||"阿房宫赋",h("small",{},`　${LESSON.sub}`))),
    h("div",{class:"hprog"},h("span",{class:"chap"},curScene().chap||""),h("div",{class:"bar"},h("i",{style:`width:${pct}%`}))),
    h("div",{class:"htools"},window.HUB?h("button",{class:"chip btnc",title:"回到目录",onclick:()=>{stopAu();bgmStop();location.hash=window.HUBBACK||"";location.reload()}},"目录"):null,h("button",{class:"chip btnc",id:"bld",title:"看看"+LX.palLabel,onclick:()=>showPalace()},""),h("span",{class:"chip",id:"acc"},""),h("span",{class:"chip tile"},h("i",{class:"tileic"}),h("b",{id:"pts"},"0")),
      h("button",{class:"chip btnc",title:"背景音乐",onclick:e=>{S.bgm=!S.bgm;save();e.currentTarget.classList.toggle("off",!S.bgm);S.bgm?bgmStart():bgmStop()}},"乐"),
      h("button",{class:"chip btnc",title:"音效和朗读",onclick:e=>{S.snd=!S.snd;save();e.currentTarget.classList.toggle("off",!S.snd)}},"声"),
      S.name&&!TV?h("button",{class:"chip btnc strong",onclick:openSubmit},"交给老师"):null))}
const CAST=LESSON.cast||{du:{name:"杜牧",faces:{jj:"du_jj",gk:"du_gk"},role:"作者，今天当你的先生"},fan:{name:"小樊",faces:{kx:"fan_kx",yh:"fan_yh",jy:"fan_jy"},role:"你的同学，会提问，也会犯错"}};
const FACE={du:CAST.du.faces,fan:CAST.fan.faces};
const NAME={du:CAST.du.name,fan:CAST.fan.name};
const AV=w=>IMG[Object.values(FACE[w])[0]];
function frame(){const ui=$("#ui");ui.innerHTML="";ui.append(hud());const sc=curScene();
  if(!LX.album&&S.built.length&&sc.bg!==LX.buildScene&&S.pos>3){ui.append(h("button",{class:"minipal",title:"看看你建的阿房宫",onclick:()=>showPalace()},palaceLayers(),h("span",{},LX.palLabel)))}
  const stage=h("main",{class:"stage"});const dlg=h("section",{class:"dlg",role:"region","aria-label":"对话"});ui.append(stage,dlg);if(TV)ui.append(teacherBar());updHud();
  ui.querySelectorAll(".chip.btnc").forEach(b=>{if(b.textContent==="乐")b.classList.toggle("off",!S.bgm);if(b.textContent==="声")b.classList.toggle("off",!S.snd)});return {stage,dlg}}
function speaker(dlg,who,face,text,{next:nx,nextLabel="继续",noNext=false,extra=[],au=true}={}){dlg.innerHTML="";dlg.className="dlg "+who;
  const av=h("img",{class:"av",src:IMG[FACE[who][face]||Object.values(FACE[who])[0]],alt:NAME[who]});
  const tx=h("div",{class:"tx"},h("div",{class:"nm"},NAME[who]),h("p",{},...boldParts(text)));
  const k=auKey(text);const btns=h("div",{class:"dbtn"},...extra);if(au&&AUD[k])btns.prepend(h("button",{class:"ghost",title:"再听一遍",onclick:()=>playAu(k)},"↻ 再听"));
  if(!noNext&&nx)btns.append(h("button",{class:"go",onclick:nx},nextLabel+" ▸"));
  dlg.append(av,tx,btns);if(au&&AUD[k])setTimeout(()=>playAu(k),250)}
function task(stage,txt,sub){const t=h("div",{class:"task"},h("b",{},txt),sub?h("small",{},sub):null);stage.append(t);return t}
function next(){stopAu();S.pos++;save();render()}
function clsOn(){try{return localStorage.getItem("afg-class")==="1"}catch(x){return false}}
function stopAt(b){if(!b.chap)return null;const L=(window.STOPS||{})[LESSON.id]||[];const k=L.findIndex(s=>b.chap.startsWith(s.at));if(k<0)return null;if(!TV&&!clsOn())return null;S.cs=S.cs||{};if(S.cs[k])return null;if(TV&&!PROJ)S.cs[k]=1;return Object.assign({k},L[k])}
function vStop(st){clearSceneUI();const {stage,dlg}=frame();const n="①②③"[st.k];const pass=()=>{S.cs[st.k]=1;save();render()};
  const inp=h("input",{class:"pwin",maxlength:"4",placeholder:"口令",autocomplete:"off"});
  const go=()=>{if(inp.value.trim()===st.pw){SFX.ok();pass()}else{SFX.no();inp.classList.add("shake");setTimeout(()=>inp.classList.remove("shake"),400);toast("口令不对，等老师说")}};
  inp.addEventListener("keydown",x=>{if(x.key==="Enter")go()});
  stage.append(h("div",{class:"card stopcard"},h("div",{class:"eyebrow"},"课堂 · 停一停 "+n),h("h2",{},PROJ?"全班讨论":"请摘下耳机，看大屏幕"),h("p",{class:"muted"},"和全班一起想一想："),h("p",{class:"stopq"},st.q),
    PROJ?h("div",{class:"pwrow"},h("button",{class:"btn primary big",onclick:pass},"讨论完了，继续")):h("div",{class:"pwrow"},inp,h("button",{class:"btn primary",onclick:go},"继续")),PROJ?null:h("button",{class:"linkbtn",onclick:pass},"老师已允许，跳过")));
  speaker(dlg,"fan","kx",PROJ?"先停一停，大家一起说说看！":"先停一停！讨论完，老师会说口令。",{noNext:true,au:false})}

/* ---------- 渲染 ---------- */
let cardStart=Date.now(),gameStop=null;
function render(){stopAu();if(gameStop){gameStop();gameStop=null}
  if(!S.name){if(TV){S.name="教师预览";S.start=Date.now();save()}else return vWelcome()}if(!S.q)initQ();if(S.pos>=S.q.length)S.pos=S.q.length-1;
  let it=S.q[S.pos],b=beatOf(it);
  if(b.t==="scene"){const st=stopAt(b);if(st&&(!TV||PROJ))return vStop(st);if(st&&TV)setTimeout(()=>toast(`课堂停一停${"①②③"[st.k]}：口令「${st.pw}」`),900);}
  if(b.t==="scene"){const sc=b;S.pos++;save();ensureScene(sc);applyCam(sc.cam||{x:50,y:50,z:1},0);caption(sc.caption);return render()}
  const fresh=ensureScene(curScene());clearSceneUI();
  if(b.t==="test"&&!it.expanded)return expandTest(it);
  const c=it.cam||b.cam;if(c)applyCam(c);else if(fresh||!["ask","fix","read","write","pair","recite","test","testcheck","info","end"].includes(b.t))applyCam(curCam(),fresh?0:1.6);
  cardStart=Date.now();if(b.t==="testcheck")return vTestCheck(it);
  const {stage,dlg}=frame();
  const V={sort:vSort,say:vSay,read:vRead,ask:vAsk,fix:vAsk,pair:vPair,order:vOrder,write:vWrite,recite:vRecite,end:vEnd,info:vInfo,hot:vHot,punct:vPunct,map6:vMap6,chop:vChop,cover:vCover,route:vRoute,canal:vCanal,walk:vWalk,find:vFind,zoom:vZoom,scratch:vScratch,slider:vSlider,tour:vTour,cloze:vCloze,dictate:vDictate,fulltext:vFull,case:vCase,ifswitch:vIf,mirror:vMirror,take:vTake,spend:vSpend,balance:vBalance,anger:vAnger,fires:vFires,burn:vBurn,halfrelay:vHalfRelay,carts:vCarts,thunder:vThunder,wait:vWait,flip:vFlip};
  V[b.t](stage,dlg,b,it);setTimeout(()=>dlg.querySelector("button.go:not([disabled])")?.focus({preventScroll:true}),60)}
function vSay(stage,dlg,b){if(b.ov)addOv(b.ov);if(b.fx==="spin"){SC.el.classList.add("spin");stage.append(h("div",{class:"spincmp"},h("i"),h("span",{},"东？西？")));SFX.whoosh()}speaker(dlg,b.who,b.face,b.text,{next})}
function vInfo(stage,dlg,b){stage.append(h("div",{class:"card"},h("h2",{},b.title),...(b.paras||[]).map(p=>h("p",{},p))));speaker(dlg,"du","jj",b.say||"准备好了就继续。",{next,au:false})}
function rubyLine(l){const p=h("p");[...l].forEach((ch,k)=>{const need=RUBY[ch]&&(!RUBY_ONLY[ch]||l.slice(Math.max(0,k-1),k+2).includes(RUBY_ONLY[ch]));p.append(ch==="/"?h("span",{class:"k br"},h("br")):h("span",{class:"k"},need?h("ruby",{},ch,h("rt",{},RUBY[ch])):ch))});return p}
let karaRAF=0;
function kara(el,id,au){cancelAnimationFrame(karaRAF);document.querySelectorAll(".k.on").forEach(x=>x.classList.remove("on"));if(!el||!au)return;const ks=[...el.querySelectorAll(".k")];const T=(window.TIM||{})[id];
  const tick=()=>{if(curAu!==au&&!au.ended)return;const d=au.duration||0,ct=au.currentTime;ks.forEach((s,j)=>{const t=T&&T[j]!=null?T[j]:(d?d*0.92*j/ks.length:1e9);s.classList.toggle("on",au.ended||ct+0.06>=t)});if(!au.paused&&!au.ended)karaRAF=requestAnimationFrame(tick)};
  au.addEventListener("playing",tick);au.addEventListener("ended",()=>ks.forEach(s=>s.classList.add("on")));tick()}
function vRead(stage,dlg,b){const box=h("div",{class:"scroll"});const els=b.lines.map(i=>{const p=rubyLine(P1[i]);box.append(p);return p});
  const card=h("div",{class:"card read"+(b.lines.length<=2?" slim":"")},h("div",{class:"eyebrow"},"听原文"),box);stage.append(card);
  let stop=null;const go=h("button",{class:"go",onclick:()=>{stop&&stop();next()}},"继续 ▸");go.disabled=true;setTimeout(()=>{go.disabled=false},b.lines.length>2?6000:2500);
  const play=()=>{stop&&stop();stop=playSeq(b.lines.map(i=>"p"+i),(k,au,id)=>{els.forEach(e=>e.classList.remove("hl"));els[k].classList.add("hl");kara(els[k],id,au)},()=>{els.forEach(e=>e.classList.remove("hl"));go.disabled=false})};
  dlg.innerHTML="";dlg.className="dlg du";dlg.append(h("img",{class:"av",src:AV("du"),alt:NAME.du}),h("div",{class:"tx"},h("div",{class:"nm"},NAME.du),h("p",{},"先听我读，跟着在心里读。")),h("div",{class:"dbtn"},h("button",{class:"ghost",onclick:play},"↻ 重播"),go));setTimeout(play,300)}
function vAsk(stage,dlg,b,it){const a=it.a||b.a;const A=ATOMS[a];const st=atomStat(a);const isFix=b.t==="fix"&&!it.rep&&!it.test;
  const vk=isFix?"f0":(it.test||it.rep)?pickV(a,false):(b.v||pickV(a,!st.n));const Q=makeQ(a,vk);
  const card=h("div",{class:"card ask"+(it.test?" test":"")},h("div",{class:"eyebrow"},it.test?`过关检测 ${it.ti||""}`:it.rep?"换个问法，再来一次":isFix?NAME.fan+"说得对吗？":"想一想"));
  const lineIdx=A.s?P1.findIndex(l=>l.includes(A.s.slice(0,4))):-1;
  card.append(h("h2",{class:"q"},...boldParts(Q.q)));const fb=h("div",{class:"fb"});let done=false;
  const fin=(choice,ok)=>{if(done)return;done=true;afterAsk(it,a,vk,ok,Date.now()-cardStart);
    speaker(dlg,ok&&isFix?"fan":"du",ok?(isFix?"kx":"jj"):"gk",(ok?(isFix?"对哦，我说错了！":"答对了。")+" ":"再想想。")+Q.e,{next,au:false});
    if(!ok&&!it.test)fb.append(h("p",{class:"muted small"},"这个字词过几题会换个问法再来。"))};
  if(Q.t==="fill"){const inp=h("input",{class:"fillin",maxlength:3,"aria-label":"填字","data-a":window.__T?Q.a:null,placeholder:TV?"答案："+Q.a:null});const sb=h("button",{class:"btn",onclick:()=>{const v=inp.value.trim();if(!v)return;const ok=v===Q.a;inp.disabled=sb.disabled=true;inp.classList.add(ok?"right":"wrong");if(!ok)fb.append(h("p",{},`应填：${Q.a}`));fin(v,ok)}},"提交");
    inp.addEventListener("keydown",e=>{if(e.key==="Enter")sb.click()});card.append(h("div",{class:"row"},inp,sb),fb);stage.append(card);setTimeout(()=>inp.focus({preventScroll:true}),80)}
  else{const order=Q.fixed?Q.o.map((t,i)=>({t,i})):shuffle(Q.o.map((t,i)=>({t,i})));const ops=h("div",{class:"opts"+(Q.o.some(x=>x.length>12)?" long":"")});
    const right=o=>Q.fixed?((o.t==="正确")===(Q.o[0]==="正确")):o.i===0;
    order.forEach((o,j)=>ops.append(h("button",{class:"opt","data-k":j+1,"data-c":(window.__T||TV)&&right(o)?"1":null,onclick:()=>{if(done)return;[...ops.children].forEach((bt,k)=>{bt.disabled=true;if(right(order[k]))bt.classList.add("right")});if(!right(o))ops.children[j].classList.add("wrong");fin(o.t,right(o))}},h("b",{},"ABCD"[j]),o.t)));
    card.append(ops,fb);stage.append(card)}
  if(lineIdx>=0)card.insertBefore(h("button",{class:"ghost small listen",onclick:()=>playAu("p"+lineIdx)},"▶ 听这一句"),card.children[1]);
  if(isFix)speaker(dlg,"fan",/对吧/.test(A.claim)?"kx":"yh",A.claim,{noNext:true,au:false,extra:[]}),AUD["c_"+a]&&setTimeout(()=>playAu("c_"+a),250);
  else speaker(dlg,"du","jj",it.test?"不看书，凭你记住的来答。":it.rep?"刚才这个没记牢，换个问法。":"你来答。",{noNext:true,au:false})}

/* ---------- 互动：书房点一点 ---------- */
function vHot(stage,dlg,b,it){const done=S.hot[b.id]||(S.hot[b.id]=[]);const idx=S.q[S.pos].b!=null?S.q[S.pos].b:BEATS.indexOf(b);applyCam(it.cam||{x:50,y:50,z:1});
  task(stage,b.q,`已看 ${done.length} / ${b.spots.length}`);
  b.spots.forEach((sp,i)=>{const d=hotDot(sp.x,sp.y,sp.label,()=>{if(done.includes(i))return;done.push(i);SFX.bell();
    const subs=sp.sub.map((x,k)=>k===0?Object.assign({},x,{cam:sp.cam}):x);S.q.splice(S.pos+1,0,...subs,{b:idx,cam:{x:50,y:50,z:1}});next()},done.includes(i)?"done":"");if(done.includes(i))d.disabled=true});
  if(done.length>=b.spots.length)speaker(dlg,"fan","kx","都看完了！",{next,au:false});else speaker(dlg,"du","jj",done.length?"还有发光的地方，接着看。":"点一点发光的地方。",{noNext:true,au:false})}

/* ---------- 互动：断句 ---------- */
function vPunct(stage,dlg,b){const chars=[...b.text];const cuts=new Set();let solved=!!S.fx[b.id];
  const row=h("div",{class:"punct"});const draw=()=>{row.innerHTML="";chars.forEach((ch,i)=>{row.append(h("span",{class:"pch"},ch));if(i<chars.length-1){const k=i+1;row.append(h("button",{class:"pgap"+(cuts.has(k)?" on":""),"data-k":k,"aria-label":"在这里停顿",onclick:()=>{if(solved)return;cuts.has(k)?cuts.delete(k):cuts.add(k);SFX.tick();draw()}},cuts.has(k)?"｜":""))}})};
  const card=h("div",{class:"card"},h("div",{class:"eyebrow"},"断句"),h("h2",{class:"q"},"在该停顿的地方点一下，放上“｜”。"),row);stage.append(card);draw();
  const check=()=>{const ok=b.cuts.length===cuts.size&&b.cuts.every(k=>cuts.has(k));if(!ok){SFX.no();row.classList.add("shake");setTimeout(()=>row.classList.remove("shake"),400);
      speaker(dlg,"fan","yh",cuts.size<3?"好像停得太少了？赋常常几个字一顿，节奏很整齐。":"停的位置不太对。试试每三个字停一下？",{noNext:true,au:false,extra:[h("button",{class:"go",onclick:check},"检查 ▸")]});return}
    solved=true;S.fx[b.id]=1;save();reward(true,true);logQ({k:b.id,type:"punct",ok:true});draw();
    const spans=[...row.querySelectorAll(".pch")];let k=0;playAu("p0");const grp=[0,3,6,9,12];const tm=setInterval(()=>{spans.forEach(s=>s.classList.remove("hl"));if(k>=4){clearInterval(tm);return}for(let i=grp[k];i<grp[k+1];i++)spans[i].classList.add("hl");k++},700);
    speaker(dlg,"du","jj","三字一顿：六王毕｜四海一｜蜀山兀｜阿房出。短促有力，像鼓点一样。",{next,au:false})};
  if(solved){cuts.clear();b.cuts.forEach(k=>cuts.add(k));draw();speaker(dlg,"du","jj","三字一顿，短促有力。",{next,au:false})}
  else speaker(dlg,"du","jj","点字和字之间的空隙，放好了点“检查”。",{noNext:true,au:false,extra:[h("button",{class:"go",onclick:check},"检查 ▸")]})}

/* ---------- 互动：熄灭六国 ---------- */
function vMap6(stage,dlg,b){const api=SC.api;const left=Object.keys(STATES).filter(k=>k!=="qin");let n=S.fx.m6?6:0;
  task(stage,"点亮着的灯，熄灭六国",n?"":"齐、楚、燕、韩、赵、魏");
  const fin=()=>{S.fx.m6=1;save();caption("四海一");SFX.done();speaker(dlg,"du","gk","六国的灯都灭了。四海之内，只剩一个秦。",{next,au:false})};
  if(S.fx.m6)return fin();
  left.forEach(k=>{const[x,y]=MP(...STATES[k].lamp);const d=hotDot(x/16,y/9,"",()=>{d.remove();SFX.blow();api.conquer(k);n++;floatTxt(STATES[k].n+" 亡");if(n===6)setTimeout(fin,900)},"lamp");});
  speaker(dlg,"du","jj","齐、楚、燕、韩、赵、魏——六王毕。",{noNext:true,au:false})}

/* ---------- 互动：砍树 ---------- */
function vChop(stage,dlg,b){const api=SC.api,C=api.C;let n=0;applyCam(C.cam,1.4);const t0=task(stage,"点画里发光的树，把它砍下来",`0 / ${C.spots.length}`);
  const fin=()=>{S.fx.chop=1;save();api.finish();setTimeout(()=>{applyCam(C.end,4)},600);SFX.done();
    speaker(dlg,"fan","jy",IMG.SHU0?"山……光秃秃的了。":"退后看看……整片山都被砍光了！",{next,au:false})};
  if(S.fx.chop)return fin();
  C.spots.forEach(([x,y],i)=>{const d=hotDot(x,y,"",()=>{d.remove();SFX.axe();setTimeout(SFX.axe,260);setTimeout(SFX.fall,520);
      for(let k=0;k<7;k++){const c=h("i",{class:"chip-w",style:`left:${x}%;top:${y}%;--dx:${(Math.random()*2-1)*60}px;--dy:${-20-Math.random()*50}px`});SC.inner.append(c);setTimeout(()=>c.remove(),900)}
      setTimeout(()=>api.reveal(i),450);n++;t0.querySelector("small").textContent=`${n} / ${C.spots.length}`;if(n>=C.spots.length)setTimeout(fin,1500)},"axe")});
  speaker(dlg,"du","gk","这是蜀地的山。造宫殿要木头。你来砍——一棵，一棵。",{noNext:true,au:false})}

/* ---------- 互动：覆压三百余里 ---------- */
function vCover(stage,dlg,b){const api=SC.api;let p=S.fx.cover?1:0,holding=false,raf=0;
  const t0=task(stage,"按住下面的按钮，把屋顶铺开","");
  const fin=()=>{S.fx.cover=1;save();cancelAnimationFrame(raf);caption("覆压三百余里，隔离天日");api.wall.style.opacity=1;setTimeout(()=>{api.roofs.style.transition="opacity 2s";api.roofs.setAttribute("opacity",.28);api.dim.style.transition="opacity 2s";api.dim.setAttribute("opacity",.08)},2600);
    speaker(dlg,"fan","jy","太阳都被屋顶遮住了！",{next,au:false})};
  if(S.fx.cover){api.setCover(1);return fin()}
  const btn=h("button",{class:"go holdbtn"},"按住 · 铺屋顶");const bar=h("i");const meter=h("div",{class:"hold"},bar);
  const loop=()=>{if(holding){p=Math.min(1,p+.006);api.setCover(p);bar.style.width=(p*100)+"%";if(Math.random()<.15)nz({f:2200,q:4,dur:.04,vol:.08});if(p>=1){holding=false;return fin()}}raf=requestAnimationFrame(loop)};raf=requestAnimationFrame(loop);
  const on=e=>{e.preventDefault();holding=true},off=()=>{holding=false};btn.addEventListener("pointerdown",on);["pointerup","pointerleave","pointercancel"].forEach(ev=>btn.addEventListener(ev,off));
  btn.addEventListener("keydown",e=>{if(e.key===" "||e.key==="Enter"){e.preventDefault();holding=true}});btn.addEventListener("keyup",off);
  gameStop=()=>cancelAnimationFrame(raf);
  speaker(dlg,"du","jj","从阿房宫开始，屋顶一片一片铺出去——三百多里。",{noNext:true,au:false,extra:[meter,btn]})}

/* ---------- 互动：北构西折 ---------- */
function vRoute(stage,dlg,b){const api=SC.api;let stage_=S.fx.route?2:0;const say=(t,face="jj",who="du")=>speaker(dlg,who,face,t,{noNext:true,au:false,extra:[pad]});
  const fin=()=>{S.fx.route=1;save();caption("骊山北构而西折，直走咸阳");SFX.done();speaker(dlg,"du","jj","从骊山向北建，再向西转，一直通到咸阳。",{next,au:false})};
  const go=dir=>{if(stage_===0&&dir==="北"){stage_=1;api.setRoute(1,true);SFX.build();say("好！宫殿向北建到渭水边了。然后呢？“而西折”……")}
    else if(stage_===1&&dir==="西"){stage_=2;api.setRoute(2,true);SFX.build();setTimeout(fin,1900)}
    else{SFX.no();const msg={南:"往南是骊山，撞山了！",东:"往东就出了关中啦。",北:"再往北就掉进渭水了！",西:"先别急，原文先说的是“北构”。"}[dir];say(msg+" 再听听原文：骊山北构而西折。","jy","fan")}};
  const pad=h("div",{class:"dpad"},...["北","西","东","南"].map(d=>h("button",{class:"dp dp-"+{北:"n",西:"w",东:"e",南:"s"}[d],onclick:()=>go(d)},d)));
  task(stage,"你是总设计师：照原文，宫殿从骊山往哪个方向建？","");applyCam({x:62,y:40,z:1.15});
  if(S.fx.route)return fin();say("宫殿从骊山脚下开始建。按方向键指挥它。")}

/* ---------- 互动：二川流入宫墙 ---------- */
function vCanal(stage,dlg,b){const api=SC.api;const got=new Set();
  const fin=()=>{S.fx.canal=1;save();caption("二川溶溶，流入宫墙");speaker(dlg,"fan","kx","哇，两条河都流进宫里了！",{next,au:false})};
  if(S.fx.canal)return fin();task(stage,"点渭水和樊川，把它们引进宫墙","");
  const spots={wei:[GZ.afg[0]+40,weiY(GZ.afg[0]+40)],fan:GP(108.93,34.12)};
  Object.entries(spots).forEach(([k,[x,y]])=>{const d=hotDot(x/16,y/9,k==="wei"?"渭水":"樊川",()=>{d.remove();got.add(k);SFX.water();addFlow(api,k,true);if(got.size===2)setTimeout(fin,1200)},"water")});
  speaker(dlg,"du","jj","两条河，渭水和樊川。把它们引进宫墙里。",{noNext:true,au:false})}

/* ---------- 互动：五步一楼 ---------- */
function vWalk(stage,dlg,b){let n=0;const N=b.steps;const tags=h("div",{class:"walktags"});const t0=task(stage,"点“向前走”，数一数走过了几座楼、几座阁",`0 / ${N} 步`);t0.append(tags);
  const at=k=>({x:b.from.x+(b.to.x-b.from.x)*k/N,y:b.from.y+(b.to.y-b.from.y)*k/N,z:b.from.z});applyCam(at(0),1);
  const fin=()=>{S.fx[b.id]=1;save();speaker(dlg,"fan","jy","才走二十步，就过了四座楼、两座阁！",{next,au:false})};
  const step=()=>{if(n>=N)return;n++;SFX.step();applyCam(at(n),.55);t0.querySelector("small").textContent=`${n} / ${N} 步`;
    if(n%5===0){const w=n%10===0?"阁":"楼";SFX.bell();tags.append(h("span",{class:"wt"},w));const pop=h("div",{class:"walkpop"},w);document.body.append(pop);setTimeout(()=>pop.remove(),1400)}
    if(n>=N){wb.disabled=true;setTimeout(fin,900)}};
  const wb=h("button",{class:"go",onclick:step},"向前走 ▸");
  speaker(dlg,"fan","kx","一步，两步……每五步数一下！",{noNext:true,au:false,extra:[wb]})}

/* ---------- 互动：画中找一找 ---------- */
function vFind(stage,dlg,b){let miss=0;if(b.ov)addOv(b.ov);applyCam(b.cam);task(stage,b.q,"直接在画面上点");
  const targets=[{x:b.x,y:b.y,r:b.r},...(b.alt||[])];
  const onClick=e=>{if(e.target.closest(".hotdot"))return;const r=SC.inner.getBoundingClientRect();const px=(e.clientX-r.left)/r.width*100,py=(e.clientY-r.top)/r.height*100;
    const hit=targets.find(t=>Math.hypot(px-t.x,(py-t.y)*9/16)<=t.r);
    if(hit){SC.inner.removeEventListener("click",onClick);SFX.ok();const ring=h("div",{class:"findring",style:`left:${hit.x}%;top:${hit.y}%`});SC.inner.append(ring);
      applyCam({x:hit.x,y:hit.y,z:(b.cam.z||1.5)*1.4},1.2);logQ({k:b.id,type:"find",ok:true,miss});S.pts+=miss?3:6;floatTxt(miss?"+3 "+PTS():"+6 "+PTS());updHud();
      speaker(dlg,"du","jj","找到了，就是这里。",{next,au:false})}
    else{miss++;SFX.no();const m=h("div",{class:"findmiss",style:`left:${px}%;top:${py}%`});SC.inner.append(m);setTimeout(()=>m.remove(),700);
      if(miss>=2){const g=h("div",{class:"findhint",style:`left:${b.x}%;top:${b.y}%`});SC.inner.append(g);speaker(dlg,"fan","yh","看看发光的那一圈附近？",{noNext:true,au:false})}}};
  SC.inner.addEventListener("click",onClick);gameStop=()=>SC.inner.removeEventListener("click",onClick);
  speaker(dlg,"du","jj",b.q.replace(/（.*）/,"")+"。在画上点出来。",{noNext:true,au:false})}

/* ---------- 互动：拉远 ---------- */
function vZoom(stage,dlg,b){const btn=h("button",{class:"go",onclick:()=>{btn.remove();SFX.whoosh();applyCam(b.cam,2.4);setTimeout(()=>{const ov=h("div",{class:"scn-ov hex"});SC.inner.append(ov);
    speaker(dlg,"du","jj",b.text,{next})},2300)}},b.label+" ▸");
  speaker(dlg,"fan","kx","站高一点，才看得清全貌！",{noNext:true,au:false,extra:[btn]})}

/* ---------- 互动：擦云雾 ---------- */
function vScratch(stage,dlg,b){applyCam(b.cam);const cv=h("canvas",{class:"scratch",style:`left:${b.x}%;top:${b.y}%;width:${b.w}%;height:${b.h}%`});SC.inner.append(cv);
  const W=320,H=Math.round(320*b.h/b.w*9/16);cv.width=W;cv.height=H;const ctx=cv.getContext("2d");
  const fog=()=>{const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgba(235,238,236,.97)");g.addColorStop(1,"rgba(215,222,220,.97)");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    for(let i=0;i<60;i++){ctx.fillStyle=`rgba(255,255,255,${Math.random()*.35})`;ctx.beginPath();ctx.ellipse(Math.random()*W,Math.random()*H,20+Math.random()*60,8+Math.random()*20,0,0,7);ctx.fill()}
    ctx.fillStyle="rgba(90,100,100,.35)";ctx.beginPath();if(b.id==="sc_long"){ctx.moveTo(W*.05,H*.6);ctx.bezierCurveTo(W*.3,H*.2,W*.5,H*.75,W*.75,H*.45);ctx.lineTo(W*.95,H*.55);ctx.lineTo(W*.95,H*.62);ctx.bezierCurveTo(W*.5,H*.85,W*.3,H*.35,W*.05,H*.72)}else{ctx.moveTo(W*.1,H*.75);ctx.quadraticCurveTo(W*.5,H*.05,W*.92,H*.6);ctx.lineTo(W*.92,H*.7);ctx.quadraticCurveTo(W*.5,H*.2,W*.1,H*.85)}ctx.fill()};
  if(S.fx[b.id]){cv.remove();speaker(dlg,"du","jj",b.done,{next});return}
  fog();let can=false,draw=false;
  const scr=e=>{if(!can||!draw)return;const r=cv.getBoundingClientRect();const x=(e.clientX-r.left)/r.width*W,y=(e.clientY-r.top)/r.height*H;ctx.globalCompositeOperation="destination-out";const g=ctx.createRadialGradient(x,y,0,x,y,26);g.addColorStop(0,"rgba(0,0,0,1)");g.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,26,0,7);ctx.fill();ctx.globalCompositeOperation="source-over"};
  cv.addEventListener("pointerdown",e=>{draw=true;cv.setPointerCapture(e.pointerId);scr(e)});cv.addEventListener("pointermove",scr);cv.addEventListener("pointerup",()=>{draw=false});
  const chk=setInterval(()=>{if(!can)return;const d=ctx.getImageData(0,0,W,H).data;let c=0,t=0;for(let i=3;i<d.length;i+=32){t++;if(d[i]<60)c++}if(c/t>.42){clearInterval(chk);can=false;cv.classList.add("gone");S.fx[b.id]=1;save();SFX.bell();setTimeout(()=>{cv.remove();speaker(dlg,"du","jj",b.done,{next})},1000)}},300);
  gameStop=()=>clearInterval(chk);
  const card=h("div",{class:"card slim guess"},h("div",{class:"eyebrow"},"先猜一猜"),h("h2",{class:"q"},b.guess.q),h("div",{class:"opts"},...b.guess.o.map((o,i)=>h("button",{class:"opt",onclick:()=>{logQ({k:b.id,type:"guess",ok:null,g:i});card.remove();can=true;
    task(stage,"用手指或鼠标在雾上擦一擦","擦开一半，雾就会散");speaker(dlg,"fan","kx",i===0?"我也这么猜！擦开看看。":"真的吗？擦开看看！",{noNext:true,au:false})}},h("b",{},"ABC"[i]),o))));
  stage.append(card);speaker(dlg,b.say.who,b.say.face,b.say.text,{noNext:true})}

/* ---------- 互动：冷暖滑块 ---------- */
let windSrc=null,windG=null;
function windOn(){try{const c=ac();windSrc=c.createBufferSource();windSrc.buffer=noise();windSrc.loop=true;const f=c.createBiquadFilter();f.type="bandpass";f.frequency.value=500;f.Q.value=.6;windG=c.createGain();windG.gain.value=0;windSrc.connect(f).connect(windG).connect(c.destination);windSrc.start()}catch(e){}}
function windOff(){try{windSrc&&windSrc.stop()}catch(e){}windSrc=null;windG=null}
function vSlider(stage,dlg,b){let warm=false,cold=false,lastQin=0;const tint=$("#tint");const word=h("div",{class:"slword"});stage.append(word);
  const rng=h("input",{type:"range",min:0,max:100,value:50,class:"slider","aria-label":"冷暖"});
  const box=h("div",{class:"slbox"},h("span",{class:"slw"},"歌台 · 暖"),rng,h("span",{class:"slc"},"舞殿 · 冷"));
  if(S.snd)windOn();const rain=h("div",{class:"rain"});stage.append(rain);
  const upd=()=>{const v=+rng.value;const d=(v-50)/50;applyCam({x:50+d*3,y:50,z:1.9},.4);
    if(d<0){tint.style.cssText=`background:rgba(255,140,50,${(-d*.32).toFixed(2)});`;word.textContent=d<-.4?"春光融融":"";word.className="slword warm";rain.style.opacity=0;if(Date.now()-lastQin>260&&d<-.2){SFX.qin();lastQin=Date.now()}}
    else{tint.style.cssText=`background:rgba(50,110,220,${(d*.34).toFixed(2)});`;word.textContent=d>.4?"风雨凄凄":"";word.className="slword cold";rain.style.opacity=Math.max(0,d-.3)}
    if(windG&&AC)windG.gain.value=Math.max(0,d)*.18;
    if(v<=10)warm=true;if(v>=90)cold=true;if(warm&&cold&&!S.fx.sl){S.fx.sl=1;save();speaker(dlg,"du","jj","同一座宫里，一边暖得像春天，一边冷得像风雨。",{next,au:false,extra:[box]})}};
  rng.addEventListener("input",upd);gameStop=()=>{windOff();tint.style.cssText=""};
  if(S.fx.sl)speaker(dlg,"du","jj","往左是歌台，往右是舞殿。",{next,au:false,extra:[box]});
  else speaker(dlg,"fan","kx","往左拖到底，再往右拖到底，感受一下！",{noNext:true,au:false,extra:[box]})}

/* ---------- 配对、排序、写 ---------- */
function vSort(stage,dlg,b){const items=shuffle(b.items.map((x,i)=>Object.assign({i},x)));let sel=null,miss=0,got=0;
  const card=h("div",{class:"card sortc"},h("div",{class:"eyebrow"},b.eyebrow||"分一分"),h("h2",{class:"q"},b.q));
  const pool=h("div",{class:"spool"});const bins=b.bins.map((t,k)=>{const lst=h("div",{class:"blist"});const bx=h("button",{class:"sbin",onclick:()=>{
      if(!sel){toast("先点一张卡片");return}const it=sel.it,bt=sel.bt;
      if(it.b===k){const dn=h("span",{class:"scard done"},...[...bt.childNodes].map(n=>n.cloneNode(true)));bt.remove();lst.append(dn);got++;SFX.ok();sel=null;
        if(got===items.length){const ok=miss<=1;logQ({k:b.id,type:"sort",ok,miss});reward(ok,true);speaker(dlg,"du",ok?"jj":"gk",(ok?(miss?"分对了，只错了 1 次。":"全分对了！"):`分完了，错了 ${miss} 次。`)+b.ex,{next,au:false})}}
      else{miss++;SFX.no();bt.classList.add("shake");setTimeout(()=>bt.classList.remove("shake"),400);if(it.h)toast(it.h)}}},h("b",{},t),lst);return bx});
  items.forEach(it=>{const bt=h("button",{class:"scard"+(it.img?" wimg":""),"data-c":TV?String(it.b):null},it.img&&IMG[it.img]?h("img",{src:IMG[it.img],alt:""}):null,h("span",{},it.t));
    bt.addEventListener("click",e=>{e.stopPropagation();if(bt.classList.contains("done"))return;pool.querySelectorAll(".scard").forEach(x=>x.classList.remove("sel"));bt.classList.add("sel");sel={it,bt}});pool.append(bt)});
  card.append(pool,h("div",{class:"sbins n"+b.bins.length},...bins));stage.append(card);
  speaker(dlg,"fan","kx",b.tip||"先点一张卡片，再点它该去的那一栏。",{noNext:true,au:false})}
function vPair(stage,dlg,b){const L=shuffle(b.pairs.map((p,i)=>({t:p[0],i}))),R=shuffle(b.pairs.map((p,i)=>({t:p[1],i})));let sel=null,miss=0,got=0;
  const card=h("div",{class:"card pair"},h("div",{class:"eyebrow"},"配一配"),h("h2",{class:"q"},b.q));const cl=h("div",{class:"pcol"}),cr=h("div",{class:"pcol"});
  const mk=(o,side)=>h("button",{class:"pitem","data-i":o.i,onclick:e=>{const bt=e.currentTarget;if(bt.classList.contains("done"))return;
    if(side==="L"){cl.querySelectorAll(".pitem").forEach(x=>x.classList.remove("sel"));bt.classList.add("sel");sel={o,bt};return}
    if(!sel){toast("先点左边");return}
    if(sel.o.i===o.i){sel.bt.classList.add("done");bt.classList.add("done");sel.bt.classList.remove("sel");got++;SFX.ok();floatTxt("✓");sel=null;
      if(got===b.pairs.length){const ok=miss<=1;logQ({k:b.id,type:"pair",ok,miss});reward(ok,true);speaker(dlg,"fan","kx",ok?`全连对了！${miss?"只错了 1 次。":"一次都没错！"}${b.doneText||"这些比喻把宫殿写活了。"}`:`连完了，错了 ${miss} 次。再读读那几句原文。`,{next,au:false})}}
    else{miss++;bt.classList.add("shake");SFX.no();setTimeout(()=>bt.classList.remove("shake"),400)}}},o.t);
  L.forEach(o=>cl.append(mk(o,"L")));R.forEach(o=>cr.append(mk(o,"R")));card.append(h("div",{class:"pgrid"},cl,cr));stage.append(card);
  speaker(dlg,"fan","kx","先点左边一个，再点右边和它配对的！",{noNext:true,au:false})}
function vOrder(stage,dlg,b){const pool=shuffle(b.items);const seq=[];let done=false;const top=h("ol",{class:"seq"}),bot=h("div",{class:"opts long"});
  const card=h("div",{class:"card slim"},h("div",{class:"eyebrow"},"排一排"),h("h2",{class:"q"},b.q),top,bot);
  const sb=h("button",{class:"btn primary",disabled:true,onclick:()=>{done=true;sb.disabled=true;const ok=seq.every((t,i)=>t===b.items[i]);[...top.children].forEach((li,i)=>li.classList.add(seq[i]===b.items[i]?"right":"wrong"));
    logQ({k:b.id,type:"order",ok});reward(ok,true);applyCam({x:50,y:50,z:1},2);speaker(dlg,"du",ok?"jj":"gk",(ok?"顺序对了。":"顺序不对。")+b.ex,{next,au:false})}},"提交");
  const draw=()=>{top.innerHTML="";seq.forEach(t=>top.append(h("li",{},t)));bot.innerHTML="";pool.filter(t=>!seq.includes(t)).forEach(t=>bot.append(h("button",{class:"opt",onclick:()=>{if(done)return;seq.push(t);const i=b.items.indexOf(t);if(b.cams&&i===seq.length-1){applyCam(b.cams[i],1.2);SFX.whoosh()}if(b.flashes&&i===seq.length-1&&IMG[b.flashes[i]]){const f=h("div",{class:"flashimg"},h("img",{src:IMG[b.flashes[i]],alt:""}));document.body.append(f);SFX.whoosh();setTimeout(()=>f.remove(),1300)}draw()}},t)));sb.disabled=seq.length<b.items.length};
  card.append(h("div",{class:"row"},h("button",{class:"btn",onclick:()=>{if(!done){seq.length=0;draw()}}},"重来"),sb));stage.append(card);draw();speaker(dlg,"du","jj",b.tip||"按顺序点下面的句子。排对一项，镜头就飞到那里。",{noNext:true,au:false})}
const hanLen=t=>(t.match(/[一-鿿A-Za-z0-9]/g)||[]).length;
function writeIssue(t,c){const cs=t.match(/[一-鿿A-Za-z0-9]/g)||[];const n=cs.length;if(n<c.min)return null;if(/(.)\1\1/.test(cs.join("")))return "不要用重复的字凑字数。";
  if(new Set(cs).size<Math.max(5,Math.ceil(n*0.45)))return "重复的字太多了，请用自己的话写。";if(/不知道|不清楚|不会|没想法|随便/.test(t)&&n<c.min+12)return "说说你的想法吧，哪怕是猜测，也写出理由。";return null}
function vWrite(stage,dlg,b){const ta=h("textarea",{placeholder:`至少 ${b.min} 个字`});ta.value=S.wr[b.id]||"";const cnt=h("span",{class:"muted small"});const warn=h("div",{class:"warnline"});
  const sb=h("button",{class:"btn primary",onclick:()=>{S.wr[b.id]=ta.value.trim();logQ({k:b.id,type:"write",ok:null});ta.disabled=sb.disabled=true;S.pts+=8;floatTxt("+8 "+PTS());updHud();
    card.append(h("div",{class:"explain"},h("b",{},(LESSON.cast?NAME.du:"先生")+"的想法　"),b.ref));speaker(dlg,"du","gk","写得好。看看我是怎么想的——你的想法和我一样吗？",{next,au:false})}},"提交");
  const upd=()=>{const n=hanLen(ta.value);cnt.textContent=`${n} / ${b.min} 字`;const iss=writeIssue(ta.value,b);warn.textContent=iss||"";sb.disabled=n<b.min||!!iss};ta.addEventListener("input",()=>{upd();S.wr[b.id]=ta.value;save()});
  const card=h("div",{class:"card"},h("div",{class:"eyebrow"},"写一写"),h("h2",{class:"q"},b.q),ta,warn,h("div",{class:"row"},cnt,sb));stage.append(card);upd();if(PROJ){ta.placeholder="请几位同学说说自己的想法……";cnt.textContent="";sb.disabled=false;sb.textContent="看参考想法";sb.onclick=()=>{sb.disabled=true;card.append(h("div",{class:"explain"},h("b",{},(LESSON.cast?NAME.du:"先生")+"的想法　"),b.ref));speaker(dlg,"du","gk","你们的想法和我一样吗？",{next,au:false})}}speaker(dlg,"du","jj","用你自己的话写，不用写很长。",{noNext:true,au:false})}

/* ---------- 背诵接龙 ---------- */
const hanOnly=t=>(t.match(/[一-鿿]/g)||[]).join("");
function lcsDiff(exp,got){const a=[...exp],b=[...got],n=a.length,m=b.length;const d=Array.from({length:n+1},()=>new Uint16Array(m+1));for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)d[i][j]=a[i]===b[j]?d[i+1][j+1]+1:Math.max(d[i+1][j],d[i][j+1]);
  const ea=new Array(n).fill(false),gb=new Array(m).fill(false);let i=0,j=0;while(i<n&&j<m){if(a[i]===b[j]){ea[i]=gb[j]=true;i++;j++}else if(d[i+1][j]>=d[i][j+1])i++;else j++}return {score:Math.round(d[0][0]/Math.max(n,m,1)*100),ea,gb}}
function diffView(raw,got,df){const box=h("div",{class:"diff"});const e=h("p",{},h("b",{},"原文　"));let k=0;[...raw].forEach(ch=>{if(/[一-鿿]/.test(ch)){e.append(h("span",{class:df.ea[k]?"":"miss"},ch));k++}else e.append(ch)});
  const g=h("p",{},h("b",{},"你写的　"));[...got].forEach((ch,j)=>g.append(h("span",{class:df.gb[j]?"":"extra"},ch)));box.append(e,g,h("p",{class:"muted small"},"红：漏写或写错的字；黄：多写或写错的字。"));return box}
const noPaste=el=>{el.addEventListener("paste",e=>{e.preventDefault();toast("背诵要自己写")});el.setAttribute("autocomplete","off");el.setAttribute("spellcheck","false");return el};
const RC_STEPS=["听两遍","接龙·有提示","接龙·首字","不看提示"];
const firstHint=l=>[...l].map((ch,k,arr)=>!/[一-鿿]/.test(ch)?ch:(k===0||!/[一-鿿]/.test(arr[k-1]))?ch:"＿").join("");
function vRecite(stage,dlg,b){const R=S.rc[b.id]||(S.rc[b.id]={step:0,best:0,att:0});const st=R.step;
  const card=h("div",{class:"card"},h("div",{class:"eyebrow"},"背一背 · 接龙"),h("div",{class:"rsteps"},RC_STEPS.map((t,k)=>h("span",{class:k<st?"ok":k===st?"now":""},`${k+1} ${t}`))));stage.append(card);
  const adv=()=>{R.step++;save();if(R.step>=4){logQ({k:b.id,type:"recite",ok:true,score:R.best});next()}else render()};const fb=h("div",{class:"fb"});
  if(st===0){const box=h("div",{class:"scroll"});const els=b.lines.map(i=>{const p=h("p",{class:"on"},P1[i]);box.append(p);return p});let plays=0;const cnt=h("span",{class:"muted small"},"已听 0 / 2 遍");
    const go=h("button",{class:"go",disabled:true,onclick:adv},"听完了 ▸");setTimeout(()=>{go.disabled=false},30000);
    const pb=h("button",{class:"ghost",onclick:()=>{pb.disabled=true;gameStop=playSeq(b.lines.map(i=>"p"+i),(k,au,id)=>{els.forEach(e=>e.classList.remove("hl"));els[k].classList.add("hl");kara(els[k],id,au)},()=>{els.forEach(e=>e.classList.remove("hl"));plays++;cnt.textContent=`已听 ${plays} / 2 遍`;pb.disabled=false;pb.textContent="↻ 再听";if(plays>=2)go.disabled=false})}},"▶ 播放");
    card.append(box,h("p",{class:"muted small"},"小声跟着读，记住先说什么、后说什么。"),cnt);speaker(dlg,"fan","kx","先听两遍，跟着小声读。",{noNext:true,au:false,extra:[pb,go]});setTimeout(()=>pb.click(),300);return}
  const NL=b.lines.length;const mine=st===1?[...Array(NL).keys()].filter(k=>k%2===1):st===2?[...Array(NL).keys()].filter(k=>k%2===0):[...Array(NL).keys()];const rows=[];const box=h("div",{class:"relay"});
  b.lines.forEach((li,k)=>{if(mine.includes(k)){const inp=noPaste(h("input",{class:"rin",placeholder:st===1?"关键字："+b.keys[k].join("、"):st===2?firstHint(P1[li]):"默写这一句"}));rows.push({li,inp});box.append(h("div",{class:"rrow me"},h("span",{class:"who"},"你"),inp))}
    else box.append(h("div",{class:"rrow fan"},h("span",{class:"who"},NAME.fan),h("span",{class:"rtxt"},P1[li]),h("button",{class:"ghost small",onclick:()=>playAu("fp"+li)},"▶")))});
  card.append(box);if(TV)card.append(h("p",{class:"tref"},"原文（教师可见）："+b.lines.map(i=>P1[i]).join("")));
  const sb=h("button",{class:"btn primary",onclick:()=>{const raw=rows.map(r=>P1[r.li]).join(""),got=rows.map(r=>hanOnly(r.inp.value)).join("");const exp=hanOnly(raw);if(got.length<exp.length*.5){toast("还没写完");return}
    const df=lcsDiff(exp,got);R.att++;R.best=Math.max(R.best,df.score);logQ({k:b.id+".s"+st,type:"recite",ok:df.score>=90,score:df.score});fb.innerHTML="";rows.forEach(r=>r.inp.disabled=true);sb.disabled=true;
    if(df.score>=90){if(df.score<100)fb.append(diffView(raw,got,df));speaker(dlg,"fan","kx",`${df.score}%！${df.score===100?"一字不差！":"过了，标红的字再看一眼。"}`,{next:adv,au:false})}
    else{fb.append(diffView(raw,got,df));speaker(dlg,"du","gk",`${df.score}%，还差一点（要 90%）。看清错在哪，再来一次。`,{next:()=>render(),nextLabel:"再来一次",au:false})}}},"检查");
  card.append(h("div",{class:"row"},sb),fb);
  if(st<3){const fl=b.lines.filter((li,k)=>!mine.includes(k));speaker(dlg,"fan","kx",st===1?(NL===3?"我说第一句和第三句，你接中间那句！":"我说单数句，你接双数句！"):(NL===3?"这次反过来：我说中间，你说头和尾。":"这次反过来：你说单数句，我说双数句。"),{noNext:true,au:false});
    setTimeout(()=>{gameStop=playSeq(fl.map(li=>"fp"+li),null,()=>rows[0].inp.focus({preventScroll:true}))},400)}
  else{speaker(dlg,"fan","yh",`这次不看提示，${NL===3?"三":NL}句一起默写，加油！`,{noNext:true,au:false});setTimeout(()=>rows[0].inp.focus({preventScroll:true}),80)}}

/* ---------- 过关检测 ---------- */
function expandTest(it){const b=beatOf(it);S.test.round=(S.test.round||0)+1;const r=S.test.round;
  const seen=Object.keys(S.at).filter(a=>ATOMS[a]);const weak=shuffle(seen.filter(a=>S.at[a].wr>S.at[a].fix));const rest=shuffle(seen.filter(a=>!weak.includes(a)));
  const pick=shuffle([...weak,...rest].slice(0,Math.min(b.n||12,seen.length)));it.expanded=true;
  const items=[{t:"info",title:r===1?"过关检测":`第 ${r} 次过关检测`,paras:[`共 ${pick.length} 题，都是这一课学过的，换了新问法。答对 80% 过关。`,"检测时答错不会马上重来，做完统一看结果。"],say:"不看书，凭记忆来答。"},
    ...pick.map((a,i)=>({t:"ask",a,test:r,ti:`${i+1}/${pick.length}`})),{t:"testcheck",round:r,n:pick.length}];
  S.q.splice(S.pos+1,0,...items);S.pos++;save();render()}
function vTestCheck(it){const lg=S.log.filter(l=>l.test===it.round);const ok=lg.filter(l=>l.ok).length,n=lg.length||1;const pct=Math.round(ok/n*100);const {stage,dlg}=frame();
  if(pct>=80){S.test.pass={score:pct,round:it.round};save();stage.append(h("div",{class:"card done"},h("div",{class:"bigseal stamp"},LX.seal),h("h2",{},`过关检测 ${ok}/${n}（${pct}%）`),h("p",{},LX.passText)));
    speaker(dlg,"du","jj","过关了。宫殿建起来了，字词也记住了。",{next,au:false});SFX.done();return}
  const wrong=[...new Set(lg.filter(l=>!l.ok).map(l=>l.a))];
  stage.append(h("div",{class:"card done"},h("h2",{},`这次答对 ${ok}/${n}（${pct}%）`),h("p",{},"要答对 80% 才过关。先把错的再练一遍："),h("ul",{class:"weak"},wrong.map(a=>{const A=ATOMS[a];return h("li",{},A.k==="w"?`${A.s}——${A.c}：${A.m}`:A.v[0].e)}))));
  speaker(dlg,"fan","yh","没关系，我们把错的再练一遍，再测一次！",{au:false,next:()=>{S.q.splice(S.pos+1,0,...wrong.flatMap(a=>[{t:"ask",a,rep:1},{t:"ask",a,rep:1}]),{t:"test",n:Math.max(8,wrong.length+4)});S.pos++;save();render()},nextLabel:"再练一轮"})}

/* ---------- 结束 ---------- */
function vEnd(stage,dlg){if(!LESSON.built0)Object.keys(REGIONS).forEach(id=>{if(!S.built.includes(id))S.built.push(id)});const first=!S.done;if(first){S.done=Date.now();SFX.done()}save();
  const top=SC.inner.querySelector(".pl-top");if(top){const m=maskFor(S.built);top.style.webkitMaskImage=m;top.style.maskImage=m}
  const a=accStat();const dt=new Date(),stat=(k,v)=>h("div",{class:"cstat"},h("b",{},v),h("small",{},k));
  const card=LX.cert?h("div",{class:"certwrap"},h("div",{class:"card cert"},h("div",{class:"certin"},h("i",{class:"cc tl"}),h("i",{class:"cc tr"}),h("i",{class:"cc bl"}),h("i",{class:"cc br"}),
    h("div",{class:"certtop"},"高中语文 · 必修二 · 第三单元"),h("h1",{},"结业证书"),h("div",{class:"certrule"},h("span",{},"《阿房宫赋》互动课")),
    h("p",{class:"certlead"},"兹证明"),h("p",{class:"certname"},S.name||"　"),S.cls?h("p",{class:"certcls"},S.cls):null,
    h("p",{class:"certbody"},"已学完唐代杜牧《阿房宫赋》全部五课时：从“六王毕，四海一”到“后人哀之而不鉴之”，读其文，明其理，诵其辞。特发此证。"),
    h("div",{class:"certstats"},stat("五课时","全部完成"),stat("全文默写",(S.full??"—")+(S.full!=null?"%":"")),stat("本课正确率",a.pct+"%")),
    h("div",{class:"certfoot"},h("div",{class:"certsign"},h("small",{},"授课先生"),h("b",{},"杜　牧"),h("small",{},"唐 · 号樊川")),h("div",{class:"certdate"},`${dt.getFullYear()} 年 ${dt.getMonth()+1} 月 ${dt.getDate()} 日`),h("div",{class:"certstamp"},h("span",{},"樊川"))))),
    h("div",{class:"row center certbtns"},h("button",{class:"btn primary big",onclick:openSubmit},"交给老师"))):h("div",{class:"card done"},h("div",{class:"bigseal stamp"},LX.seal),h("h2",{},LX.endTitle),
    h("p",{},`正确率 ${a.pct}%　·　${LX.ptsName||"片瓦"} ${S.pts}　·　最高连对 ${S.best}　·　用时 ${fmtMin(S.tm)}`),
    h("div",{class:"row center"},h("button",{class:"btn primary big",onclick:openSubmit},"交给老师"),h("button",{class:"btn",onclick:()=>showPalace("点任意处关闭。")},"看看"+LX.palLabel)));
  const flash=()=>{const f=h("div",{class:"ruinflash"},h("img",{src:IMG[LX.flash],alt:""}));document.body.append(f);SFX.whoosh();setTimeout(()=>f.remove(),1300)};
  if(first){applyCam({x:50,y:50,z:1.05},4);speaker(dlg,"fan","yh",LX.endQ,{au:true,noNext:true});
    setTimeout(()=>{flash();setTimeout(()=>{stage.append(card);speaker(dlg,"du","gk",LX.endA,{})},1300)},3400)}
  else{stage.append(card);speaker(dlg,"du","gk",LX.endA,{})}}

/* ---------- 开始 ---------- */
function vWelcome(){const ui=$("#ui");ui.innerHTML="";ensureScene({bg:"S1",cam:{x:72,y:34,z:1.15}});
  const f=h("form",{class:"card welcome"},h("div",{class:"eyebrow"},LX.author||"唐 · 杜牧"),h("h1",{class:LX.work?"longt":null},LX.work||"阿房宫赋"),h("p",{class:"lead"},`${LESSON.sub}：${LESSON.title}`),
    h("div",{class:"cast"},h("div",{},h("img",{src:AV("du"),alt:""}),h("b",{},NAME.du),h("small",{},CAST.du.role)),h("div",{},h("img",{src:AV("fan"),alt:""}),h("b",{},NAME.fan),h("small",{},CAST.fan.role))),
    h("p",{class:"muted"},LX.intro),
    h("div",{class:"row"},h("label",{},"姓名",h("input",{id:"nm",required:true,placeholder:"请写真实姓名"})),h("label",{},"班级",h("input",{id:"cl",placeholder:"例如：高一（1）班"}))),
    h("button",{class:"btn primary big",type:"submit"},"开始"));
  f.addEventListener("submit",e=>{e.preventDefault();const n=$("#nm").value.trim();if(!n)return;S.name=n;S.cls=$("#cl").value.trim();S.start=Date.now();setStu(S.name,S.cls);save();ac();bgmStart();render()});
  ui.append(h("div",{class:"veil strong"}),h("main",{class:"stage center"},f))}

/* ---------- 交给老师（Google 表单） ---------- */
const FORM="https://docs.google.com/forms/d/e/1FAIpQLSeuwomU7eZTADhuwHBQJvFLF890HMIOB5Y8JMrDuW-SszdQVA/viewform?usp=pp_url";
const FORM_F={course:"entry.156272136",name:"entry.781257176",rec:"entry.30715045"};
function b64(u){let s="";for(let i=0;i<u.length;i+=0x8000)s+=String.fromCharCode.apply(null,u.subarray(i,i+0x8000));return btoa(s)}
async function packCode(){const o={c:LESSON.id,n:S.name,k:S.cls,st:S.start,se:Date.now(),p:[S.pos,S.q?S.q.length:0],d:S.done,tm:S.tm,b:S.built.length,
  at:Object.fromEntries(Object.entries(S.at).map(([a,s])=>[a,[s.n,s.ok,s.wr]])),L:S.log.filter(l=>l.first||l.ok===false||l.test||!l.a).map(l=>[l.a||l.k,l.v||"",l.ok===true?1:l.ok===false?0:2,l.first?1:0,l.test||0,Math.round((l.ms||0)/1000),l.score??l.miss??""]),rc:S.rc,tp:S.test.pass||null};
  const bytes=new TextEncoder().encode(JSON.stringify(o));try{const cs=new Blob([bytes]).stream().pipeThrough(new CompressionStream("deflate-raw"));return "AFG1:"+b64(new Uint8Array(await new Response(cs).arrayBuffer()))}catch(e){return "AFG0:"+b64(bytes)}}
function summary(code){const a=accStat();const first=S.log.filter(l=>l.a&&l.first&&!l.rep&&!l.test);const fp=first.length?Math.round(first.filter(l=>l.ok).length/first.length*100):0;
  const weak=Object.entries(S.at).filter(([k,v])=>v.wr>0&&ATOMS[k]).sort((x,y)=>y[1].wr-x[1].wr).slice(0,8).map(([k,v])=>{const A=ATOMS[k];return (A.k==="w"?`${A.c}（${A.s.slice(0,6)}）`:(A.v[0].q||"").slice(0,10)+"…")+`×${v.wr}`}).join("、");
  const rc=Object.entries(S.rc).map(([k,r])=>r.dict?`第${"①②③④"[r.para]}段${r.step>=3?"":"（未完成）"} ${r.best}%${r.miss?"，错漏："+r.miss.slice(0,20):""}`:`${r.step>=4?"四步完成":"第"+(r.step+1)+"步"}，默写最好 ${r.best}%`).join("；");
  const wr=Object.values(S.wr).filter(t=>t&&t.trim()).map(t=>"· "+t.trim().replace(/\s+/g," ").slice(0,60)).join("\n");
  return `进度：${S.done?"本课时完成":`第 ${S.pos+1}/${S.q?S.q.length:0} 步（${curScene().chap||""}）`}${BEATS.some(x=>x.t==="test")?"；过关检测 "+(S.test.pass?S.test.pass.score+"%":"未过"):""}；正确率 ${a.pct}%（${a.n}题）；首次正确率 ${fp}%；用时 ${Math.round(S.tm/60000)} 分钟；${LX.palName} ${S.built.length}/${Object.keys(REGIONS).length}\n${S.full!=null?"全文默写 "+S.full+"%；":""}背诵/默写：${rc||"未做"}\n错得多的：${weak||"无"}${wr?"\n写一写：\n"+wr:""}\n——以下是详细记录，供分析用——\n${code}`}
function showGate(a){const m=h("div",{class:"modal",onclick:e=>{if(e.target===m)m.remove()}},h("div",{class:"card"},h("h2",{},`正确率 ${a.pct}%，还不能交`),h("p",{},`一共答了 ${a.n} 题，答对 ${a.ok} 题。要达到 80% 才能交给老师。`),
  h("p",{class:"muted"},"往下继续学，错过的题会换个问法再出现，答对了正确率就会上来。"),h("div",{class:"row"},h("button",{class:"btn primary",onclick:()=>m.remove()},"继续学"))));document.body.append(m)}
async function openSubmit(){const a=accStat();if(a.n>=10&&a.pct<80){showGate(a);return}if(window.SUBMIT_URL)return directSubmit(a);const code=await packCode();const who=S.cls?`${S.name}（${S.cls}）`:S.name;
  const mk=r=>FORM+"&"+FORM_F.course+"="+encodeURIComponent(LESSON.course)+"&"+FORM_F.name+"="+encodeURIComponent(who)+"&"+FORM_F.rec+"="+encodeURIComponent(r);
  const rec=summary(code);let url=mk(rec);if(url.length>7800){const head=rec.split("——以下是详细记录")[0];url=mk(head+"——详细记录太长，已省略——")}
  const step2=h("div",{class:"substep"},h("b",{},"② 在表单最下面点“提交”。"),"看到“已记录您的回复”，就交好了。");
  const m=h("div",{class:"modal",onclick:e=>{if(e.target===m)m.remove()}},h("div",{class:"card"},h("h2",{},"交给老师"),h("p",{},"你的进度、成绩、错题和写一写都已经自动填进表单，不用自己填。"),
    h("div",{class:"row"},h("a",{class:"btn primary big",href:url,target:"_blank",rel:"noopener",onclick:()=>{S.subAt=Date.now();save();step2.classList.add("on")}},"① 打开作业表单 →")),step2,
    h("p",{class:"muted small"},"可以交好几次，老师看最新的一次。"),h("div",{class:"row"},h("button",{class:"btn",onclick:()=>m.remove()},"关闭"))));document.body.append(m)}


/* ---------- 直接交到老师的 Google 表格（GitHub 版） ---------- */
function sid(){let v="";try{v=localStorage.getItem("afg-sid")||"";if(!v){v=Math.random().toString(36).slice(2,10)+Date.now().toString(36);localStorage.setItem("afg-sid",v)}}catch(e){}return v}
async function postRec(body){
  try{const r=await fetch(window.SUBMIT_URL,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body});const j=await r.json();return j&&j.ok?"ok":"bad"}
  catch(e){try{await fetch(window.SUBMIT_URL,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body});return "sent"}catch(e2){return "fail"}}}
async function directSubmit(a){const code=await packCode();
  const first=S.log.filter(l=>l.a&&l.first&&!l.rep&&!l.test);const fp=first.length?Math.round(first.filter(l=>l.ok).length/first.length*100):0;
  const writing=BEATS.filter(b=>(b.t==="write"||b.t==="compose")&&S.wr[b.id]&&S.wr[b.id].trim()).map(b=>({id:b.id,q:b.q||b.title||"",text:S.wr[b.id].trim()}));
  Object.keys(S.wr).forEach(k=>{if(S.wr[k]&&S.wr[k].trim()&&!writing.some(w=>w.id===k))writing.push({id:k,q:"",text:S.wr[k].trim()})});
  const rec={v:1,lesson:LESSON.id,course:LESSON.course,cls:S.cls||"",name:S.name,done:!!S.done,pct:a.pct,fp,min:Math.round(S.tm/60000),
    summary:summary(code).split("——以下是详细记录")[0].trim(),writing,code,sid:sid()};
  const body=JSON.stringify(rec);
  const msg=h("p",{},"正在交给老师……");const btns=h("div",{class:"row"});
  const m=h("div",{class:"modal"},h("div",{class:"card"},h("h2",{},"交给老师"),msg,btns));document.body.append(m);
  const close=h("button",{class:"btn",onclick:()=>m.remove()},"关闭");
  const res=await postRec(body);
  if(res==="ok"||res==="sent"){S.subAt=Date.now();save();msg.replaceWith(h("div",{},h("p",{class:"big"},"✓ 已经交给老师了。"),
      h("p",{class:"muted small"},`${S.name}${S.cls?"（"+S.cls+"）":""} · ${LESSON.course} · 正确率 ${a.pct}%${writing.length?" · 写一写 "+writing.length+" 篇":""}`),
      h("p",{class:"muted small"},"可以交好几次，老师看最新的一次。")));btns.append(close)}
  else{msg.textContent="没有交上去，可能是网络不好。请检查网络后再试一次。";
    btns.append(h("button",{class:"btn primary",onclick:()=>{m.remove();directSubmit(a)}},"再试一次"),close)}}

/* ---------- 画面特效层 ---------- */
function addOv(kind){if(!SC.inner||SC.inner.querySelector(".ov-"+kind))return;const o=h("div",{class:"scn-ov ov-"+kind});
  if(kind==="stars")for(let i=0;i<46;i++)o.append(h("i",{style:`left:${8+Math.random()*80}%;top:${20+Math.random()*55}%;animation-delay:${(Math.random()*2).toFixed(2)}s;--s:${(0.5+Math.random()).toFixed(2)}`}));
  if(kind==="smoke")for(let i=0;i<9;i++)o.append(h("i",{style:`left:${5+Math.random()*70}%;top:${15+Math.random()*50}%;animation-delay:${(Math.random()*4).toFixed(2)}s`}));
  if(kind==="cloud")o.append(h("i"),h("i"));
  if(kind==="oil")o.append(h("i"));if(kind==="rain")o.className+=" rainov";
  SC.inner.append(o)}

/* ---------- 背诵接龙（半句） ---------- */
function vHalfRelay(stage,dlg,b){if(S.fx[b.id]){speaker(dlg,"fan","kx","上节课的都记住了！",{next,au:false});return}
  let k=0;const card=h("div",{class:"card slim"},h("div",{class:"eyebrow"},"背诵接龙"),h("h2",{class:"q"},b.q));const box=h("div",{class:"relay"});card.append(box);stage.append(card);
  const row=()=>{if(k>=b.pairs.length){S.fx[b.id]=1;save();SFX.done();speaker(dlg,"fan","kx","全接上了！上节课的没忘。",{next,au:false});return}
    const[a,ans]=b.pairs[k];let tries=0;const inp=noPaste(h("input",{class:"rin",placeholder:"接下半句"}));
    const hint=h("button",{class:"ghost small",onclick:()=>{inp.placeholder="提示："+ans[0]+"……";tries=Math.max(tries,1)}},"提示");
    const r=h("div",{class:"rrow"},h("span",{class:"who"},NAME.fan),h("span",{class:"rtxt"},a+"，"),inp,hint);box.append(r);
    const k0=auKey(a);if(AUD[k0])playAu(k0);
    const chk=()=>{const ok=hanOnly(inp.value)===hanOnly(ans);if(ok){inp.disabled=true;inp.classList.add("right");hint.remove();logQ({k:b.id+"."+k,type:"relay",ok:tries===0});if(tries===0)reward(true,true);else SFX.ok();k++;setTimeout(row,500)}
      else{tries++;SFX.no();inp.classList.add("shake");setTimeout(()=>inp.classList.remove("shake"),400);if(tries>=2){inp.value="";inp.placeholder="照着写："+ans}}};
    inp.addEventListener("keydown",e=>{if(e.key==="Enter")chk()});
    speaker(dlg,"fan","kx",a+"——下一句是？",{noNext:true,au:false,extra:[h("button",{class:"go",onclick:chk},"接上 ▸")]});setTimeout(()=>inp.focus({preventScroll:true}),80)};
  row()}

/* ---------- 辇来于秦：六国辇车驶向咸阳 ---------- */
function vCarts(stage,dlg,b){const api=SC.api;const left=Object.keys(STATES).filter(k=>k!=="qin");let n=0;const[tx,ty]=MP(108.75,34.38);
  const t0=task(stage,"点各国的辇车，送她们去咸阳","0 / 6");const cnt=sv("text",{x:tx,y:ty+52,class:"city sm cnt"},"");api.s.append(cnt);
  const fin=()=>{S.fx[b.id]=1;save();caption("朝歌夜弦");[0,1,2,3,4,5].forEach(i=>setTimeout(SFX.qin,i*280));speaker(dlg,"du","gk","六国的宫人，都到了咸阳。从此，朝歌夜弦，为秦宫人。",{next,au:false})};
  if(S.fx[b.id])return fin();
  left.forEach(k=>{const[x0,y0]=MP(...STATES[k].lamp);const cart=sv("g",{class:"cart",transform:`translate(${x0} ${y0})`},sv("rect",{x:-16,y:-20,width:32,height:16,rx:3,fill:"#c9a25a",stroke:"#3a2a1a","stroke-width":2}),sv("path",{d:"M-20 -20 Q0 -34 20 -20Z",fill:"#7a2416"}),sv("circle",{cx:-9,cy:0,r:6,fill:"#3a2a1a"}),sv("circle",{cx:9,cy:0,r:6,fill:"#3a2a1a"}));api.s.append(cart);
    const d=hotDot(x0/16,y0/9,STATES[k].n,()=>{d.remove();SFX.step();const cx=(x0+tx)/2,cy=Math.min(y0,ty)-60;const trail=sv("path",{d:`M${x0} ${y0} Q${cx} ${cy} ${tx} ${ty}`,stroke:"#7a2416","stroke-width":3,fill:"none","stroke-dasharray":"6 8",opacity:.6,class:"trail"});api.s.insertBefore(trail,cart);
      const L=trail.getTotalLength();trail.style.strokeDashoffset=0;let t0_=null;const run=ts=>{if(!t0_)t0_=ts;const p=Math.min(1,(ts-t0_)/2400);const pt=trail.getPointAtLength(L*p);cart.setAttribute("transform",`translate(${pt.x} ${pt.y})`);if(p<1)requestAnimationFrame(run);else{cart.style.opacity=0;n++;cnt.textContent=`宫人 ${n}/6`;floatTxt(STATES[k].n+"宫人");if(n===6)setTimeout(fin,600)}};requestAnimationFrame(run);
      t0.querySelector("small").textContent=`${n+1>6?6:n} / 6`},"lamp")});
  speaker(dlg,"du","gk","齐、楚、燕、韩、赵、魏，一辆一辆，都去咸阳。",{noNext:true,au:false})}

/* ---------- 宫车过也：听声音 ---------- */
function rumble(dur=2.6,vol=.7){if(!S.snd)return;try{const c=ac(),t=c.currentTime;const s_=c.createBufferSource();s_.buffer=noise();s_.loop=true;const f=c.createBiquadFilter();f.type="lowpass";f.frequency.value=140;const g=c.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.08);g.gain.exponentialRampToValueAtTime(.001,t+dur);s_.connect(f).connect(g).connect(c.destination);s_.start(t);s_.stop(t+dur+.1);osc(45,{vol:.4,dur:dur*.8,bend:30})}catch(e){}}
function carSound(dur=7,onEnd){if(!S.snd){setTimeout(onEnd,1500);return}try{const c=ac(),t=c.currentTime;const s_=c.createBufferSource();s_.buffer=noise();s_.loop=true;const f=c.createBiquadFilter();f.type="lowpass";f.frequency.value=320;const g=c.createGain();const pan=c.createStereoPanner?c.createStereoPanner():null;
  g.gain.setValueAtTime(.5,t);g.gain.exponentialRampToValueAtTime(.002,t+dur);s_.connect(f).connect(g);if(pan){g.connect(pan).connect(c.destination);pan.pan.setValueAtTime(-.8,t);pan.pan.linearRampToValueAtTime(.9,t+dur)}else g.connect(c.destination);s_.start(t);s_.stop(t+dur);
  for(let i=0;i<dur*3.2;i++){const v=.25*Math.pow(1-i/(dur*3.2),2);osc(110,{vol:v,dur:.08,at:i/3.2,type:"square"});osc(90,{vol:v*.8,dur:.08,at:i/3.2+.14,type:"square"})}setTimeout(onEnd,dur*1000)}catch(e){setTimeout(onEnd,1500)}}
function vThunder(stage,dlg,b){SC.el.classList.add("dusk");
  if(S.fx[b.id]){speaker(dlg,"du","gk","雷声一样的，是宫车。",{next,au:false});return}
  const boom=()=>{rumble();SC.el.classList.remove("quake");void SC.el.offsetWidth;SC.el.classList.add("quake")};setTimeout(boom,500);
  const card=h("div",{class:"card slim guess"},h("div",{class:"eyebrow"},"听一听"),h("h2",{class:"q"},"轰隆隆——这是什么声音？"),
    h("div",{class:"opts"},...["打雷了","宫车经过","战鼓声"].map((o,i)=>h("button",{class:"opt",onclick:()=>{logQ({k:b.id,type:"guess",ok:null,g:i});card.remove();
      const lb=h("button",{class:"go",onclick:()=>{lb.disabled=true;lb.textContent="听……";const ring=h("div",{class:"soundring"});stage.append(ring);carSound(7,()=>{ring.remove();S.fx[b.id]=1;save();speaker(dlg,"fan","yh","听不见了……车去哪儿了？",{next,au:false})})}},"听 · 辘辘 ▸");
      speaker(dlg,"du","gk",(i===1?"你听出来了。":"不是。")+"雷霆乍惊，宫车过也——是秦王的车。再听，车声往哪里去？",{noNext:true,au:false,extra:[lb]})}},h("b",{},"ABC"[i]),o))),
    h("button",{class:"ghost small",onclick:boom},"↻ 再听一次"));
  stage.append(card);speaker(dlg,"fan","jy","啊！什么声音？",{noNext:true,au:false})}

/* ---------- 三十六年：等 ---------- */
const SEASON=[{n:"春",c:"rgba(255,170,190,.22)",p:"petal"},{n:"夏",c:"rgba(255,210,120,.2)",p:"sun"},{n:"秋",c:"rgba(210,130,50,.25)",p:"leaf"},{n:"冬",c:"rgba(190,210,240,.32)",p:"snow"}];
function vWait(stage,dlg,b){let yr=0,frac=0,holding=false,raf=0,last=0;const tint=$("#tint");const fx=h("div",{class:"seasonfx"});stage.append(fx);
  const yrEl=h("div",{class:"yearbig"},"第 0 年");stage.append(yrEl);
  const setSeason=si=>{const S_=SEASON[si];tint.style.cssText=`background:${S_.c};mix-blend-mode:normal`;fx.className="seasonfx "+S_.p};
  const fin=()=>{cancelAnimationFrame(raf);S.fx[b.id]=1;save();SC.el.classList.add("aged");tint.style.cssText="";fx.className="seasonfx snow";yrEl.textContent="三十六年";SFX.bell();speaker(dlg,"du","gk","三十六年。",{next,au:false})};
  if(S.fx[b.id])return fin();
  const btn=h("button",{class:"go holdbtn"},"按住 · 等");
  const loop=ts=>{const dt=last?ts-last:0;last=ts;if(holding){frac+=dt/300;if(frac>=1){frac=0;yr++;yrEl.textContent=`第 ${yr} 年`;setSeason(yr%4);if(yr%7===3){carSound(2.4,()=>{})}if(yr>=36){holding=false;return fin()}}}raf=requestAnimationFrame(loop)};raf=requestAnimationFrame(loop);
  const on=e=>{e.preventDefault();holding=true},off=()=>{holding=false};btn.addEventListener("pointerdown",on);["pointerup","pointerleave","pointercancel"].forEach(ev=>btn.addEventListener(ev,off));
  btn.addEventListener("keydown",e=>{if(e.key===" "||e.key==="Enter"){e.preventDefault();holding=true}});btn.addEventListener("keyup",off);
  gameStop=()=>{cancelAnimationFrame(raf);tint.style.cssText=""};
  speaker(dlg,"fan","yh","我陪她等。按住就是在等……",{noNext:true,au:false,extra:[btn]})}

/* ---------- 鼎铛玉石：翻宝物 ---------- */
function vFlip(stage,dlg,b){let n=0;const done=()=>{S.fx[b.id]=1;save();caption("鼎铛玉石，金块珠砾");speaker(dlg,"du","gk","宝鼎当铁锅，美玉当石头，金子当土块，珍珠当碎石子。",{next,au:false})};
  task(stage,"点地上发光的宝物，翻过来看看秦人把它当成了什么","");
  b.items.forEach(it=>{const card=h("div",{class:"flipc"+(S.fx[b.id]?" on":""),style:`left:${it.x}%;top:${it.y}%`},h("div",{class:"fin"},h("div",{class:"ff"},it.a),h("div",{class:"fb2"},it.b)));SC.inner.append(card);
    if(S.fx[b.id])return;const d=hotDot(it.x,it.y,"",()=>{d.remove();card.classList.add("on");SFX.whoosh();setTimeout(SFX.no,500);n++;if(n===b.items.length)setTimeout(done,1200)});});
  if(S.fx[b.id])return done();
  speaker(dlg,"fan","kx","哇，满地都是宝贝！我来看看……",{noNext:true,au:false})}


/* ---------- 取之尽锱铢 ---------- */
function vTake(stage,dlg,b){if(S.fx[b.id]){speaker(dlg,"du","gk","一粒都没剩。",{next,au:false});return}
  const N=10;const lv={rice:N,coin:N};let got=0;const cnt=h("small",{},"已取 0 铢");
  const vessel=(k,name,col)=>{const fill=h("i",{class:"vfill",style:`background:${col}`});const v=h("button",{class:"vessel"},h("span",{class:"vbody"},fill),h("b",{},name));
    v.addEventListener("click",e=>{if(lv[k]<=0){toast("已经空了");return}lv[k]--;got++;fill.style.height=(lv[k]/N*100)+"%";cnt.textContent=`已取 ${got} 铢`;SFX.tick();
      const r=v.getBoundingClientRect();const g=h("i",{class:"grain",style:`left:${r.left+r.width/2}px;top:${r.top+20}px;background:${col}`});document.body.append(g);setTimeout(()=>g.remove(),900);
      if(lv.rice<=0&&lv.coin<=0){S.fx[b.id]=1;save();setTimeout(()=>speaker(dlg,"du","gk","米缸空了，钱罐也空了。一粒、一铢，都没剩下——这就是“取之尽锱铢”。",{next,au:false}),400)}});return v};
  stage.append(h("div",{class:"card slim take"},h("div",{class:"eyebrow"},"取之尽锱铢"),h("h2",{class:"q"},"点米缸和钱罐，一点一点拿走。全部拿光为止。"),h("div",{class:"vessels"},vessel("rice","米缸","#e9dfc4"),vessel("coin","钱罐","#c9a25a")),cnt));
  speaker(dlg,"fan","yh","一粒一粒地拿……也太狠了吧。",{noNext:true,au:false})}
function vSpend(stage,dlg,b){const go=()=>{SFX.whoosh();for(let i=0;i<140;i++){const p=h("i",{class:"sand",style:`left:${Math.random()*100}vw;animation-delay:${(Math.random()*1.2).toFixed(2)}s;background:${Math.random()<.5?"#e2c46a":"#efe6cf"}`});document.body.append(p);setTimeout(()=>p.remove(),3200)}
    setTimeout(()=>{caption("用之如泥沙");S.fx[b.id]=1;save();speaker(dlg,"du","gk","取的时候，你点了二十下；用的时候，只要一下。",{next,au:false})},1600)};
  if(S.fx[b.id])return speaker(dlg,"du","gk","用之如泥沙。",{next,au:false});
  const bt=h("button",{class:"go",onclick:()=>{bt.remove();go()}},"用 ▸");speaker(dlg,"du","jj","取来的这些，到了宫里，秦王怎么用？你点“用”。",{noNext:true,au:false,extra:[bt]})}

/* ---------- 天平·六个多于 ---------- */
function vBalance(stage,dlg,b){const W=640,PX=320,PY=135,R=230;let round=0,tilt=0;const svgB=sv("svg",{viewBox:`0 0 ${W} 350`,class:"balsvg"});
  const post=sv("path",{d:`M${PX} ${PY} L${PX} 330 M${PX-70} 336 L${PX+70} 336`,stroke:"#5a3a1a","stroke-width":8,"stroke-linecap":"round"});
  const beam=sv("line",{x1:PX-R,y1:PY,x2:PX+R,y2:PY,stroke:"#7a4a1e","stroke-width":9,"stroke-linecap":"round"});
  const pan=side=>{const g=sv("g",{});g.append(sv("line",{x1:0,y1:0,x2:-46,y2:70,stroke:"#7a5a36","stroke-width":2}),sv("line",{x1:0,y1:0,x2:46,y2:70,stroke:"#7a5a36","stroke-width":2}),sv("path",{d:"M-62 70 Q0 96 62 70Z",fill:side==="L"?"#a8321f":"#5f7a4a"}));const tx=sv("g",{class:"pantx"});g.append(tx);return {g,tx}};
  const PL=pan("L"),PR=pan("R");svgB.append(post,beam,PL.g,PR.g,sv("circle",{cx:PX,cy:PY,r:10,fill:"#c9a25a",stroke:"#5a3a1a","stroke-width":3}),sv("text",{x:PX-R,y:24,class:"balcap"},"阿房宫"),sv("text",{x:PX+R,y:24,class:"balcap"},"百姓"));
  const place=()=>{const t=tilt*Math.PI/180;const lx=PX-R*Math.cos(t),ly=PY-R*Math.sin(t)*-1,rx=PX+R*Math.cos(t),ry=PY+R*Math.sin(t)*-1;
    beam.setAttribute("x1",lx);beam.setAttribute("y1",ly);beam.setAttribute("x2",rx);beam.setAttribute("y2",ry);PL.g.setAttribute("transform",`translate(${lx} ${ly})`);PR.g.setAttribute("transform",`translate(${rx} ${ry})`)};
  const addTx=(P,t,i)=>{P.tx.append(sv("text",{x:(i<3?-38:38),y:60-(i%3)*17,class:"pantxt"},t))};
  place();const qbox=h("div",{class:"balq"});const card=h("div",{class:"card balcard"},h("div",{class:"eyebrow"},"称一称 · 六个“多于”"),svgB,qbox);stage.append(card);
  const ask=()=>{if(round>=DUO.length){SFX.fall();svgB.classList.add("snap");setTimeout(()=>{S.fx[b.id]=1;save();caption("多于！");speaker(dlg,"du","gk","天平都压断了。宫里的每一样，都多于百姓的全部。",{next,au:false})},900);return}
    const[l,r]=DUO[round];addTx(PL,l,round);let tries=0;const others=shuffle(DUO.map(x=>x[1]).filter(x=>x!==r)).slice(0,3);qbox.innerHTML="";
    qbox.append(h("p",{class:"balprompt"},"宫中的「",h("b",{class:"kw"},l),"」，被拿来和百姓的什么相比？"),h("div",{class:"opts"},...shuffle([r,...others]).map((o,j)=>h("button",{class:"opt","data-k":j+1,"data-c":(window.__T||TV)&&o===r?"1":null,onclick:e=>{const bt=e.currentTarget;if(bt.disabled)return;
      if(o===r){qbox.querySelectorAll(".opt").forEach(x=>x.disabled=true);bt.classList.add("right");addTx(PR,r,round);logQ({k:"bal."+round,type:"balance",ok:tries===0});reward(tries===0,tries===0);
        playAu("p"+(2+round));tilt=Math.min(19,(round+1)*3.3);place();SFX.build();round++;setTimeout(ask,2600)}
      else{tries++;bt.classList.add("wrong");bt.disabled=true;SFX.no()}}},h("b",{},"ABCD"[j]),o))))};
  speaker(dlg,"du","jj","左盘放宫里的东西，右盘放百姓的东西。看看哪边重。",{noNext:true,au:false});ask()}

/* ---------- 不敢言而敢怒 ---------- */
function vAnger(stage,dlg,b){let p=S.fx[b.id]?1:0,holding=false,raf=0,last=0;const tint=$("#tint");
  const mA=h("i"),mB=h("i");const meters=h("div",{class:"angm"},h("div",{class:"am a"},h("span",{},"百姓之怒"),h("div",{class:"amb"},mA)),h("div",{class:"am b"},h("span",{},"独夫之心"),h("div",{class:"amb"},mB)));stage.append(meters);
  const set=()=>{mA.style.height=(p*100)+"%";mB.style.height=(p*100)+"%";tint.style.cssText=`background:rgba(160,30,10,${(p*.35).toFixed(2)})`};
  const fin=()=>{cancelAnimationFrame(raf);S.fx[b.id]=1;save();set();speaker(dlg,"du","gk","百姓的怒火越积越多，秦王的心却一天比一天骄横顽固。",{next,au:false})};
  if(S.fx[b.id])return fin();
  const btn=h("button",{class:"go holdbtn"},"按住 · 忍");
  const loop=ts=>{const dt=last?ts-last:0;last=ts;if(holding){p=Math.min(1,p+dt/7000);set();if(Math.random()<.35){const e=h("i",{class:"ember",style:`left:${Math.random()*100}vw`});document.body.append(e);setTimeout(()=>e.remove(),2600)}if(Math.random()<.02)SFX.tick();if(p>=1){holding=false;return fin()}}raf=requestAnimationFrame(loop)};raf=requestAnimationFrame(loop);
  const on=e=>{e.preventDefault();holding=true},off=()=>{holding=false};btn.addEventListener("pointerdown",on);["pointerup","pointerleave","pointercancel"].forEach(ev=>btn.addEventListener(ev,off));
  btn.addEventListener("keydown",e=>{if(e.key===" "||e.key==="Enter"){e.preventDefault();holding=true}});btn.addEventListener("keyup",off);
  gameStop=()=>{cancelAnimationFrame(raf);tint.style.cssText=""};
  speaker(dlg,"fan","yh","百姓不敢说话……那就只能忍着吗？",{noNext:true,au:false,extra:[btn]})}

/* ---------- 三处火 ---------- */
function vFires(stage,dlg,b){const api=SC.api;let i=0;const NS_=b.spots.length;const t0=task(stage,"点地图上的火光",`0 / ${NS_}`);
  const fire=(x,y,big)=>{const g=sv("g",{class:"fire"+(big?" big":""),transform:`translate(${x} ${y})`},sv("circle",{r:big?60:34,fill:"#ff7a1a",opacity:.35,class:"fglow"}),sv("path",{d:"M0 -30 C14 -12 18 2 0 16 C-18 2 -14 -12 0 -30Z",fill:"#ff9a2a"}),sv("path",{d:"M0 -14 C7 -4 8 4 0 12 C-8 4 -7 -4 0 -14Z",fill:"#ffe08a"}));api.s.append(g)};
  (b.pre||[]).forEach(p_=>{const[x,y]=MP(...p_.ll);fire(x,y,false)});
  const step=()=>{if(i>=b.spots.length){S.fx[b.id]=1;save();speaker(dlg,"du","gk",b.spots.length>1?"火从东边一路烧到西边，最后烧到了咸阳。":"第一把火，烧起来了。",{next,au:false});return}
    const sp=b.spots[i];const[x,y]=MP(...sp.ll);const d=hotDot(x/16,y/9,sp.n,()=>{d.remove();fire(x,y,sp.k==="xy");rumble(1.4,.4);caption(sp.t.split("——")[0]);t0.querySelector("small").textContent=`${i+1} / ${NS_}`;
      speaker(dlg,"du","gk",sp.t,{noNext:true,au:false});i++;setTimeout(step,2600)},"lamp");
    if(i===0)speaker(dlg,"du","gk",b.pre?"起义的火越烧越大，向西边的秦都烧过去。":"秦始皇死后第二年，第一把火在东边烧了起来。",{noNext:true,au:false})};
  if(S.fx[b.id]){b.spots.forEach(sp=>{const[x,y]=MP(...sp.ll);fire(x,y,sp.k==="xy")});i=b.spots.length}step()}

/* ---------- 焦土 ---------- */
function vBurn(stage,dlg,b){const pal=SC.inner.querySelector(".palace");const base=pal&&pal.querySelector(".pl-base");if(base){base.src=IMG.S8;base.classList.add("ruin")}
  const upd=()=>{const top=pal.querySelector(".pl-top");const m=maskFor(S.built);top.style.webkitMaskImage=m;top.style.maskImage=m;updHud()};
  if(S.fx[b.id]){S.built=[];upd();speaker(dlg,"du","gk","一炬之后。",{next,au:false});return}
  const t0=task(stage,"这是你第一课时建起的阿房宫","");
  const bt=h("button",{class:"go",onclick:()=>{bt.remove();const tint=$("#tint");tint.style.cssText="background:rgba(255,90,20,.25)";const ids=shuffle(S.built.slice());let k=0;
    const tm=setInterval(()=>{if(k>=ids.length){clearInterval(tm);tint.style.cssText="";S.fx[b.id]=1;save();caption("可怜焦土");setTimeout(()=>speaker(dlg,"fan","jy","全……全都没了。",{next,au:false}),900);return}
      const id=ids[k++];S.built=S.built.filter(x=>x!==id);upd();rumble(.8,.25);const R=REGIONS[id];const ring=h("div",{class:"ring burnring",style:`left:${R.x}%;top:${R.y}%`});pal.append(ring);setTimeout(()=>ring.remove(),2000);
      const lab=h("div",{class:"plabel burnlab",style:`left:${R.x}%;top:${R.y}%`},R.label);pal.append(lab);setTimeout(()=>lab.remove(),1800)},700);gameStop=()=>{clearInterval(tm);tint.style.cssText=""}}},"一炬 ▸");
  speaker(dlg,"du","gk","长桥、复道、歌台、舞殿……都还在。点下去吧。",{noNext:true,au:false,extra:[bt]})}


/* ---------- 两桩案子 ---------- */
function vCase(stage,dlg,b){if(S.fx[b.id]){stage.append(h("div",{class:"card slim casecard done"},h("h2",{},b.q),h("div",{class:"verdict"},b.verdict)));speaker(dlg,"du","jj",b.why,{next,au:false});return}
  const board=h("div",{class:"evboard"});const pool=h("div",{class:"evpool"});let got=0,miss=0;const need=b.ev.filter(e=>e.ok).length;
  const susBox=h("div",{class:"sus"});const card=h("div",{class:"card casecard"},h("div",{class:"eyebrow"},"案卷"),h("h2",{class:"q"},b.q),h("p",{class:"muted small"},`先从下面的句子里挑出能当证据的${need===1?"一":"两"}句，放进证据栏；再判。`),
    h("div",{class:"evslot"},h("b",{},"证据栏"),board),pool,susBox);stage.append(card);
  shuffle(b.ev).forEach(e=>{const c=h("button",{class:"evcard",onclick:()=>{if(c.disabled)return;if(e.ok){c.disabled=true;board.append(c);SFX.ok();got++;if(got===need)openSus()}
    else{miss++;SFX.no();c.classList.add("shake");setTimeout(()=>c.classList.remove("shake"),400);speaker(dlg,"fan","yh",e.hint,{noNext:true,au:false})}}},"“"+e.t+"”");pool.append(c)});
  const openSus=()=>{speaker(dlg,"du","jj","证据齐了。你判：是谁？",{noNext:true,au:false});let tries=0;
    b.sus.forEach((t,i)=>susBox.append(h("button",{class:"btn susbtn","data-c":(window.__T||TV)&&i===b.ans?"1":null,onclick:e=>{const bt=e.currentTarget;if(i===b.ans){susBox.querySelectorAll("button").forEach(x=>x.disabled=true);
      logQ({k:b.id,type:"case",ok:tries===0&&miss===0});reward(tries===0,true);S.fx[b.id]=1;save();card.append(h("div",{class:"bigseal stamp judge"},"判"),h("div",{class:"verdict"},b.verdict));playAu("p"+b.line);
      speaker(dlg,"du","jj",b.why,{next,au:false})}else{tries++;bt.disabled=true;bt.classList.add("wrong");SFX.no();speaker(dlg,"du","gk","再看看证据：证据说的是谁做了什么？",{noNext:true,au:false})}}},"判："+t)))};
  speaker(dlg,"du","jj","判案要看证据。前几节课学过的句子，哪些能当证据？",{noNext:true,au:false})}

/* ---------- 如果：两个开关 ---------- */
function vIf(stage,dlg,b){const api=SC.api;const left=Object.keys(STATES).filter(k=>k!=="qin");let step=S.fx[b.id]?3:0;
  const sw=(label,on)=>h("label",{class:"ifsw"},h("input",{type:"checkbox",onchange:on}),h("i"),h("span",{},label));
  const box=h("div",{class:"ifbox"});stage.append(box);const ctr=h("div",{class:"emp"});
  const s1=sw("如果……六国各爱其人",e=>{if(!e.target.checked||step!==0)return;e.target.disabled=true;step=1;left.forEach((k,i)=>setTimeout(()=>{api.unconquer(k);SFX.bell()},i*350));
    playAu("p1");setTimeout(()=>{const[qx,qy]=MP(...STATES.qin.lamp);left.forEach((k,i)=>{const[x,y]=MP(...STATES[k].lamp);const ar=sv("line",{x1:qx,y1:qy,x2:qx,y2:qy,class:"qarrow"});api.s.append(ar);setTimeout(()=>{ar.setAttribute("x2",qx+(x-qx)*.55);ar.setAttribute("y2",qy+(y-qy)*.55)},50+i*80);setTimeout(()=>{ar.setAttribute("x2",qx+(x-qx)*.25);ar.setAttribute("y2",qy+(y-qy)*.25);ar.classList.add("back")},1400+i*80);setTimeout(()=>ar.remove(),3200)})},2400);
    setTimeout(()=>{caption("足以拒秦");speaker(dlg,"du","jj","六国如果都爱自己的百姓，秦就打不进来。现在，关掉它，打开第二个开关。",{noNext:true,au:false});s2.style.display=""},5200)});
  const s2=sw("如果……秦复爱六国之人",e=>{if(!e.target.checked||step!==1)return;e.target.disabled=true;step=2;left.forEach(k=>api.conquer(k));playAu("p2");box.append(ctr,hold);ctr.textContent="秦 · 始皇帝";
    speaker(dlg,"du","jj","秦统一了天下，又爱六国的百姓——按住“传”，看它能传几世。",{noNext:true,au:false})});
  s2.style.display="none";
  const NUM=["二","三","四","五","六","七","八","九","十","百","千","万"];let k=0,holding=false,tm=null;
  const hold=h("button",{class:"go holdbtn"},"按住 · 传");
  const tick=()=>{if(!holding)return;if(k<NUM.length){ctr.textContent=`秦 · ${NUM[k]}世`;SFX.tick();k++;tm=setTimeout(tick,k<9?380:600)}else{holding=false;caption("万世而为君");setTimeout(real,1600)}};
  hold.addEventListener("pointerdown",e=>{e.preventDefault();if(!holding){holding=true;tick()}});["pointerup","pointerleave","pointercancel"].forEach(ev=>hold.addEventListener(ev,()=>{holding=false;clearTimeout(tm)}));
  const real=()=>{hold.remove();ctr.classList.add("real");ctr.innerHTML="";ctr.append(h("b",{},"可是，历史上……"),h("span",{},"秦 · 二世而亡"),h("small",{},"前 221 年统一 — 前 207 年灭亡，只有十五年"));SFX.fall();S.fx[b.id]=1;save();
    speaker(dlg,"du","gk","谁得而族灭也？——如果爱人，谁能灭它？可惜，秦没有。",{next,au:false})};
  gameStop=()=>clearTimeout(tm);
  if(step===3){box.append(ctr);ctr.classList.add("real");ctr.append(h("b",{},"历史上"),h("span",{},"秦 · 二世而亡"));speaker(dlg,"du","gk","只要爱人，就是万世。",{next,au:false});return}
  box.append(s1,s2);speaker(dlg,"du","jj","杜牧在这里做了两个假设。你来打开第一个开关。",{noNext:true,au:false})}

/* ---------- 镜中的后人 ---------- */
function vMirror(stage,dlg,b){const G=[{img:"S8",t:"秦人",line:"秦人不暇自哀——来不及为自己悲哀，就亡了。"},{img:IMG.DM?"DM":"S1",pos:"12% 60%",t:"后人",line:"而后人哀之——杜牧这样的唐朝人，为秦人悲哀。"},{img:"S1",t:"后人的后人",line:"后人哀之而不鉴之——只哀叹，不借鉴……",blur:1},{img:null,t:"镜子前的你",line:"亦使后人而复哀后人也。镜子前的你，会成为哪一种“后人”？"}];
  const glass=h("div",{class:"mglass"});SC.inner.append(h("div",{class:"scn-ov mwrap"},glass));let i=-1;
  const show=k=>{glass.innerHTML="";const g=G[k];if(g.img)glass.append(h("img",{src:IMG[g.img],class:g.blur?"blur":"",style:g.pos?`object-position:${g.pos}`:null,alt:""}));else glass.append(h("div",{class:"myou"},h("b",{},"镜子前的你"),h("span",{},S.name||"")));glass.append(h("div",{class:"mtag"},g.t));SFX.bell();
    speaker(dlg,"du","gk",g.line,{noNext:k<G.length-1,au:false,next:k===G.length-1?()=>{S.fx[b.id]=1;save();next()}:null})};
  const t0=task(stage,"点镜子，看看镜中是谁","");
  const d=hotDot(48,50,"点镜子",()=>{i++;show(i);if(i>=G.length-1){d.remove();t0.remove()}});
  if(S.fx[b.id]){d.remove();show(G.length-1);return}
  speaker(dlg,"du","jj","镜子里照出的，是一代又一代的人。点一点。",{noNext:true,au:false})}


/* ---------- 时光长廊：全文朗读 ---------- */
function vTour(stage,dlg,b){const box=h("div",{class:"scroll tourtx"});const card=h("div",{class:"card slim tourcard"},h("div",{class:"eyebrow"},"全文朗读"),box);stage.append(card);
  const paraOf=g=>PARA.findIndex(p=>p.includes(g));let curP=-1,els={};
  const showPara=pi=>{if(pi===curP)return;curP=pi;box.innerHTML="";els={};box.append(h("p",{class:"tpn"},"第"+"①②③④"[pi]+"段"));PARA[pi].forEach(g=>{const p=rubyLine(P1[g]);els[g]=p;box.append(p)})};
  const go=h("button",{class:"go",disabled:!S.fx[b.id],onclick:()=>{stop&&stop();next()}},"继续 ▸");let stop=null;
  const play=(fromSeg=0)=>{stop&&stop();let si=fromSeg,li=0,dead=false;const run=()=>{if(dead)return;if(si>=b.segs.length){S.fx[b.id]=1;save();go.disabled=false;speaker(dlg,"du","jj","这就是全文。",{noNext:true,au:false,extra:[pbtn,go]});return}
      const[bg,lines]=b.segs[si];if(li===0){ensureScene({bg,cam:{x:45,y:50,z:1.25}});applyCam({x:45,y:50,z:1.25},0);setTimeout(()=>applyCam({x:55,y:48,z:1.05},lines.length*4.5),60)}
      const g=lines[li];showPara(paraOf(g));Object.values(els).forEach(e=>e.classList.remove("hl"));els[g]&&els[g].classList.add("hl");
      kara(els[g],"p"+g,playAu("p"+g,()=>{li++;if(li>=lines.length){li=0;si++}setTimeout(run,300)}))};run();stop=()=>{dead=true;stopAu()};gameStop=stop};
  const pbtn=h("span",{class:"pbtns"},...[0,1,2,3].map(pi=>h("button",{class:"ghost small",onclick:()=>{const si=b.segs.findIndex(s=>s[1].includes(PARA[pi][0]));play(si)}},"重听"+"①②③④"[pi])));
  speaker(dlg,"du","jj","跟着我，把全文听一遍。",{noNext:true,au:false,extra:[pbtn,go]});setTimeout(()=>play(0),400)}

/* ---------- 理解性默写 ---------- */
function vCloze(stage,dlg,b){const done=S.fx[b.id];if(done){speaker(dlg,"fan","kx","理解性默写完成！",{next,au:false});return}
  const order=CLOZE.map((_,i)=>i);let qi=0,right=0;const retry=[];const card=h("div",{class:"card cloze"});stage.append(card);
  const ask=()=>{if(qi>=order.length){S.fx[b.id]=1;save();speaker(dlg,"fan","kx",`理解性默写做完了！第一次就全对的有 ${right} 题。`,{next,au:false});return}
    const i=order[qi];const it=CLOZE[i];const again=qi>=CLOZE.length;card.innerHTML="";const ins=it.a.map(a=>noPaste(h("input",{class:"czin",style:`width:${a.length*1.2+1.2}em`,placeholder:TV?a:""})));
    const line=h("p",{class:"czq"},it.q);ins.forEach((x,k)=>{line.append(x);if(k<ins.length-1)line.append("，")});line.append("。");
    const fb=h("div",{class:"fb"});const sb=h("button",{class:"btn primary",onclick:()=>{let all=true;ins.forEach((x,k)=>{const ok=hanOnly(x.value)===it.a[k];x.classList.toggle("right",ok);x.classList.toggle("wrong",!ok);if(!ok)all=false;x.disabled=true});sb.disabled=true;
      logQ({k:"cz"+i,type:"cloze",ok:all,again});if(all){if(!again)right++;reward(true,!again)}else{reward(false);fb.append(h("p",{class:"bad"},"正确答案："+it.a.join("，")));if(!again)order.push(i)}
      const nb=h("button",{class:"go",onclick:()=>{qi++;ask()}},"下一题 ▸");speaker(dlg,"fan",all?"kx":"yh",all?"一字不差！":"有字写错了，看看正确答案。这题过一会儿再考你一次。",{noNext:true,au:false,extra:[nb]})}},"提交");
    card.append(h("div",{class:"eyebrow"},`理解性默写 ${Math.min(qi+1,CLOZE.length)}/${CLOZE.length}${again?" · 再考一次":""}`),line,h("div",{class:"row"},sb),fb);
    speaker(dlg,"fan","kx","填原句，标点不用写。",{noNext:true,au:false});setTimeout(()=>ins[0].focus({preventScroll:true}),80)};
  ask()}

/* ---------- 分段默写 ---------- */
function vDictate(stage,dlg,b){const R=S.rc[b.id]||(S.rc[b.id]={dict:1,para:b.para,step:0,best:0,att:0,miss:""});const st=R.step;const L=PARA[b.para];const raw=L.map(g=>P1[g]).join("");const exp=hanOnly(raw);
  const card=h("div",{class:"card"},h("div",{class:"eyebrow"},`全文默写 · 第${"①②③④"[b.para]}段`),h("div",{class:"rsteps"},(b.once?["听一遍","首字提示默写"]:["听一遍","首字提示","不看提示"]).map((t,k)=>h("span",{class:k<st?"ok":k===st?"now":""},`${k+1} ${t}`))));stage.append(card);
  const adv=()=>{R.step=(b.once&&R.step>=1)?3:R.step+1;save();render()};
  if(st>=3){card.append(h("p",{},`这一段已过关：${R.best}%`));speaker(dlg,"du","jj","这一段过了。",{next,au:false});return}
  if(st===0){const box=h("div",{class:"scroll"});const els=L.map(g=>{const p=rubyLine(P1[g]);if(b.fresh.includes(g))p.classList.add("fresh");box.append(p);return p});card.append(box,b.fresh.length?h("p",{class:"muted small"},"橙色底的句子前几课没背过，多看两眼。"):null);
    const go=h("button",{class:"go",disabled:true,onclick:()=>{gameStop&&gameStop();adv()}},"听完了 ▸");setTimeout(()=>{go.disabled=false},25000);
    const pb=h("button",{class:"ghost",onclick:()=>{gameStop=playSeq(L.map(g=>"p"+g),(k,au,id)=>{els.forEach(e=>e.classList.remove("hl"));els[k].classList.add("hl");kara(els[k],id,au)},()=>{els.forEach(e=>e.classList.remove("hl"));go.disabled=false})}},"▶ 播放");
    speaker(dlg,"du","jj","先听一遍这一段。",{noNext:true,au:false,extra:[pb,go]});setTimeout(()=>pb.click(),300);return}
  if(st===1)card.append(h("p",{class:"firsth"},[...raw].map((ch,k,arr)=>!/[一-鿿]/.test(ch)?ch:(k===0||!/[一-鿿]/.test(arr[k-1]))?ch:"＿").join("")));
  else card.append(h("p",{class:"muted"},"不看提示，整段默写。标点可以不写。"));
  if(TV)card.append(h("p",{class:"tref"},"原文（教师可见）："+raw));
  const ta=noPaste(h("textarea",{class:"rta",placeholder:"在这里默写"}));ta.value=R.draft||"";ta.addEventListener("input",()=>{R.draft=ta.value;save()});const fb=h("div",{class:"fb"});
  const sb=h("button",{class:"btn primary",onclick:()=>{const got=hanOnly(ta.value);if(got.length<exp.length*.5){toast("还没写完");return}const df=lcsDiff(exp,got);R.att++;R.best=Math.max(R.best,df.score);
    const miss=[...exp].filter((c,k)=>!df.ea[k]).join("");logQ({k:b.id+".s"+st,type:"dictate",ok:df.score>=90,score:df.score});fb.innerHTML="";ta.disabled=sb.disabled=true;
    if(df.score>=90){R.draft="";if(st===2||b.once){R.miss=miss;R.final=df.score}save();if(df.score<100)fb.append(diffView(raw,got,df));speaker(dlg,"du","jj",`${df.score}%，${df.score===100?"一字不差！":"过了。标红的字再看一眼。"}`,{next:adv,au:false})}
    else{fb.append(diffView(raw,got,df));speaker(dlg,"du","gk",`${df.score}%，还差一点（要 90%）。看清错在哪，再写一次。`,{next:()=>render(),nextLabel:"再写一次",au:false})}}},"检查");
  card.append(ta,h("div",{class:"row"},sb),fb);speaker(dlg,"fan","yh",st===1&&b.once?"每句只给第一个字，整段默写！写完这一段就过关。":st===1?"每句只给第一个字，整段默写！":"这次不看提示了，加油！",{noNext:true,au:false});setTimeout(()=>ta.focus({preventScroll:true}),80)}
function vFull(stage,dlg,b){const sc=[0,1,2,3].map(i=>{const r=S.rc["d"+(i+1)];return r?(r.final??r.best):0});const len=PARA.map(L=>hanOnly(L.map(g=>P1[g]).join("")).length);
  const tot=Math.round(sc.reduce((a,v,i)=>a+v*len[i],0)/len.reduce((a,v)=>a+v,0));S.full=tot;save();
  const card=h("div",{class:"card fullcard"},h("div",{class:"eyebrow"},"全文"),h("h2",{},"阿房宫赋 · 杜牧"),...PARA.map((L,i)=>h("p",{class:"fullp",style:`animation-delay:${i*0.8}s`},h("b",{},`${"①②③④"[i]} ${sc[i]}%　`),L.map(g=>P1[g]).join(""))),h("div",{class:"fulltot"},`全文默写 ${tot}%`));stage.append(card);
  SFX.done();speaker(dlg,"du","gk",tot>=90?"整篇《阿房宫赋》，你写下来了。":"写完了。没到九成的段落，可以回去再练。",{next,au:false})}

/* ---------- 键盘 ---------- */
addEventListener("keydown",e=>{const tag=document.activeElement?.tagName;if(["TEXTAREA","INPUT"].includes(tag))return;
  if(/^[1-4]$/.test(e.key)){const b=document.querySelector(`.opt[data-k="${e.key}"]:not([disabled])`);if(b){b.click();e.preventDefault()}return}
  const dk={ArrowUp:"n",ArrowDown:"s",ArrowLeft:"w",ArrowRight:"e"}[e.key];if(dk){const b=document.querySelector(".dp-"+dk);if(b){b.click();e.preventDefault();return}}
  if(e.key==="Enter"||e.key===" "){if(document.activeElement?.classList.contains("holdbtn"))return;const g=document.querySelector(".dlg button.go:not([disabled]):not(.holdbtn)");if(g&&document.activeElement!==g){e.preventDefault();g.click()}}});
render();

if(PROJ){document.addEventListener("keydown",ev=>{if(/INPUT|TEXTAREA|SELECT/.test(ev.target.tagName))return;
  if(["ArrowRight","PageDown"," ","Enter"].includes(ev.key)){const g=[...document.querySelectorAll(".dlg .go, .card .btn.primary")].find(x=>!x.disabled&&x.offsetParent);if(g){ev.preventDefault();g.click()}}
  else if(["ArrowLeft","PageUp"].includes(ev.key)){const p=[...document.querySelectorAll(".tvbar button")].find(x=>x.textContent.includes("上一步"));if(p){ev.preventDefault();p.click()}}
  else if(ev.key==="a"||ev.key==="A"){document.body.classList.toggle("reveal")}})}
