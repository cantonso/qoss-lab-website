/* ---------- pixel HBT experiment (logical 240×84 px, scaled with image-rendering:pixelated) ---------- */
function startHBT(){
  const cv=document.getElementById("hbt");if(!cv)return null;
  const ctx=cv.getContext("2d");ctx.imageSmoothingEnabled=false;
  const W=240,H=84;
  const C={bg:"#0E1420",dot:"#18223A",path:"#2B3A5A",ink:"#C9D3E3",dim:"#6F7E97",photon:"#FF4D63",glow:"#7A2233",
           det:"#AFBBD0",flash:"#FFD84D",bar:"#8FB8FF",zero:"#FF4D63",qd:"#E8C170",bs:"#9FE7F5"};
  /* 3×5 pixel font */
  const F={A:"010101111101101",B:"110101110101110",C:"011100100100011",D:"110101101101110",E:"111100110100111",G:"011100101101011",
    H:"101101111101101",I:"111010010010111",K:"101101110101101",L:"100100100100111",M:"101111111101101",N:"110101101101101",
    O:"010101101101010",P:"110101110100100",Q:"010101101110011",R:"110101110101101",S:"011100010001110",T:"111010010010010",
    U:"101101101101111",V:"101101101101010",Y:"101101010010010",
    "0":"111101101101111","1":"010110010010111","2":"110001010100111","3":"110001010001110","4":"101101111001001",
    "5":"111100110001110","6":"011100111101111","7":"111001010010010","8":"111101111101111","9":"111101111001110",
    "!":"010010010000010",".":"000000000000010","(":"001010010010001",")":"100010010010100","=":"000111000111000",
    "-":"000000111000000","+":"000010111010000",":":"000010000010000"," ":"000000000000000"};
  const px=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(x|0,y|0,w,h)};
  const text=(s,x,y,c)=>{for(const ch of s.toUpperCase()){const g=F[ch]||F[" "];for(let i=0;i<15;i++)if(g[i]==="1")px(x+i%3,y+(i/3|0),1,1,c);x+=4}};
  const tw=s=>s.length*4-1;

  /* geometry */
  const Y=34, QD={x:10,y:Y-5}, BS={x:74,y:Y-8}, D1={x:124,y:Y-6}, D2={x:BS.x+2,y:66};
  /* statistics: bins for delays -4..+4 pulses */
  const bins=new Float64Array(9),h1=[],h2=[];let pulses=0,c1n=0,c2n=0;
  const P1=.62,P2=.005;
  function simPulse(){
    let n=0;const u=Math.random();if(u<P2)n=2;else if(u<P2+P1)n=1;
    let a=false,b=false;for(let k=0;k<n;k++){if(Math.random()<.5)a=true;else b=true}
    h1.push(a);h2.push(b);if(h1.length>5){h1.shift();h2.shift()}
    const L=h1.length-1;
    for(let k=0;k<=4&&L-k>=0;k++){if(b&&h1[L-k])bins[4+k]++;if(k>0&&a&&h2[L-k])bins[4-k]++}
    pulses++;if(a)c1n++;if(b)c2n++;
  }
  /* visible photon */
  let ph=null,flash1=0,flash2=0,qdFlash=0,wait=10,shown1=0,shown2=0;
  function spawn(){ph={x:QD.x+10,y:Y-1,dir:"r",route:Math.random()<.5?1:2};qdFlash=6}
  function step(){
    for(let i=0;i<40;i++)simPulse();
    if(flash1)flash1--;if(flash2)flash2--;if(qdFlash)qdFlash--;
    if(!ph){if(--wait<=0){spawn();wait=18}return}
    if(ph.dir==="r"){ph.x+=2;
      if(ph.route===2&&ph.x>=BS.x+7){ph.x=BS.x+7;ph.dir="d"}
      else if(ph.route===1&&ph.x>=D1.x-3){ph=null;flash1=16;shown1++;return}}
    else{ph.y+=2;if(ph.y>=D2.y-3){ph=null;flash2=16;shown2++;return}}
  }
  function detector(d,label,flash,count,labelLeft){
    const c=flash?C.flash:C.det;
    px(d.x,d.y,8,12,c);px(d.x+8,d.y+2,2,8,c);px(d.x+2,d.y+2,4,8,flash?"#FFF3B0":C.bg);
    if(labelLeft){text(label,d.x-10,d.y+1,C.ink);text(String(count%1000),d.x-14,d.y+7,C.dim)}
    else{text(label,d.x+1,d.y-7,C.ink);text(String(count%1000),d.x+13,d.y+4,C.dim)}
    if(flash){const s="CLICK!";const tx=labelLeft?d.x+13:d.x-6,ty=labelLeft?d.y+4:d.y+15;if(flash%4<3)text(s,tx,ty,C.flash)}
  }
  function draw(){
    px(0,0,W,H,C.bg);
    for(let y=3;y<H;y+=6)for(let x=3;x<W;x+=6)px(x,y,1,1,C.dot);
    /* laser pump into QD */
    px(0,Y,QD.x-1,1,qdFlash?"#5BD17A":C.path);
    /* beam paths */
    px(QD.x+9,Y,D1.x-QD.x-10,1,C.path);px(BS.x+8,Y,1,D2.y-Y,C.path);
    /* QD source */
    const q=qdFlash?"#FFF1C4":C.qd;px(QD.x,QD.y,9,11,C.path);px(QD.x+1,QD.y+1,7,9,C.bg);px(QD.x+3,QD.y+3,3,5,q);
    text("QD",QD.x+1,QD.y-7,C.ink);
    /* beamsplitter cube with diagonal */
    px(BS.x,BS.y,17,17,C.path);px(BS.x+1,BS.y+1,15,15,C.bg);
    for(let i=0;i<15;i++)px(BS.x+1+i,BS.y+1+i,1,1,C.bs);
    text("BS",BS.x+3,BS.y-7,C.ink);text("50:50",BS.x+20,BS.y+10,C.dim);
    detector(D1,"D1",flash1,shown1,false);
    detector(D2,"D2",flash2,shown2,true);
    /* photon */
    if(ph){px(ph.x-2,ph.y-1,5,3,C.glow);px(ph.x-1,ph.y-2,3,5,C.glow);px(ph.x-1,ph.y-1,3,3,C.photon);px(ph.x,ph.y,1,1,"#FFD0D6")}
    /* histogram */
    const hx=158,hy=66,hh=44,bw=7,gap=2;
    let side=0;for(let i=0;i<9;i++)if(i!==4)side+=bins[i];side/=8;
    const max=Math.max(1,...bins);
    px(hx-2,hy+1,9*(bw+gap)+2,1,C.dim);
    for(let i=0;i<9;i++){const h=Math.round(bins[i]/max*hh);const x=hx+i*(bw+gap);
      if(h>0)px(x,hy+1-h,bw,h,i===4?C.zero:C.bar);
      if(i===4&&h<2)px(x,hy,bw,1,C.zero)}
    text("-4",hx,hy+4,C.dim);text("0",hx+4*(bw+gap)+2,hy+4,C.dim);text("+4",hx+8*(bw+gap),hy+4,C.dim);
    text("DELAY (PULSES)",hx+8,hy+11,C.dim);
    const g=side?bins[4]/side:0;
    text("G2(0)="+g.toFixed(2),hx+10,6,C.ink);
    text("COINCIDENCES",hx+14,13,C.dim);
  }
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(reduce){for(let i=0;i<40000;i++)simPulse();flash1=10;shown1=1;draw();return()=>{}}
  for(let i=0;i<2000;i++)simPulse();
  let raf=0,last=0;
  const tick=t=>{if(t-last>=33){step();draw();last=t}raf=requestAnimationFrame(tick)};
  draw();raf=requestAnimationFrame(tick);
  return()=>cancelAnimationFrame(raf);
}
