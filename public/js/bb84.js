/* ---------- pixel BB84 with an intercept-resend Eve (logical 240×84 px) ---------- */
function startBB84(){
  const cv=document.getElementById("bb84");if(!cv)return null;
  const ctx=cv.getContext("2d");ctx.imageSmoothingEnabled=false;
  const W=240,H=84;
  const C={bg:"#0E1420",dot:"#18223A",path:"#2B3A5A",ink:"#C9D3E3",dim:"#6F7E97",flash:"#FFD84D",
           red:"#FF4D63",redG:"#7A2233",blue:"#4DA3FF",blueG:"#1F3F6E",ok:"#5BD17A",bad:"#FF4D63",
           alice:"#FF8FA3",bob:"#8FB8FF",eve:"#C69BFF",eveDim:"#4A3D66"};
  const F={A:"010101111101101",B:"110101110101110",C:"011100100100011",D:"110101101101110",E:"111100110100111",
    F:"111100110100100",G:"011100101101011",H:"101101111101101",I:"111010010010111",K:"101101110101101",
    L:"100100100100111",M:"101111111101101",N:"110101101101101",O:"010101101101010",P:"110101110100100",
    Q:"010101101110011",R:"110101110101101",S:"011100010001110",T:"111010010010010",U:"101101101101111",
    V:"101101101101010",W:"101101101111101",X:"101101010101101",Y:"101101010010010",Z:"111001010100111",
    "0":"111101101101111","1":"010110010010111","2":"110001010100111","3":"110001010001110","4":"101101111001001",
    "5":"111100110001110","6":"011100111101111","7":"111001010010010","8":"111101111101111","9":"111101111001110",
    "!":"010010010000010",".":"000000000000010",":":"000010000010000","=":"000111000111000","+":"000010111010000",
    "-":"000000111000000","%":"101001010100101","?":"110001010000010"," ":"000000000000000"};
  const px=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(x|0,y|0,w,h)};
  const text=(s,x,y,c)=>{for(const ch of s.toUpperCase()){const g=F[ch]||F[" "];for(let i=0;i<15;i++)if(g[i]==="1")px(x+i%3,y+(i/3|0),1,1,c);x+=4}};
  /* 5×5 polarisation glyphs: H — , V | , D / , A \ ; bases + and × */
  const G5={H:"0000000000111110000000000",V:"0010000100001000010000100",D:"0000100010001000100010000",
            A:"1000001000001000001000001",R:"0010000100111110010000100",X:"1000101010001000101010001"};
  const glyph=(k,x,y,c)=>{const g=G5[k];for(let i=0;i<25;i++)if(g[i]==="1")px(x+i%5,y+(i/5|0),1,1,c)};
  const SPR=["0011100","0111110","0111110","0011100","0001000","1111111","0111110","0111110","0100010","0100010"];
  const sprite=(x,y,c)=>{for(let r=0;r<10;r++)for(let k=0;k<7;k++)if(SPR[r][k]==="1")px(x+k,y+r,1,1,c)};
  /* basis 0 = rectilinear (+), 1 = diagonal (×); bit 0 → H or D, bit 1 → V or A */
  const st=(b,v)=>b===0?(v?"V":"H"):(v?"A":"D");
  const bas=b=>b===0?"R":"X";
  const bsym=b=>b===0?"+":"X";
  const rnd=()=>Math.random()<.5?1:0;

  /* layout */
  const LY=18, AX=24, EX=86, BX=146, PX=174;
  /* sessions: Eve asleep, then Eve intercepting half of the photons */
  const ROUNDS=6; let eveP=0, sessionLeft=ROUNDS;
  const stats={sift:0,err:0};
  function measure(sb,sv,mb){return mb===sb?sv:rnd()}
  function trial(){
    const ab=rnd(),av=rnd();let sb=ab,sv=av;
    if(Math.random()<eveP){const eb=rnd();sv=measure(sb,sv,eb);sb=eb}
    const bb=rnd(),bv=measure(sb,sv,bb);
    if(ab===bb){stats.sift++;if(bv!==av)stats.err++}
  }
  const strip=[];let ev=null,wait=10,msg1="",msg2="",msgC=C.ink,flashA=0,flashE=0,flashB=0,tick=0;
  function newRound(){
    if(sessionLeft<=0){eveP=eveP?0:.5;sessionLeft=ROUNDS;stats.sift=0;stats.err=0;strip.length=0;for(let i=0;i<400;i++)trial()}
    sessionLeft--;
    const ab=rnd(),av=rnd();
    ev={ab,av,sb:ab,sv:av,eve:Math.random()<eveP,eb:0,bb:rnd(),bv:0,x:AX,phase:"prep",t:16};
    flashA=10;msg1="ALICE SENDS "+st(ab,av);msg2="BIT "+av+"  BASIS "+bsym(ab);msgC=C.alice;
  }
  function step(){
    tick++;
    for(let i=0;i<20;i++)trial();
    if(flashA)flashA--;if(flashE)flashE--;if(flashB)flashB--;
    if(!ev){if(--wait<=0)newRound();return}
    const e=ev;
    if(e.phase==="prep"){if(--e.t<=0)e.phase="go1";return}
    if(e.phase==="go1"){e.x+=3;if(e.x>=EX){e.x=EX;if(e.eve){e.phase="eve";e.t=32;e.eb=rnd();flashE=14;
        const nv=measure(e.sb,e.sv,e.eb);e.sb=e.eb;e.sv=nv;msg1="EVE MEASURES: "+bsym(e.eb);msg2="RESENDS "+st(e.sb,e.sv);msgC=C.eve}
      else{e.phase="go2";if(eveP>0){msg1="EVE LETS THIS";msg2="ONE PASS";msgC=C.eve}}}return}
    if(e.phase==="eve"){if(--e.t<=0)e.phase="go2";return}
    if(e.phase==="go2"){e.x+=3;if(e.x>=BX-8){e.x=BX-8;e.phase="bob";e.t=28;flashB=14;e.bv=measure(e.sb,e.sv,e.bb);
        msg1="BOB MEASURES: "+bsym(e.bb);msg2="RESULT "+e.bv;msgC=C.bob}return}
    if(e.phase==="bob"){if(--e.t<=0){e.phase="sift";e.t=46;
        if(e.ab!==e.bb){e.res="drop";msg1="BASES DIFFER";msg2="DISCARDED";msgC=C.dim}
        else if(e.bv===e.av){e.res="ok";msg1="SAME BASIS";msg2="KEY BIT "+e.av;msgC=C.ok}
        else{e.res="err";msg1="SAME BASIS BUT";msg2="ERROR!";msgC=C.bad}}return}
    if(e.phase==="sift"){if(--e.t<=0){strip.push(e);if(strip.length>11)strip.shift();ev=null;wait=8;msg1=msg2=""}}
  }
  function photon(x,y,sb,sv){const g=sb===0?C.redG:C.blueG,k=sb===0?C.red:C.blue;
    px(x-4,y-3,9,7,g);px(x-3,y-4,7,9,g);px(x-3,y-3,7,7,k);glyph(st(sb,sv),x-2,y-2,"#FFFFFF")}
  function station(x,y,k,on,c){px(x,y,9,9,on?C.flash:C.path);px(x+1,y+1,7,7,C.bg);if(k)glyph(k,x+2,y+2,on?C.flash:c)}
  function draw(){
    px(0,0,W,H,C.bg);
    for(let y=3;y<H;y+=6)for(let x=3;x<W;x+=6)px(x,y,1,1,C.dot);
    /* characters and channel */
    px(AX-6,LY,BX-AX,1,C.path);
    text("ALICE",1,3,C.alice);sprite(4,12,flashA?"#FFD0DA":C.alice);
    text("BOB",BX+7,3,C.bob);sprite(BX+9,12,flashB?"#DCE8FF":C.bob);
    const eveOn=eveP>0;
    sprite(EX-3,24,eveOn?(flashE?"#EBDDFF":C.eve):C.eveDim);text("EVE",EX-5,36,eveOn?C.eve:C.eveDim);
    if(!eveOn&&tick%40<30){text("Z",EX+5,22,C.eveDim);text("Z",EX+8,18,C.eveDim)}
    if(eveOn)px(EX,LY+1,1,5,C.path);
    /* Alice's source and Bob's analyser */
    const e=ev;
    station(12,LY-4,e&&e.phase!=="prep"?null:(e?st(e.ab,e.av):null),flashA>0,C.alice);
    station(BX-4,LY-4,e&&(e.phase==="bob"||e.phase==="sift")?bas(e.bb):null,flashB>0,C.bob);
    if(e&&e.phase==="eve")station(EX-4,LY-4,bas(e.eb),flashE>0,C.eve);
    if(e&&(e.phase==="go1"||e.phase==="go2"||e.phase==="eve"))photon(e.x,LY,e.sb,e.sv);
    if(e&&e.phase==="prep")photon(AX,LY,e.ab,e.av);
    /* messages */
    if(msg1){text(msg1,PX-6,8,msgC);text(msg2,PX-6,16,msgC)}
    /* key strip */
    px(2,42,166,1,C.path);
    text("A",2,47,C.alice);text("B",2,55,C.bob);text("K",2,63,C.ink);
    strip.forEach((r,i)=>{const x=12+i*14;
      glyph(st(r.ab,r.av),x,47,r.ab===0?C.red:C.blue);
      glyph(bas(r.bb),x,55,C.bob);
      if(r.res==="drop")px(x+1,65,3,1,C.dim);
      else text(String(r.bv),x+1,63,r.res==="ok"?C.ok:C.bad);
      if(r.res==="err"){px(x-1,61,7,1,C.bad);px(x-1,69,7,1,C.bad)}
    });
    text("SIFTED KEY",12,74,C.dim);
    /* QBER panel */
    const q=stats.sift?stats.err/stats.sift:0;
    text(eveOn?"EVE ON":"EVE OFF",PX,30,eveOn?C.eve:C.eveDim);
    text("QBER "+(q*100).toFixed(0)+"%",PX,44,C.ink);
    const gx=PX,gw=60,gy=52,sc=gw/.3;
    px(gx,gy,gw,5,C.path);px(gx,gy,Math.min(gw,Math.round(q*sc)),5,q>.11?C.bad:C.ok);
    const tx=gx+Math.round(.11*sc);px(tx,gy-2,1,9,C.flash);text("11%",tx-5,gy+9,C.dim);
    if(q>.11){if(tick%30<22)text("EVE DETECTED!",PX-2,72,C.bad)}else text("KEY SECURE",PX,72,C.ok);
  }
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  eveP=0;for(let i=0;i<400;i++)trial();
  if(reduce){eveP=.5;stats.sift=stats.err=0;for(let i=0;i<4000;i++)trial();draw();return()=>{}}
  let raf=0,last=0;const loop=t=>{if(t-last>=33){step();draw();last=t}raf=requestAnimationFrame(loop)};
  draw();raf=requestAnimationFrame(loop);return()=>cancelAnimationFrame(raf);
}
