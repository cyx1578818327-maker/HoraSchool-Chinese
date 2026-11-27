FILM.def('f2',{"dur": 85.717, "paras": [{"start": 1.6, "end": 5.643, "chunks": [{"text": "我出生在眉山，就是今天的四川。", "start": 1.6, "end": 5.643}]}, {"start": 6.673, "end": 16.414, "chunks": [{"text": "二十一岁那年，我和弟弟苏辙一起进京赶考", "start": 6.673, "end": 11.859}, {"text": "兄弟俩同榜考中，一时名满京城。", "start": 12.179, "end": 16.414}]}, {"start": 17.444, "end": 26.786, "chunks": [{"text": "后来我到各地做官，也爱写诗。", "start": 17.444, "end": 21.325}, {"text": "有时候，我会在诗里说几句朝廷新法的不是。", "start": 21.825, "end": 26.786}]}, {"start": 27.816, "end": 52.419, "chunks": [{"text": "公元一〇七九年，我正在湖州做官", "start": 27.816, "end": 32.138}, {"text": "有人从我的诗里挑字眼，告我讥讽朝廷。", "start": 32.458, "end": 37.098}, {"text": "我被押进京城，关进御史台的监狱", "start": 37.598, "end": 41.724}, {"text": "一关就是一百多天，差点丢了性命。", "start": 42.044, "end": 46.499}, {"text": "御史台又叫乌台，所以这件事叫做乌台诗案。", "start": 46.999, "end": 52.419}]}, {"start": 53.449, "end": 70.318, "chunks": [{"text": "出狱以后，我被贬到黄州，做一个没有实权的小官。", "start": 53.449, "end": 58.794}, {"text": "俸禄不够一家人吃饭，我就在城东一块坡地上开荒种地", "start": 59.294, "end": 65.606}, {"text": "从此给自己起了个号，叫东坡居士。", "start": 65.926, "end": 70.318}]}, {"start": 71.348, "end": 82.487, "chunks": [{"text": "这是我在黄州写的一幅字，后人叫它《寒食帖》。", "start": 71.348, "end": 76.462}, {"text": "就在黄州，四十七岁那年，我写下了今天这首词。", "start": 76.962, "end": 82.487}]}]},function(L){var C=L.C,S=L.S,mk=L.mk,pos=L.pos,show=L.show,P=L.P,PE=L.PE,K=L.K,txt=L.txt,ap=L.ap,lin=L.lin,ease=L.ease;var D={"dur": 85.717, "paras": [{"start": 1.6, "end": 5.643, "chunks": [{"text": "我出生在眉山，就是今天的四川。", "start": 1.6, "end": 5.643}]}, {"start": 6.673, "end": 16.414, "chunks": [{"text": "二十一岁那年，我和弟弟苏辙一起进京赶考", "start": 6.673, "end": 11.859}, {"text": "兄弟俩同榜考中，一时名满京城。", "start": 12.179, "end": 16.414}]}, {"start": 17.444, "end": 26.786, "chunks": [{"text": "后来我到各地做官，也爱写诗。", "start": 17.444, "end": 21.325}, {"text": "有时候，我会在诗里说几句朝廷新法的不是。", "start": 21.825, "end": 26.786}]}, {"start": 27.816, "end": 52.419, "chunks": [{"text": "公元一〇七九年，我正在湖州做官", "start": 27.816, "end": 32.138}, {"text": "有人从我的诗里挑字眼，告我讥讽朝廷。", "start": 32.458, "end": 37.098}, {"text": "我被押进京城，关进御史台的监狱", "start": 37.598, "end": 41.724}, {"text": "一关就是一百多天，差点丢了性命。", "start": 42.044, "end": 46.499}, {"text": "御史台又叫乌台，所以这件事叫做乌台诗案。", "start": 46.999, "end": 52.419}]}, {"start": 53.449, "end": 70.318, "chunks": [{"text": "出狱以后，我被贬到黄州，做一个没有实权的小官。", "start": 53.449, "end": 58.794}, {"text": "俸禄不够一家人吃饭，我就在城东一块坡地上开荒种地", "start": 59.294, "end": 65.606}, {"text": "从此给自己起了个号，叫东坡居士。", "start": 65.926, "end": 70.318}]}, {"start": 71.348, "end": 82.487, "chunks": [{"text": "这是我在黄州写的一幅字，后人叫它《寒食帖》。", "start": 71.348, "end": 76.462}, {"text": "就在黄州，四十七岁那年，我写下了今天这首词。", "start": 76.962, "end": 82.487}]}]}.dur;
var MAPC='底图：Natural Earth（公有领域）· 示意图';
function tl(r){/* 右侧竖排时间线 */var c={};c.band=pos(mk('div'),1640,0,280,1080);c.band.style.background='linear-gradient(90deg,rgba(242,236,224,0),rgba(242,236,224,.94) 35%)';
 c.ln=pos(mk('div'),1739,190,3,600);c.ln.style.background=C.line;c.nodes=[];
 [['1037','出生 · 眉山'],['1057','进京 · 考中'],['1079','乌台诗案'],['1080','贬到黄州'],['1082','写下这首词']].forEach(function(x,i){var Y=190+i*150;var d=pos(mk('div'),1731,Y-9,18,18);d.style.cssText+=';border-radius:50%;background:'+C.ink;var l=txt('fnsc','<b style="font-size:34px">'+x[0]+'</b><br><span style="font-size:24px;color:'+C.ink2+'">'+x[1]+'</span>',1764,Y-24,160,'line-height:1.15');c.nodes.push([d,l])});return c}
function tlu(t,c,ts,cur){c.band.style.opacity=1;c.nodes.forEach(function(n,i){var a=ap(t,ts[i]);n[0].style.opacity=.25+.75*a;n[1].style.opacity=.25+.75*a;var on=i===cur(t);n[0].style.background=on?C.acc:C.ink;n[0].style.transform='scale('+(on?1.5:1)+')'})}
// A 人物
S(0,P(2)-.4,'苏轼',function(r){var c={};c.f=L.frame('real_sushi',300,90,360,846,'50% 30%');
 c.nm=txt('fmsz','苏轼',820,190,800,'font-size:200px;color:'+C.ink);c.zi=txt('fnsc','字子瞻　·　号东坡居士',830,440,900,'font-size:42px;color:'+C.ink2+';letter-spacing:.1em');
 c.yr=txt('flab','北宋　1037 — 1101',832,520,600,'font-size:26px');c.n=L.note(832,640,800,'他的家乡','眉山 · 今天的四川',C.acc,false,50);return c},
function(t,c){L.kb(c.f,t,0,P(2),1,1.06,0,0,0,10);show(c.f,t,.1,null,0);show(c.nm,t,.4,null,20,1);show(c.zi,t,1);show(c.yr,t,1.4);show(c.n,t,K(1,'眉山')-.3)},'赵孟頫 绘《苏轼像》（元）· 公有领域');
// B 地图：进京、做官、湖州
S(P(2)-.4,K(4,'御史台')-.3,'一路走来',function(r){var c={};c.m=L.map(r);var m=c.m;
 c.ms=L.city(m,'眉山','眉山',{dy:14});c.bj=L.city(m,'汴京','汴京<small>今河南开封</small>',{dy:-74});
 c.r1=L.line(m,[[210,694],[420,560],[760,330],[1154,191]],C.acc,8);
 c.bang=pos(mk('div','ftx fnsc fhalo',null,m.lab),640,80,460);c.bang.style.textAlign='right';c.bang.innerHTML='<div class="flab">一〇五七年</div><div style="font-size:44px;font-weight:700;color:'+C.acc+'">兄弟同榜考中</div><div style="font-size:26px;color:'+C.ink2+'">苏轼　苏辙</div>';
 c.cs=[['杭州','杭州',{dy:10}],['密州','密州',{dy:8}],['徐州','徐州',{}],['湖州','湖州',{dy:-60}]].map(function(x){return L.city(m,x[0],x[1],x[2])});
 c.r2=L.line(m,[[1676,605],[1500,420],[1154,191]],C.ink,7,{dash:'18 12',arrow:true});
 c.ya=pos(mk('div','ftx fnsc',null,m.lab),1360,330,420);c.ya.innerHTML='<div style="font-size:38px;font-weight:700;color:'+C.ink+'">押进京城</div>';
 c.T=tl(r);return c},
function(t,c){var m=c.m;m.keys(t,[[P(2)-.4,960,519,1],[K(3,'各地')-.5,960,519,1],[K(3,'各地')+1.5,1060,450,1.2],[K(4,'湖州')+1,1060,450,1.2]]);
 c.ms.set(1);c.r1.set(lin(t,K(2,'进京'),1.8));c.bj.set(ap(t,K(2,'进京')+1.2));show(c.bang,t,K(2,'同榜')-.2);
 c.cs.forEach(function(x,i){x.set(ap(t,K(3,'各地')+i*.45))});var hz=K(4,'湖州');c.cs[3].l.style.color=t>hz?C.acc:'';c.cs[3].l.style.fontSize=t>hz?'40px':'30px';
 c.r2.set(lin(t,K(4,'押进京城'),1.4));show(c.ya,t,K(4,'押进京城'));
 tlu(t,c.T,[0,K(2,'进京'),K(4,'公元'),1e9,1e9],function(t){return t<K(2,'进京')?0:t<K(4,'公元')?1:2})},MAPC,{cam:false});
// C 乌台
S(K(4,'御史台')-.3,P(5)-.4,'乌台诗案',function(r){r.classList.add('fdk');var c={};c.lamp=pos(mk('div'),560,0,800,1080);c.lamp.style.background='radial-gradient(ellipse at 50% 38%,rgba(255,214,150,.28),rgba(255,214,150,0) 55%)';
 c.t=txt('fmsz','乌台诗案',0,250,1920,'text-align:center;font-size:170px;color:'+C.gold);c.y=txt('fnsc','一〇七九年',0,480,1920,'text-align:center;font-size:36px;color:'+C.ivory+';letter-spacing:.3em');
 c.a=txt('fnsc','',0,600,1920,'text-align:center;font-size:44px;color:'+C.ivory);c.b=txt('fnsc','御史台　又叫　<span style="color:'+C.gold+'">乌台</span>',0,700,1920,'text-align:center;font-size:40px;color:'+C.mute);return c},
function(t,c){c.lamp.style.opacity=.6+.4*Math.sin(t*2.1)*Math.sin(t*1.3);show(c.y,t,K(4,'御史台')-.2);var a0=K(4,'一百多天')-.3;show(c.a,t,a0);c.a.innerHTML='关了 <b style="font-size:72px;color:'+C.gold+'">一百多</b> 天　·　差点丢了性命';show(c.b,t,K(4,'乌台')-.3);show(c.t,t,K(4,'乌台诗案')-.4,null,20,1)},'');
// D 地图：贬黄州
S(P(5)-.4,K(5,'坡地')-.4,'贬到黄州',function(r){var c={};c.m=L.map(r);var m=c.m;c.bj=L.city(m,'汴京','汴京',{dy:-60});c.hz=L.city(m,'黄州','黄州<small>今湖北黄冈</small>',{dy:14});
 c.r=L.line(m,[[1154,191],[1230,420],[1205,650]],C.ink,8,{curve:.15});c.n=L.note(1360,170,520,'官职','黄州团练副使',C.acc,false,46);c.n2=txt('fnsc','一个没有实权的小官',1384,330,500,'font-size:32px;color:'+C.ink2);c.T=tl(r);return c},
function(t,c){c.m.keys(t,[[P(5)-.4,1000,480,1.08],[K(5,'贬到')+1,1150,470,1.4]]);c.bj.set(1);c.r.set(lin(t,K(5,'贬到'),1.6));c.hz.set(ap(t,K(5,'黄州')));show(c.n,t,K(5,'小官')-.8);show(c.n2,t,K(5,'没有实权'));
 tlu(t,c.T,[0,0,0,K(5,'黄州'),1e9],function(){return 3})},MAPC,{cam:false});
// E 东坡
S(K(5,'坡地')-.4,P(6)-.4,'东坡居士',function(r){var c={};var sv=L.svgEl(r,'svg',{viewBox:'0 0 1920 1080',width:1920,height:1080});sv.style.cssText='position:absolute;left:0;top:0';
 var h='<path d="M0,760 C300,600 700,560 1000,640 S1600,760 1920,700 V1080 H0 Z" fill="#D9CDAE"/>';for(var i=0;i<9;i++){h+='<path class="row" d="M'+(120+i*40)+','+(1080-i*8)+' C'+(500+i*30)+','+(760-i*14)+' '+(900+i*20)+','+(700-i*10)+' '+(1300+i*20)+','+(760-i*6)+'" fill="none" stroke="#8C7B57" stroke-width="3" opacity=".55"/>'}
 h+='<circle cx="1560" cy="250" r="70" fill="#F7E7B8" opacity=".9"/>';sv.innerHTML=h;c.rows=[].slice.call(sv.querySelectorAll('.row'));
 c.t=txt('fmsz','东坡',200,150,700,'font-size:230px;color:'+C.ink);c.n=L.note(210,470,700,'城东的一块坡地','开荒　种地',C.acc,false,50);
 c.h=txt('fnsc','从此，自号 <b style="color:'+C.acc+';font-size:56px">东坡居士</b>',210,640,900,'font-size:38px;color:'+C.ink);
 c.fig=pos(mk('div'),1180,250,420,640);c.fig.innerHTML='<img src="'+L.src('sushi_l_kx')+'" style="height:100%;width:100%;object-fit:contain;object-position:bottom;filter:drop-shadow(0 12px 18px rgba(0,0,0,.25))">';return c},
function(t,c){var a=K(5,'坡地')-.4;c.rows.forEach(function(r,i){r.style.opacity=.55*ap(t,a+i*.12)});show(c.t,t,a+.2,null,20,1);show(c.n,t,K(5,'开荒')-.2);show(c.h,t,K(5,'东坡居士')-.4);show(c.fig,t,a+.6,null,20,1)},'示意');
// F 寒食帖
S(P(6)-.4,D+1,'寒食帖',function(r){r.classList.add('fdk');var c={};c.f=L.frame('real_hanshi',300,90,500,858,'50% 0%',true);
 c.t=txt('fmsz','《寒食帖》',930,150,900,'font-size:130px;color:'+C.gold);c.l=txt('flab','苏轼在黄州写的一幅字（局部）　·　台北故宫博物院藏',936,330,900,'color:'+C.mute+';font-size:24px');
 c.n=txt('fnsc','',936,470,900,'font-size:40px;color:'+C.ivory);c.w=L.note(936,640,860,'就在黄州','写下《念奴娇 · 赤壁怀古》',C.gold,true,54);return c},
function(t,c){L.kb(c.f,t,P(6)-.4,D,1,1.12,0,0,0,30);show(c.f,t,P(6)-.4,null,0);show(c.t,t,K(6,'寒食帖')-.4,null,20,1);show(c.l,t,K(6,'寒食帖')+.3);var a=K(6,'四十七岁')-.3;show(c.n,t,a);c.n.innerHTML='一〇八二年　·　<b style="font-size:76px;color:'+C.gold+'">'+Math.round(47*ease((t-a)/1.2))+'</b> 岁';show(c.w,t,K(6,'今天这首词')-.4)},'苏轼《寒食帖》（局部）· 公有领域');
});
