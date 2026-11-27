/* ============ 教师预览：跳转、跳过、显示答案 ============ */
const GAME_T=["tour","cloze","dictate","fulltext","case","ifswitch","mirror","halfrelay","carts","thunder","wait","flip","take","spend","balance","anger","fires","burn","hot","punct","map6","chop","cover","route","canal","walk","find","scratch","slider","recite","pair","order","write","zoom"];
function tvLabels(){let chap="";return BEATS.map((b,i)=>{if(b.t==="scene"){chap=b.chap;return null}
  const nm={say:"对话",read:"听原文",ask:"题",fix:NAME.fan+"说错",hot:"点画面",sort:"分一分",punct:"断句",map6:"熄灭六国",chop:"砍树",cover:"铺屋顶",route:"北构西折",canal:"引二川",walk:"五步一楼",find:"画中找",zoom:"登高看",scratch:"擦云雾",slider:"冷暖滑块",pair:"比喻配对",order:"排一排",write:"写一写",recite:"背诵接龙",test:"过关检测",end:"结尾",halfrelay:"背诵接龙（半句）",carts:"辇来于秦",thunder:"听宫车",wait:"等三十六年",flip:"翻宝物",take:"取之尽锱铢",spend:"用之如泥沙",balance:"天平六个多于",anger:"不敢言而敢怒",fires:"三处火",burn:"一炬焦土",case:"判案",ifswitch:"两个如果",mirror:"镜中的后人",tour:"全文朗读",cloze:"理解性默写",dictate:"分段默写",fulltext:"全文合成"}[b.t]||b.t;
  let d=b.t==="say"?b.text:b.t==="read"?b.title:(b.t==="ask"||b.t==="fix")?(ATOMS[b.a].k==="w"?ATOMS[b.a].c+"（"+ATOMS[b.a].s+"）":ATOMS[b.a].v[0].q):b.q||"";
  return {i,chap,txt:`${nm}${d?"："+d.slice(0,22):""}`}}).filter(Boolean)}
function tvJump(i){S.q=BEATS.map((b,k)=>({b:k}));
  BEATS.forEach((b,k)=>{if(!b.id&&b.t!=="hot")return;const before=k<i;
    if(b.t==="hot"){S.hot[b.id]=before?b.spots.map((_,j)=>j):[]}else if(b.t==="recite"){if(!before)delete S.rc[b.id]}else{if(before)S.fx[b.id]=1;else delete S.fx[b.id]}});
  ["m6","chop","cover","route","canal","sl"].forEach(id=>{const k=BEATS.findIndex(b=>b.id===id);if(k>=0){if(k<i)S.fx[id]=1;else delete S.fx[id]}});
  /* 往回跳时，重建场景 */
  S.pos=i;S.built=LESSON.built0?(BEATS.slice(0,i).some(b=>b.t==="burn")?[]:LESSON.built0.slice()):Object.entries(REGIONS).map(([k])=>k).filter(k=>BEATS.slice(0,i).some(b=>b.reveal===k));
  S.test={round:0};SC.key=null;save();render()}
function tvSkip(){const it=S.q[S.pos],b=beatOf(it);if(b.id&&GAME_T.includes(b.t)&&b.t!=="recite")S.fx[b.id]=1;if(b.t==="hot")S.hot[b.id]=b.spots.map((_,j)=>j);
  if(b.t==="recite"){const R=S.rc[b.id]||(S.rc[b.id]={step:0,best:0,att:0});if(R.step<3){R.step++;save();return render()}}
  next()}
function teacherBar(){const L=tvLabels();const cur=S.q[S.pos].b;const sel=h("select",{class:"tvsel","aria-label":"跳到"});let og=null,last="";
  L.forEach(x=>{if(x.chap!==last){og=h("optgroup",{label:x.chap});sel.append(og);last=x.chap}og.append(h("option",{value:x.i,selected:x.i===cur?true:null},`${x.i}　${x.txt}`))});
  sel.addEventListener("change",()=>tvJump(+sel.value));
  const b=beatOf(S.q[S.pos]);let rcSel=null;
  if(b.t==="recite"){const R=S.rc[b.id]||{step:0};rcSel=h("select",{class:"tvsel small"},["1 听两遍","2 接龙·有提示","3 接龙·首字","4 不看提示"].map((t,k)=>h("option",{value:k,selected:k===R.step?true:null},t)));
    rcSel.addEventListener("change",()=>{const R2=S.rc[b.id]||(S.rc[b.id]={step:0,best:0,att:0});R2.step=+rcSel.value;save();render()})}
  return h("div",{class:"tvbar"},h("b",{},window.PROJ?"投屏":"教师预览"),sel,rcSel,
    h("button",{onclick:()=>{for(let k=S.pos-1;k>=0;k--){const x=S.q[k];if(x.b!=null&&BEATS[x.b].t!=="scene"){tvJump(x.b);return}}}},"◀ 上一步"),
    h("button",{onclick:tvSkip},"跳过 ▶"),
    h("button",{onclick:()=>tvJump(cur!=null?cur:S.q.findIndex(()=>true))},"重来这一步"),
    window.PROJ?h("button",{class:"tvans",onclick:()=>document.body.classList.toggle("reveal")},"显示/隐藏答案"):h("span",{class:"tvhint"},"绿色虚线框 = 正确答案"))}
