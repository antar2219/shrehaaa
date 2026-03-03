document.addEventListener("DOMContentLoaded", function() {


const unlockDate = new Date("March 3, 2026 15:34:00").getTime();
const now = new Date().getTime();
const isMobile = window.innerWidth <= 768;
const isLowPower = isMobile || navigator.hardwareConcurrency <= 4;
/* ================= TIMER LOCK ================= */

const unlockDate = new Date("March 4, 2026 00:00:00").getTime();
const now = new Date().getTime();

const lockScreen = document.getElementById("lockScreen");
const welcomeScreen = document.getElementById("welcome");
const countdown = document.getElementById("countdown");

function updateCountdown(){
  const current = new Date().getTime();
  const distance = unlockDate - current;

  if(distance <= 0){

  lockScreen.classList.remove("active");
  welcomeScreen.classList.add("active");
  clearInterval(timerInterval);

  midnightUnlock();

  return;
}

  const hours = Math.floor((distance % (1000*60*60*24)) / (1000*60*60));
  const minutes = Math.floor((distance % (1000*60*60)) / (1000*60));
  const seconds = Math.floor((distance % (1000*60)) / 1000);

  countdown.innerHTML = `${hours}h ${minutes}m ${seconds}s`;
}

if(now < unlockDate){

  updateCountdown();
  var timerInterval = setInterval(updateCountdown,1000);

}else{

  // Remove lock
  lockScreen.classList.remove("active");

  // Activate welcome
  welcomeScreen.classList.add("active");

  // Trigger unlock effects
  midnightUnlock();

}
/* ========= ELEMENTS ========= */

const scenes = document.querySelectorAll(".screen");
const welcome = document.getElementById("welcome");
const sorting = document.getElementById("sorting");
const letterScreen = document.getElementById("letterScreen");

const startBtn = document.getElementById("startBtn");
const hat = document.getElementById("hat");

const letterClosed = document.getElementById("letterClosed");
const letterOpen = document.getElementById("letterOpen");
const letterText = document.getElementById("letterText");

const bgMusic = document.getElementById("bgMusic");
const thunder = document.getElementById("thunder");

let bgColor = "black";
let letterIsOpen = false;

/* ================= WAND CURSOR ================= */

const wand = document.getElementById("wizardWand");

document.addEventListener("mousemove", function(e){
  if(wand){
    wand.style.left = e.clientX + "px";
    wand.style.top = e.clientY + "px";
  }
  createSpark(e.clientX, e.clientY);
});
let lastSparkTime = 0;

function createSpark(x,y){
  const now = Date.now();
  if(now - lastSparkTime < 50) return;  // limit spark rate
  lastSparkTime = now;

  const spark = document.createElement("div");
  spark.style.position="fixed";
  spark.style.left=x+"px";
  spark.style.top=y+"px";
  spark.style.width="6px";
  spark.style.height="6px";
  spark.style.background="gold";
  spark.style.borderRadius="50%";
  spark.style.pointerEvents="none";
  spark.style.zIndex=9998;

  spark.animate([
    {opacity:1, transform:"scale(1)"},
    {opacity:0, transform:"scale(0.2)"}
  ],{duration:400});

  document.body.appendChild(spark);
  setTimeout(()=>spark.remove(),400);
}

/* ========= SCREEN SWITCH ========= */

function show(screen){
  scenes.forEach(s => s.classList.remove("active"));
  screen.classList.add("active");
}

/* ========= SAFE OPTIONAL EFFECTS ========= */

function safe(fn){
  try { fn(); } catch(e) {}
}

/* ========= BEGIN BUTTON ========= */

startBtn.addEventListener("click", function(){

  document.body.style.transition="background 2s ease";
  document.body.style.background="black";

  setTimeout(()=>{
    document.body.style.background="#111";
  },100);

  setTimeout(()=>{
    show(sorting);
  },2000);

  bgMusic.loop=true;
  bgMusic.volume=0.6;
  bgMusic.play().catch(()=>{});

});

/* ========= SORTING HAT ========= */

const houses = [
  {name:"Gryffindor!", color:"#740001"},
  {name:"Slytherin!", color:"#1a472a"},
  {name:"Ravenclaw!", color:"#0e1a40"},
  {name:"Hufflepuff!", color:"#ecb939"}
];

hat.addEventListener("click", function(){

  const chosen = houses[Math.floor(Math.random()*houses.length)];

  // CHAOS BUILDUP
  hat.classList.add("glow");

  setTimeout(()=>{

    if(!isLowPower){
      document.body.classList.add("shake");
    }
    
    document.body.classList.add("zoomPulse");
    setTimeout(()=>{
    document.body.classList.remove("zoomPulse");
    },800);
    const flash = document.getElementById("flash");
    flash.classList.add("active");

    bgColor = chosen.color;
    document.body.style.background = chosen.color;

    thunder.play().catch(()=>{});

    const speech = new SpeechSynthesisUtterance(chosen.name);
    speech.rate = 0.7;
    speech.pitch = 0.6;
    speechSynthesis.speak(speech);

    // FIREWORK STORM MODE
    for(let i=0;i<8;i++){
      setTimeout(createFirework, i*150);
    }

    setTimeout(()=>{
      document.body.classList.remove("shake");
      hat.classList.remove("glow");
      show(letterScreen);
      dropLetterChaos();
    },3500);

  },1200);

});

/* ========= LETTER DROP ========= */

function dropLetter(){
  letterClosed.style.position="absolute";
  letterClosed.style.top="-300px";
  letterClosed.style.left="50%";
  letterClosed.style.transform="translateX(-50%)";
  letterClosed.style.transition="top 2s ease";

  setTimeout(()=>{
    letterClosed.style.top="30%";
  },100);
}
function dropLetterChaos(){

  letterClosed.style.position="absolute";
  letterClosed.style.top="-400px";
  letterClosed.style.left="50%";
  letterClosed.style.transform="translateX(-50%) rotate(-20deg)";
  letterClosed.style.transition="top 1.5s ease, transform 1.5s ease";

  setTimeout(()=>{
    letterClosed.style.top="30%";
    letterClosed.style.transform="translateX(-50%) rotate(0deg)";
  },100);

  // EXTRA FIREWORK BURST
  for(let i=0;i<5;i++){
    setTimeout(createFirework, i*200);
  }
}
/* ========= LETTER OPEN ========= */

letterClosed.addEventListener("click", function(){

  if(!letterIsOpen){

    letterClosed.style.display="none";
    letterOpen.classList.remove("hidden");

    typeLetter();
    letterIsOpen = true;

    // MASSIVE MAGIC BURST
    for(let i=0;i<(isLowPower ? 25 : 60);i++){

      const spark=document.createElement("div");
      spark.style.position="fixed";
      spark.style.width="8px";
      spark.style.height="8px";
      spark.style.background="gold";
      spark.style.borderRadius="50%";
      spark.style.left="50%";
      spark.style.top="40%";
      spark.style.zIndex=20;

      const angle=Math.random()*2*Math.PI;
      const dist=Math.random()*300+100;

      spark.animate([
        {transform:"translate(0,0)",opacity:1},
        {transform:`translate(${Math.cos(angle)*dist}px,${Math.sin(angle)*dist}px)`,opacity:0}
      ],{duration:1200});

      document.body.appendChild(spark);
      setTimeout(()=>spark.remove(),1200);
    }

    // FIREWORK STORM AGAIN
    for(let i=0;i<6;i++){
      setTimeout(createFirework, i*200);
    }

  }
});
/* ========= LETTER CLOSE ========= */

letterOpen.addEventListener("click", function(){

  letterOpen.classList.add("hidden");
  letterClosed.style.display = "block";

  letterIsOpen = false;

});
/* ========= LETTER TEXT ========= */

const message = `
<div class="letter-title">
HOGWARTS SCHOOL OF WITCHCRAFT AND WIZARDRY
</div>

<div class="letter-address">
Miss Shreya<br>
3rd Floor, Peace PG,<br>
4, Ganga Prasad Mukherjee Road, Paddapukur, Bhowanipore,<br>
Ganga Prasad Mukherjee Road, Kolkata, West Bengal - 700025
</div>

<p>Dear Miss Shreya,</p>

<div class="letter-body">
<p>We are delighted to inform you that you have been officially accepted into the most enchanting celebration of the year — Your Birthday.</p>

<p>On this most magical occasion, we are pleased to announce that joy, laughter, surprises, and an abundance of happiness have been prepared especially for you.</p>

<p>May your day be filled with sparkling moments brighter than Lumos, sweeter than Honeydukes treats, and warmer than the Gryffindor common room fire.</p>

<p>Term of Happiness begins immediately and lasts for the entire year. We eagerly await your radiant smile and the making of unforgettable memories.</p>
</div>

<div class="letter-closing">
Yours sincerely,<br><br>
Professor of Endless Celebrations<br>
On behalf of all who adore you
</div>
`;

function typeLetter(){
  letterText.innerHTML = message;
}

/* ========= FIREWORKS ========= */

const canvas=document.getElementById("fireworks");
const ctx=canvas.getContext("2d");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

let particles=[];

function createFirework(){
  const x=Math.random()*canvas.width;
  const y=Math.random()*canvas.height/2;

  for(let i=0;i<(isLowPower ? 12 : 30);i++){
    particles.push({
      x,y,
      angle:Math.random()*2*Math.PI,
      speed:Math.random()*3+2,
      life:70
    });
  }
}

function animate(){
  requestAnimationFrame(animate);

  ctx.fillStyle=bgColor;
  ctx.globalAlpha= isLowPower ? 0.3 : 0.2;
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.globalAlpha=1;

  particles.forEach((p,i)=>{
    p.x+=Math.cos(p.angle)*p.speed;
    p.y+=Math.sin(p.angle)*p.speed;
    p.life--;
    ctx.fillStyle=`hsl(${Math.random()*360},100%,50%)`;
    ctx.fillRect(p.x,p.y,3,3);
    if(p.life<=0) particles.splice(i,1);
  });
}

setInterval(createFirework, isLowPower ? 3500 : 2000);
animate();
/* ================= LIGHTNING ================= */

function lightningFlash(){
  const flash = document.createElement("div");
  flash.style.position="fixed";
  flash.style.inset="0";
  flash.style.background="white";
  flash.style.opacity="0.8";
  flash.style.zIndex="50";
  flash.style.pointerEvents="none";
  document.body.appendChild(flash);

  setTimeout(()=>{
    flash.remove();
  },100);
}

setInterval(()=>{
  if(Math.random() > (isLowPower ? 0.8 : 0.5)){
    lightningFlash();
  }
},4000);
/* ================= MIDNIGHT UNLOCK CHAOS ================= */

function midnightUnlock(){

  // 2 second dramatic pause
  setTimeout(()=>{

    bgMusic.loop = true;
    bgMusic.volume = 0.7;
    bgMusic.play().catch(()=>{});

    thunder.play().catch(()=>{});

    for(let i=0;i<15;i++){
      setTimeout(createFirework, i*150);
    }

    document.body.classList.add("zoomPulse");
    setTimeout(()=>{
      document.body.classList.remove("zoomPulse");
    },800);

    lightningFlash();

  },2000);

}

});



