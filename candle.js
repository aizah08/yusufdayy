const flame = document.getElementById("flame");
const music = document.getElementById("music");
const meter = document.getElementById("meter");
const micBtn = document.getElementById("micBtn");
const blowBtn = document.getElementById("blowBtn");

let blown=false, stream, ctx, analyser, data, raf;

micBtn.onclick = enableMic;
blowBtn.onclick = blow;

async function enableMic(){
  stream = await navigator.mediaDevices.getUserMedia({audio:true});
  ctx = new AudioContext();
  analyser = ctx.createAnalyser();
  analyser.fftSize = 512;
  const src = ctx.createMediaStreamSource(stream);
  src.connect(analyser);
  data = new Uint8Array(analyser.fftSize);
  detect();
}

function detect(){
  analyser.getByteTimeDomainData(data);
  let sum=0;
  for(let i=0;i<data.length;i++){
    const v=(data[i]-128)/128;
    sum+=v*v;
  }
  const volume=Math.sqrt(sum/data.length);
  meter.style.width=Math.min(100,volume*300)+"%";

  if(volume>0.05 && !blown){
    blow();
    return;
  }
  raf=requestAnimationFrame(detect);
}

function blow(){
  if(blown) return;
  blown=true;
  flame.classList.add("out");
  music.play();
  confetti();
  setTimeout(()=>location.href="favourite.html",2000);
}

function confetti(){
  for(let i=0;i<40;i++){
    const c=document.createElement("div");
    c.className="confetti";
    c.style.left=Math.random()*100+"vw";
    c.style.background=`hsl(${Math.random()*360},100%,70%)`;
    document.body.appendChild(c);
    setTimeout(()=>c.remove(),3000);
  }
}
