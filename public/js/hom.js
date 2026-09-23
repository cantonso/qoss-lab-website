/* ---------- pixel HOM experiment (logical 240×84 px) ---------- */
function startHOM(){
  const cv=document.getElementById("hom");if(!cv)return null;
  const ctx=cv.getContext("2d");ctx.imageSmoothingEnabled=false;
  const W=240,H=84;
  const C={bg:"#0E1420",dot:"#18223A",path:"#2B3A5A",ink:"#C9D3E3",dim:"#6F7E97",det:"#AFBBD0",flash:"#FFD84D",bs:"#9FE7F5",
           red:"#FF4D63",redG:"#7A2233",blue:"#4DA3FF",blueG:"#1F3F6E",bar:"#8FB8FF"};
  const F={A:"010101111101101",B:"110101110101110",C:"011100100100011",D:"110101101101110",E:"111100110100111",F:"111100110100100",G:"011100101101011",
    H:"101101111101101",I:"111010010010111",K:"101101110101101",L:"100100100100111",M:"101111111101101",N:"110101101101101",
    O:"010101101101010",P:"110101110100100",R:"110101110101101",S:"011100010001110",T:"111010010010010",U:"101101101101111",X:"101101010101101",Y:"101101010010010",
    "0":"111101101101111","1":"010110010010111","2":"110001010100111","3":"110001010001110","4":"101101111001001","5":"111100110001110",
    "6":"011100111101111","7":"111001010010010","8":"111101111101111","9":"111101111001110","!":"010010010000010",".":"000000000000010",
    "(":"001010010010001",")":"100010010010100","=":"000111000111000","-":"000000111000000",":":"000010000010000","→":"000010111010000"," ":"000000000000000"};
  const px=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(x|0,y|0,w,h)};
  const text=(s,x,y,c)=>{for(const ch of s.toUpperCase()){const g=F[ch]||F[" "];for(let i=0;i<15;i++)if(g[i]==="1")px(x+i%3,y+(i/3|0),1,1,c);x+=4}};

  /* geometry: S1 from the left, S2 from the top, "\" beamsplitter, D1 right, D2 below */
  const cx=78,cy=42, S1={x:8,y:cy-5}, S2={x:cx-4,y:3}, D1={x:128,y:cy-6}, D2={x:cx-4,y:68};
  const LIN=60, OUT_R=D1.x-cx-2, OUT_D=D2.y-cy-2;
  const col=()=>Math.random()<.5?"red":"blue";

  /* quantum rule: identical photons always leave together (HOM); distinguishable ones split 25/25/25/25 */
  function outcome(c1,c2){
    if(c1===c2){const d=Math.random()<.5?"r":"d";return [d,d]}
    const t1=Math.random()<.5,t2=Math.random()<.5;             // transmitted?
    return [t1?"r":"d", t2?"d":"r"];                            // S1: T→right,R→down ; S2: T→down,R→right
  }
  const st={same:0,sameC:0,diff:0,diffC:0};
  function trial(){const a=col(),b=col(),[o1,o2]=outcome(a,b),c=o1!==o2;if(a===b){st.same++;if(c)st.sameC++}else{st.diff++;if(c)st.diffC++}}

  let ev=null,wait=8,f1=0,f2=0,n1=0,n2=0,msg="",msgT=0,msgC=C.ink;
  function spawn(){const a=col(),b=col(),[o1,o2]=outcome(a,b);
    ev={p:[{c:a,o:o1},{c:b,o:o2}],r:LIN,s:0,phase:"in"};
    if(a===b){st.same++;if(o1!==o2)st.sameC++}else{st.diff++;if(o1!==o2)st.diffC++}}
  function step(){
    for(let i=0;i<25;i++)trial();
    if(f1)f1--;if(f2)f2--;if(msgT)msgT--;
    if(!ev){if(--wait<=0){spawn();wait=22}return}
    if(ev.phase==="in"){ev.r-=2;if(ev.r<=0){ev.r=0;ev.phase="out"}return}
    ev.s+=2;
    const done=ev.p.every(q=>ev.s>=(q.o==="r"?OUT_R:OUT_D));
    for(const q of ev.p){if(!q.hit&&ev.s>=(q.o==="r"?OUT_R:OUT_D)){q.hit=1}}
    if(done){
      const r=ev.p.filter(q=>q.o==="r").length,d=2-r;
      if(r){f1=18;n1+=1}if(d){f2=18;n2+=1}
      const same=ev.p[0].c===ev.p[1].c;
      if(r===1){msg="COINCIDENCE";msgC=C.flash}else{msg=same?"BUNCHED!":"SAME PORT";msgC=same?"#C69BFF":C.ink}
      msgT=34;ev.flashR=r;ev.flashD=d;lastR=r;lastD=d;ev=null;
    }
  }
  let lastR=0,lastD=0;
  function photon(x,y,c,dx=0,dy=0){const g=c==="red"?C.redG:C.blueG,k=c==="red"?C.red:C.blue;x+=dx;y+=dy;
    px(x-2,y-1,5,3,g);px(x-1,y-2,3,5,g);px(x-1,y-1,3,3,k);px(x,y,1,1,"#FFFFFF")}
  function detector(d,label,flash,count,left,nph){
    const c=flash?C.flash:C.det;px(d.x,d.y,8,12,c);px(d.x+8,d.y+2,2,8,c);px(d.x+2,d.y+2,4,8,flash?"#FFF3B0":C.bg);
    if(left){text(label,d.x-11,d.y+1,C.ink)}else{text(label,d.x+1,d.y-7,C.ink)}
    if(flash&&nph)text(nph===2?"X2":"X1",left?d.x+13:d.x+13,left?d.y+4:d.y+4,nph===2?"#C69BFF":C.flash);
  }
  function draw(){
    px(0,0,W,H,C.bg);
    for(let y=3;y<H;y+=6)for(let x=3;x<W;x+=6)px(x,y,1,1,C.dot);
    px(S1.x+9,cy,D1.x-S1.x-10,1,C.path);px(cx,S2.y+11,1,D2.y-S2.y-11,C.path);
    const src=(s,lab,lx,ly,on)=>{px(s.x,s.y,9,11,C.path);px(s.x+1,s.y+1,7,9,C.bg);px(s.x+3,s.y+3,3,5,on?"#FFF1C4":"#E8C170");text(lab,lx,ly,C.ink)};
    const in1=ev&&ev.phase==="in"&&ev.r>LIN-6, in2=ev&&ev.phase==="in"&&ev.r>LIN/2-6&&ev.r<=LIN/2;
    src(S1,"S1",S1.x+1,S1.y-7,in1);src(S2,"S2",S2.x-11,S2.y+3,in2);
    px(cx-8,cy-8,17,17,C.path);px(cx-7,cy-7,15,15,C.bg);for(let i=0;i<15;i++)px(cx-7+i,cy-7+i,1,1,C.bs);
    text("BS",cx+12,cy-14,C.ink);
    detector(D1,"D1",f1,n1,false,lastR);detector(D2,"D2",f2,n2,true,lastD);
    if(ev){
      if(ev.phase==="in"){photon(cx-ev.r,cy,ev.p[0].c);if(ev.r<=LIN/2)photon(cx,cy-ev.r,ev.p[1].c)}
      else{const pos=q=>q.o==="r"?[cx+Math.min(ev.s,OUT_R),cy]:[cx,cy+Math.min(ev.s,OUT_D)];
        const [a,b]=ev.p,pa=pos(a),pb=pos(b),together=a.o===b.o;
        photon(pa[0],pa[1],a.c,together?(a.o==="r"?0:-1):0,together?(a.o==="r"?-1:0):0);
        photon(pb[0],pb[1],b.c,together?(b.o==="r"?0:1):0,together?(b.o==="r"?1:0):0);}
    }
    if(msgT&&msgT%6<5)text(msg,96,58,msgC);
    /* panel: P(coincidence) for same vs different colours */
    const hx=162,base=68,hh=48;
    text("P(COINCIDENCE)",hx,4,C.ink);
    const half=base-hh/2;for(let x=hx;x<hx+72;x+=3)px(x,half,2,1,C.dim);text("0.5",hx-14,half-2,C.dim);
    px(hx,base+1,72,1,C.dim);
    const bar=(x,p,c)=>{const h=Math.round(p*hh);if(h>0)px(x,base+1-h,18,h,c);else px(x,base,18,1,c);text(p.toFixed(2),x+1,base-h-7,C.ink)};
    const ps=st.same?st.sameC/st.same:0,pd=st.diff?st.diffC/st.diff:0;
    bar(hx+8,ps,"#C69BFF");bar(hx+44,pd,C.bar);
    const sw=(x,c1,c2)=>{px(x,base+4,3,3,c1);px(x+4,base+4,3,3,c2)};
    sw(hx+6,C.red,C.red);px(hx+14,base+5,1,1,C.dim);sw(hx+16,C.blue,C.blue);text("SAME",hx+9,base+9,C.dim);
    sw(hx+44,C.red,C.blue);sw(hx+54,C.blue,C.red);text("DIFF",hx+45,base+9,C.dim);
  }
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  for(let i=0;i<3000;i++)trial();
  if(reduce){draw();return()=>{}}
  let raf=0,last=0;const tick=t=>{if(t-last>=33){step();draw();last=t}raf=requestAnimationFrame(tick)};
  draw();raf=requestAnimationFrame(tick);return()=>cancelAnimationFrame(raf);
}
