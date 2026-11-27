FILM.def('f1',{"dur": 70.719, "paras": [{"start": 1.6, "end": 5.455, "chunks": [{"text": "先说一场比我早八百多年的大仗。", "start": 1.6, "end": 5.455}]}, {"start": 6.485, "end": 16.017, "chunks": [{"text": "公元二〇八年，曹操统一了北方", "start": 6.485, "end": 10.952}, {"text": "带着大军沿长江南下，号称八十万。", "start": 11.272, "end": 16.017}]}, {"start": 17.047, "end": 28.398, "chunks": [{"text": "南边的孙权和刘备联起手来，人马只有几万。", "start": 17.047, "end": 22.418}, {"text": "孙权这边的统帅，就是周瑜，那年他三十四岁。", "start": 22.918, "end": 28.398}]}, {"start": 29.428, "end": 46.067, "chunks": [{"text": "两军在长江边的赤壁相遇。", "start": 29.428, "end": 32.928}, {"text": "曹操的战船一艘挨着一艘，首尾相连。", "start": 33.428, "end": 38.238}, {"text": "周瑜看准了这一点，派黄盖假装投降，乘着东南风，放火烧船。", "start": 38.738, "end": 46.067}]}, {"start": 47.097, "end": 58.108, "chunks": [{"text": "一夜之间，江上火光冲天，曹军大败，退回了北方。", "start": 47.097, "end": 53.39}, {"text": "从此，天下三分的局面慢慢形成。", "start": 53.89, "end": 58.108}]}, {"start": 59.138, "end": 67.489, "chunks": [{"text": "你们记住这个人：周瑜。", "start": 59.138, "end": 62.093}, {"text": "年纪轻轻，谈笑之间，就打赢了这一仗。", "start": 62.593, "end": 67.489}]}]},function(L){var C=L.C,S=L.S,mk=L.mk,pos=L.pos,show=L.show,P=L.P,K=L.K,txt=L.txt,ap=L.ap,lin=L.lin,ease=L.ease;var D={"dur": 70.719, "paras": [{"start": 1.6, "end": 5.455, "chunks": [{"text": "先说一场比我早八百多年的大仗。", "start": 1.6, "end": 5.455}]}, {"start": 6.485, "end": 16.017, "chunks": [{"text": "公元二〇八年，曹操统一了北方", "start": 6.485, "end": 10.952}, {"text": "带着大军沿长江南下，号称八十万。", "start": 11.272, "end": 16.017}]}, {"start": 17.047, "end": 28.398, "chunks": [{"text": "南边的孙权和刘备联起手来，人马只有几万。", "start": 17.047, "end": 22.418}, {"text": "孙权这边的统帅，就是周瑜，那年他三十四岁。", "start": 22.918, "end": 28.398}]}, {"start": 29.428, "end": 46.067, "chunks": [{"text": "两军在长江边的赤壁相遇。", "start": 29.428, "end": 32.928}, {"text": "曹操的战船一艘挨着一艘，首尾相连。", "start": 33.428, "end": 38.238}, {"text": "周瑜看准了这一点，派黄盖假装投降，乘着东南风，放火烧船。", "start": 38.738, "end": 46.067}]}, {"start": 47.097, "end": 58.108, "chunks": [{"text": "一夜之间，江上火光冲天，曹军大败，退回了北方。", "start": 47.097, "end": 53.39}, {"text": "从此，天下三分的局面慢慢形成。", "start": 53.89, "end": 58.108}]}, {"start": 59.138, "end": 67.489, "chunks": [{"text": "你们记住这个人：周瑜。", "start": 59.138, "end": 62.093}, {"text": "年纪轻轻，谈笑之间，就打赢了这一仗。", "start": 62.593, "end": 67.489}]}]}.dur;
var MAPC='底图：Natural Earth（公有领域）· 示意图';
// A 片头
S(0,P(2)-.4,'',function(r){r.classList.add('fdk');var c={};c.bg=L.bg('E2','50% 50%','brightness(.32) saturate(.6) blur(1px)');
 c.t=txt('fmsz','赤壁之战',0,300,1920,'text-align:center;font-size:190px;color:'+C.gold+';letter-spacing:.12em');
 c.s=txt('fnsc','东汉末年　·　公元 208 年',0,540,1920,'text-align:center;font-size:36px;color:'+C.ivory+';letter-spacing:.2em');
 c.ln=pos(mk('div'),860,610,200,2);c.ln.style.background=C.gold;
 c.n=txt('fnsc','',0,650,1920,'text-align:center;font-size:40px;color:'+C.mute);return c},
function(t,c){L.kb(c.bg,t,0,P(2),1.08,1.0);show(c.t,t,.2,null,20,1.2);show(c.s,t,1.0);c.ln.style.opacity=ap(t,1.2,.8);c.ln.style.transform='scaleX('+ap(t,1.2,1)+')';
 var a=show(c.n,t,K(1,'八百多年')-.3);c.n.innerHTML='比苏轼写这首词早 <b style="color:'+C.gold+';font-size:56px">'+Math.round(874*ease((t-K(1,'八百多年')+.3)/1.6))+'</b> 年'},'示意插画');
// B 地图：南下、联手、周瑜
S(P(2)-.4,P(4)-.4,'曹操南下',function(r){var c={};c.m=L.map(r);var m=c.m;
 c.north=L.svgEl(m.ov,'path',{d:'M640,0 H1920 V330 Q1500,380 1200,360 Q900,350 640,300 Z',fill:'#B9A57C',opacity:.18});
 c.nl=L.city(m,'',' 北方　曹操',{at:[1000,120],r:0,cls:'big'});c.nl.l.style.fontSize='46px';c.nl.l.style.color='#5A4636';
 c.a1=L.line(m,[[1113,272],[1040,470],[968,664],[1086,704]],'#5A4636',9);
 c.xu=L.city(m,'许昌','许昌',{col:'#5A4636'});c.jl=L.city(m,'江陵','江陵',{dx:-20,dy:-62,right:true});
 c.n80=txt('fnsc','',0,0,340,'font-size:40px;color:#5A4636;font-weight:700;text-align:right');m.lab.appendChild(c.n80);pos(c.n80,660,430);
 c.cs=L.city(m,'柴桑','柴桑',{col:C.acc,dy:14});c.xk=L.city(m,'夏口','夏口',{col:C.acc,dy:-58});
 c.a2=L.line(m,[[1306,730],[1112,716]],C.acc,8,{curve:.18});c.a3=L.line(m,[[1152,638],[1104,704]],C.acc,8,{curve:-.2});
 c.cb=L.city(m,'战场赤壁','赤壁',{col:C.ink,dx:-10,dy:24,right:true});c.cb.l.style.fontSize='38px';
 c.jw=txt('fnsc','',0,0,360,'font-size:40px;color:'+C.acc+';font-weight:700');c.jw.style.position='absolute';m.lab.appendChild(c.jw);pos(c.jw,1130,800);
 c.pz=pos(mk('div'),1450,150,330,330);c.pz.style.cssText+=';border-radius:50%;overflow:hidden;border:8px solid #FBF8F1;box-shadow:0 16px 40px rgba(60,40,20,.3)';c.pz.innerHTML='<img src="'+L.src('E3')+'" style="width:300%;margin-left:-38%;margin-top:-8%">';
 c.pzt=txt('fnsc','',1380,500,470,'text-align:center');return c},
function(t,c){var m=c.m;m.keys(t,[[P(2)-.4,960,519,1],[P(3)-.2,960,519,1],[P(3)+1.4,1150,640,1.55],[P(4),1150,640,1.6]]);
 c.north.style.opacity=.2*ap(t,K(2,'曹操'),.8);c.nl.set(ap(t,K(2,'统一了北方'),.6));c.xu.set(ap(t,K(2,'带着大军')-.3));
 c.a1.set(lin(t,K(2,'带着大军'),K(2,'南下')+1.2-K(2,'带着大军')));c.jl.set(ap(t,K(2,'沿长江')));
 var a=ap(t,K(2,'八十万')-.2);c.n80.style.opacity=a;c.n80.innerHTML='号称 <span style="font-size:64px">'+Math.round(80*ease((t-K(2,'八十万')+.2)/1.2))+'</span> 万';
 c.cs.set(ap(t,K(3,'孙权')));c.xk.set(ap(t,K(3,'刘备')));var f=lin(t,K(3,'联起手来'),1.4);c.a2.set(f);c.a3.set(f);c.cb.set(ap(t,K(3,'联起手来')+.8));
 c.jw.style.opacity=ap(t,K(3,'几万')-.2);c.jw.textContent='只有几万';
 show(c.pz,t,K(3,'周瑜')-.3,null,20,.8);c.pz.style.transform+=' scale('+(.85+.15*ap(t,K(3,'周瑜')-.3,.8))+')';
 show(c.pzt,t,K(3,'周瑜'));c.pzt.innerHTML='<div class="fmsz" style="font-size:84px;color:'+C.ink+'">周瑜</div><div class="flab">孙权的统帅</div><div style="font-size:44px;font-weight:700;color:'+C.acc+';margin-top:6px">'+(t>K(3,'三十四岁')-.2?Math.round(34*ease((t-K(3,'三十四岁')+.2)/1)):'')+(t>K(3,'三十四岁')-.2?' 岁':'')+'</div>'},MAPC,{cam:false});
// C 火攻示意
S(P(4)-.4,P(5)-.4,'火攻',function(r){var c={};var sv=L.svgEl(r,'svg',{viewBox:'0 0 1920 1080',width:1920,height:1080});sv.style.cssText='position:absolute;left:0;top:0';c.sv=sv;
 var h='<defs><linearGradient id="rv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9DB5B8"/><stop offset="1" stop-color="#7E9EA6"/></linearGradient><radialGradient id="fg"><stop offset="0" stop-color="#FFD27A" stop-opacity=".95"/><stop offset=".4" stop-color="#E8782E" stop-opacity=".55"/><stop offset="1" stop-color="#B5452F" stop-opacity="0"/></radialGradient></defs>';
 h+='<path d="M0,300 C400,280 800,330 1200,300 S1700,280 1920,310 V760 C1500,790 1100,740 700,770 S200,790 0,760 Z" fill="url(#rv)"/>';
 for(var i=0;i<14;i++){var y=340+i*30;h+='<path class="wv" d="M'+(-200+(i*97)%300)+','+y+' q40,-10 80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0" fill="none" stroke="#EAF0EE" stroke-width="2" opacity=".35"/>'}
 sv.innerHTML=h;c.wv=[].slice.call(sv.querySelectorAll('.wv'));
 function boat(x,y,s,col){var g=L.svgEl(sv,'g',{transform:'translate('+x+','+y+') scale('+s+')'});g.innerHTML='<path d="M-60,0 L60,0 L44,22 L-44,22 Z" fill="'+col+'"/><path d="M0,0 V-70" stroke="'+col+'" stroke-width="5"/><path d="M4,-66 L46,-18 L4,-14 Z" fill="#F4EEE2" stroke="'+col+'" stroke-width="3"/>';return g}
 c.cao=[];for(var i=0;i<9;i++)c.cao.push(boat(470+i*130,440,1,'#5A4636'));
 c.chain=L.svgEl(sv,'path',{d:'M470,452 H1510',stroke:'#3A2F24','stroke-width':6,'stroke-dasharray':'14 8',fill:'none'});
 c.hg=[];for(var i=0;i<3;i++)c.hg.push(boat(0,0,.8,C.acc));
 c.fire=[];for(var i=0;i<9;i++){var f=L.svgEl(sv,'circle',{cx:470+i*130,cy:410,r:120,fill:'url(#fg)'});c.fire.push(f)}
 c.wind=[];for(var i=0;i<4;i++){var w=L.svgEl(sv,'path',{d:'M0,0 C-60,-30 -120,-40 -200,-90',stroke:C.ink2,'stroke-width':4,fill:'none','stroke-linecap':'round','stroke-dasharray':'2 0'});c.wind.push(w)}
 c.n1=txt('fnsc','北岸 · 曹军',80,200,500,'font-size:34px;font-weight:700;color:#5A4636');c.n2=txt('fnsc','南岸 · 孙刘联军',80,800,600,'font-size:34px;font-weight:700;color:'+C.acc);
 c.k1=L.note(1260,110,560,'船','一艘挨着一艘　首尾相连','#5A4636',false,38);c.k2=L.note(1260,800,560,'计','黄盖假装投降',C.acc,false,38);
 c.wl=txt('fnsc','东南风 ↖',1560,640,300,'font-size:40px;font-weight:700;color:'+C.ink2);return c},
function(t,c){c.wv.forEach(function(w,i){w.setAttribute('transform','translate('+(-((t*30+i*20)%160))+',0)')});
 var a0=K(4,'战船');c.cao.forEach(function(b,i){b.style.opacity=ap(t,a0+i*.12,.5)});c.n1.style.opacity=ap(t,P(4));c.n2.style.opacity=ap(t,P(4)+.4);
 var ch=ap(t,K(4,'首尾相连')-.2,.8);c.chain.style.opacity=ch;show(c.k1,t,K(4,'首尾相连')-.2,K(4,'放火烧船')-.3);
 var g0=K(4,'黄盖');show(c.k2,t,g0-.2,K(4,'放火烧船')-.3);var gf=lin(t,g0,K(4,'放火烧船')+.6-g0);
 c.hg.forEach(function(b,i){var x=1850-gf*(330+i*40)-i*60,y=700-gf*200+i*36;b.setAttribute('transform','translate('+x+','+y+') scale(.8)');b.style.opacity=ap(t,g0+i*.15,.5)});
 var w0=K(4,'东南风');c.wl.style.opacity=ap(t,w0)*(1-ap(t,PE(4)+.3));c.wind.forEach(function(w,i){var f=lin(t,w0+i*.25,1.2);w.setAttribute('transform','translate('+(1760-i*260-f*120)+','+(880-i*40-f*60)+')');w.style.opacity=f*(1-lin(t,w0+i*.25+1.6,.8))*.8});
 var f0=K(4,'放火烧船');c.fire.forEach(function(f,i){var o=ap(t,f0+i*.18,.8);var fl=1+.08*Math.sin(t*9+i*2);f.setAttribute('r',(60+70*o)*fl);f.style.opacity=o*.95})},'示意图',{cam:{s1:1.03}});
function PE(i){return L.PE(i)}
// D 大败、三分
S(P(5)-.4,P(6)-.4,'天下三分',function(r){r.classList.add('fdk');var c={};c.bg=L.bg('E3','50% 50%','brightness(.75)');c.sh=pos(mk('div'),0,0,1920,1080);c.sh.style.background='linear-gradient(90deg,rgba(21,17,13,0) 30%,rgba(21,17,13,.85) 75%)';
 c.n=L.note(1180,200,640,'一夜之间','曹军大败，退回北方',C.gold,true,52);
 c.three=txt('fmsz','魏　蜀　吴',1180,560,700,'font-size:120px;color:'+C.gold+';letter-spacing:.06em');c.tl=txt('fnsc','天下三分的局面慢慢形成',1184,730,640,'font-size:34px;color:'+C.ivory);return c},
function(t,c){L.kb(c.bg,t,P(5)-.4,P(6),1.02,1.1,0,-40);c.sh.style.opacity=ap(t,K(5,'曹军大败')-.6,1);show(c.n,t,K(5,'曹军大败')-.2);var a=K(5,'天下三分')-.3;show(c.three,t,a,null,20,1);show(c.tl,t,a+.6)},'示意插画',{cam:false});
// E 周瑜
S(P(6)-.4,D+1,'周瑜',function(r){r.classList.add('fdk');var c={};c.f=L.frame('E3',170,120,640,780,'18% 40%',true);
 c.nm=txt('fmsz','周瑜',940,170,800,'font-size:190px;color:'+C.gold);c.lb=txt('flab','东吴统帅　·　赤壁之战时 34 岁',948,420,800,'color:'+C.mute+';font-size:26px');
 c.q=L.note(948,540,860,'课本第 79 页 · 原词','谈笑间、强虏灰飞烟灭',C.gold,true,58);return c},
function(t,c){L.kb(c.f,t,P(6)-.4,D,1.0,1.08);show(c.f,t,P(6)-.4,null,0);show(c.nm,t,K(6,'周瑜')-.2,null,20,.9);show(c.lb,t,K(6,'年纪轻轻'));show(c.q,t,K(6,'谈笑之间')-.2)},'示意插画');
});
