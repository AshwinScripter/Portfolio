/* MOBILE MENU */
function toggleMenu(){
  var h=document.getElementById('hamburger'),d=document.getElementById('navDrawer'),b=document.getElementById('navBackdrop');
  var open=d.classList.toggle('open');
  h.classList.toggle('open',open); b.classList.toggle('open',open);
  document.body.style.overflow=open?'hidden':'';
}
function closeMenu(){
  document.getElementById('hamburger').classList.remove('open');
  document.getElementById('navDrawer').classList.remove('open');
  document.getElementById('navBackdrop').classList.remove('open');
  document.body.style.overflow='';
}
document.addEventListener('keydown',function(e){ if(e.key==='Escape') closeMenu(); });

/* TYPED TEXT */
var phrases=['AI & ML Engineer','Deep Learning Developer','Security Tool Builder','Open to Opportunities'];
var pi=0,ci=0,deleting=false;
var typedEl=document.getElementById('typed');
function type(){
  var phrase=phrases[pi];
  if(!deleting){ typedEl.textContent=phrase.slice(0,ci+1); ci++;
    if(ci===phrase.length){ deleting=true; setTimeout(type,1600); return; }
  } else { typedEl.textContent=phrase.slice(0,ci-1); ci--;
    if(ci===0){ deleting=false; pi=(pi+1)%phrases.length; }
  }
  setTimeout(type,deleting?45:75);
}
type();

/* CURSOR */
var cursorEl=document.getElementById('cursor'),trailEl=document.getElementById('cursor-trail'),mx=0,my=0;
if(window.matchMedia('(hover:hover)').matches&&cursorEl&&trailEl){
  document.addEventListener('mousemove',function(e){
    mx=e.clientX;
    my=e.clientY;
    cursorEl.style.left=mx+'px';
    cursorEl.style.top=my+'px';
    trailEl.style.left=mx+'px';
    trailEl.style.top=my+'px';
  });
  document.addEventListener('mouseover',function(e){
    var interactive=e.target.closest('a,button,input,textarea,select,.btn,.tag,.skill-card,.project-card');
    cursorEl.classList.toggle('cursor-pointer',!!interactive);
  });
}

/* NAV SCROLL */
var navEl=document.getElementById('navbar');
window.addEventListener('scroll',function(){ navEl.classList.toggle('scrolled',window.scrollY>60); },{passive:true});

/* SMOOTH SCROLL */
document.addEventListener('click',function(e){
  var link=e.target.closest('a[href^="#"]');
  if(!link) return;
  var href=link.getAttribute('href');
  if(href==='#') return;
  var target=document.querySelector(href);
  if(!target) return;
  e.preventDefault();
  var navH=parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'))||70;
  window.scrollTo({top:target.getBoundingClientRect().top+window.scrollY-navH,behavior:'smooth'});
});

/* GALAXY (DARK) / SUNRISE SKY (LIGHT) */
var canvas=document.getElementById('grid-canvas'),ctx=canvas.getContext('2d');
var stars=[],shootingStars=[],bokeh=[],mx=window.innerWidth/2,my=window.innerHeight/2;
var isMobile=window.matchMedia('(max-width:768px)').matches;
var prefersReducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var isLightTheme=function(){return document.documentElement.getAttribute('data-theme')==='light';};
var galaxyColors=['#ffffff','#e8f4ff','#b8d4ff','#d4b8ff','#ffe8b8','#a8e8ff'];
var skyColors=['#ffffff','#ff9f6b','#ffc94d','#6bcbff','#c8ffb8','#ffb8e8','#fff4a8'];

function Star(){
  this.reset();
}
Star.prototype.reset=function(){
  var light=isLightTheme();
  this.x=Math.random()*canvas.width;
  this.y=Math.random()*canvas.height;
  this.z=Math.random();
  if(light){
    this.radius=(Math.random()*2+.4)*(0.5+this.z);
    this.baseAlpha=Math.random()*.5+.25;
    this.driftX=(Math.random()-.5)*.012;
    this.driftY=(Math.random()-.5)*.008;
    this.isSparkle=Math.random()>.7;
  }else{
    this.isSparkle=false;
    this.radius=(Math.random()*1.6+.2)*(0.4+this.z*1.2);
    this.baseAlpha=Math.random()*.55+.25;
    this.driftX=(Math.random()-.5)*.015;
    this.driftY=(Math.random()-.5)*.01;
  }
  this.alpha=this.baseAlpha;
  this.twinkle=Math.random()*Math.PI*2;
  this.twinkleSpeed=Math.random()*.025+.008;
  var palette=light?skyColors:galaxyColors;
  this.color=palette[Math.floor(Math.random()*palette.length)];
};

function spawnShootingStar(){
  if(prefersReducedMotion) return;
  if(isLightTheme()){
    shootingStars.push({
      x:Math.random()*canvas.width,
      y:-20,
      len:Math.random()*50+30,
      speed:Math.random()*3+2,
      angle:Math.PI/2+Math.random()*.2,
      life:1,
      hue:Math.random()>.5?'gold':'cyan'
    });
    return;
  }
  shootingStars.push({
    x:Math.random()*canvas.width*.8+canvas.width*.1,
    y:Math.random()*canvas.height*.4,
    len:Math.random()*80+40,
    speed:Math.random()*8+6,
    angle:Math.PI/4+Math.random()*.3,
    life:1
  });
}

function Bokeh(){
  this.reset();
}
Bokeh.prototype.reset=function(){
  this.x=Math.random()*canvas.width;
  this.y=Math.random()*canvas.height;
  this.r=Math.random()*28+12;
  this.hue=['255,150,80','80,180,255','255,200,100','150,255,180'][Math.floor(Math.random()*4)];
  this.speed=Math.random()*.4+.15;
  this.phase=Math.random()*Math.PI*2;
};

function initGalaxy(){
  stars=[];
  shootingStars=[];
  bokeh=[];
  var count;
  if(isLightTheme()){
    count=isMobile?90:200;
    if(prefersReducedMotion) count=isMobile?50:100;
    var bokehCount=isMobile?8:18;
    for(var b=0;b<bokehCount;b++) bokeh.push(new Bokeh());
  }else{
    count=isMobile?140:320;
    if(prefersReducedMotion) count=isMobile?80:120;
  }
  for(var i=0;i<count;i++) stars.push(new Star());
}

function drawAmbientBand(){
  var w=canvas.width,h=canvas.height;
  if(isLightTheme()){
    var horizon=ctx.createLinearGradient(0,h*.35,0,h);
    horizon.addColorStop(0,'rgba(255,255,255,0)');
    horizon.addColorStop(.45,'rgba(244,162,97,.18)');
    horizon.addColorStop(.75,'rgba(231,111,81,.22)');
    horizon.addColorStop(1,'rgba(157,78,221,.25)');
    ctx.fillStyle=horizon;
    ctx.fillRect(0,0,w,h);
    var sun=ctx.createRadialGradient(w*.88,h*.08,0,w*.88,h*.08,Math.min(w,h)*.5);
    sun.addColorStop(0,'rgba(255,220,150,.4)');
    sun.addColorStop(.35,'rgba(231,111,81,.18)');
    sun.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=sun;
    ctx.fillRect(0,0,w,h);
    bokeh.forEach(function(b){
      b.phase+=.02;
      b.y-=b.speed;
      if(b.y<-b.r*2){b.reset();b.y=canvas.height+b.r;}
      var pulse=.7+Math.sin(b.phase)*.3;
      var g=ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,b.r*pulse);
      g.addColorStop(0,'rgba('+b.hue+',.18)');
      g.addColorStop(.5,'rgba('+b.hue+',.08)');
      g.addColorStop(1,'rgba('+b.hue+',0)');
      ctx.fillStyle=g;
      ctx.beginPath();
      ctx.arc(b.x,b.y,b.r*pulse,0,Math.PI*2);
      ctx.fill();
    });
  }else{
    var cx=w*.5,cy=h*.55;
    var g=ctx.createRadialGradient(cx,cy,0,cx,cy,Math.max(w,h)*.65);
    g.addColorStop(0,'rgba(100,60,180,.14)');
    g.addColorStop(.35,'rgba(40,80,160,.08)');
    g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g;
    ctx.fillRect(0,0,w,h);
  }
}

function drawStars(){
  var parallaxX=(mx-canvas.width/2)*.00008;
  var parallaxY=(my-canvas.height/2)*.00008;
  stars.forEach(function(s){
    s.twinkle+=s.twinkleSpeed;
    s.alpha=s.baseAlpha+Math.sin(s.twinkle)*.2;
    if(!prefersReducedMotion){
      s.x+=s.driftX*(.3+s.z);
      s.y+=s.driftY*(.3+s.z);
      if(s.x<0) s.x=canvas.width;
      if(s.x>canvas.width) s.x=0;
      if(s.y<0) s.y=canvas.height;
      if(s.y>canvas.height) s.y=0;
    }
    var px=s.x+parallaxX*s.z*80;
    var py=s.y+parallaxY*s.z*80;
    ctx.beginPath();
    ctx.arc(px,py,s.radius,0,Math.PI*2);
    ctx.fillStyle=s.color;
    ctx.globalAlpha=Math.max(0,Math.min(1,s.alpha));
    ctx.fill();
    if(isLightTheme()&&s.isSparkle){
      ctx.strokeStyle=s.color;
      ctx.lineWidth=1;
      ctx.globalAlpha=s.alpha*.8;
      var r=s.radius*3;
      ctx.beginPath();
      ctx.moveTo(px-r,py);ctx.lineTo(px+r,py);
      ctx.moveTo(px,py-r);ctx.lineTo(px,py+r);
      ctx.stroke();
    }else if(s.z>.75&&s.radius>1){
      ctx.globalAlpha=s.alpha*.35;
      ctx.beginPath();
      ctx.arc(px,py,s.radius*2.5,0,Math.PI*2);
      ctx.fill();
    }
  });
  ctx.globalAlpha=1;
}

function drawShootingStars(){
  shootingStars=shootingStars.filter(function(s){
    s.life-=.015;
    s.x+=Math.cos(s.angle)*s.speed;
    s.y+=Math.sin(s.angle)*s.speed;
    if(s.life<=0||s.y>canvas.height+50) return false;
    var grad=ctx.createLinearGradient(s.x,s.y,s.x-Math.cos(s.angle)*s.len,s.y-Math.sin(s.angle)*s.len);
    if(s.hue==='gold'){
      grad.addColorStop(0,'rgba(255,220,100,'+s.life+')');
      grad.addColorStop(1,'rgba(255,180,60,0)');
    }else if(s.hue==='cyan'){
      grad.addColorStop(0,'rgba(100,220,255,'+s.life+')');
      grad.addColorStop(1,'rgba(80,180,255,0)');
    }else{
      grad.addColorStop(0,'rgba(255,255,255,'+s.life+')');
      grad.addColorStop(1,'rgba(255,255,255,0)');
    }
    ctx.strokeStyle=grad;
    ctx.lineWidth=isLightTheme()?2.5:2;
    ctx.beginPath();
    ctx.moveTo(s.x,s.y);
    ctx.lineTo(s.x-Math.cos(s.angle)*s.len,s.y-Math.sin(s.angle)*s.len);
    ctx.stroke();
    return true;
  });
}

function animateGalaxy(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawAmbientBand();
  drawStars();
  drawShootingStars();
  requestAnimationFrame(animateGalaxy);
}

function resizeCanvas(){
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;
  initGalaxy();
}

resizeCanvas();
animateGalaxy();
window.addEventListener('resize',resizeCanvas,{passive:true});
if(!prefersReducedMotion){
  setInterval(function(){
    if(document.visibilityState!=='visible') return;
    if(isLightTheme()){
      if(Math.random()>.4) spawnShootingStar();
    }else if(Math.random()>.55){
      spawnShootingStar();
    }
  },isLightTheme()?(isMobile?3500:1800):(isMobile?5000:2800));
}
function onThemeChange(){
  initGalaxy();
}
document.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;},{passive:true});

/* SPOTLIGHT EFFECT */
var spotlight=document.getElementById('spotlight');
if(window.matchMedia('(hover:hover)').matches){
  document.addEventListener('mousemove',function(e){
    spotlight.style.left=(e.clientX-200)+'px';
    spotlight.style.top=(e.clientY-200)+'px';
    spotlight.style.display='block';
  });
}

/* FADE-UP */
var observer=new IntersectionObserver(function(entries){
  entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('visible'); observer.unobserve(e.target); } });
},{threshold:0.1});
document.querySelectorAll('.fade-up').forEach(function(el){ observer.observe(el); });

/* SCROLL PROGRESS BAR */
var sections=document.querySelectorAll('section[id]');
var navLinks=document.querySelectorAll('.nav-links a, .nav-drawer a');
var scrollTicking=false;
function updateOnScroll(){
  var h=document.documentElement.scrollHeight-window.innerHeight;
  var scrolled=h>0?(window.scrollY/h)*100:0;
  document.getElementById('scroll-progress').style.width=scrolled+'%';

  var current='';
  sections.forEach(function(section){
    if(window.scrollY>=section.offsetTop-200) current=section.getAttribute('id');
  });
  navLinks.forEach(function(link){
    link.classList.remove('active');
    if(link.getAttribute('href')==='#'+current) link.classList.add('active');
  });
  scrollTicking=false;
}
window.addEventListener('scroll',function(){
  if(!scrollTicking){
    window.requestAnimationFrame(updateOnScroll);
    scrollTicking=true;
  }
},{passive:true});
updateOnScroll();

/* 3D CARD TILT - DISABLED ON MOBILE */
if(!isMobile){
  var tiltCards=document.querySelectorAll('.skill-card,.project-card,.edu-card,.pub-card');
  tiltCards.forEach(function(card){
    card.addEventListener('mousemove',function(e){
      var rect=card.getBoundingClientRect();
      var x=(e.clientX-rect.left)/rect.width;
      var y=(e.clientY-rect.top)/rect.height;
      var rotX=(y-.5)*10;
      var rotY=(x-.5)*-10;
      card.style.transform='perspective(1000px) rotateX('+rotX+'deg) rotateY('+rotY+'deg) translateZ(10px)';
      var shineEl=card.querySelector('::after');
      if(shineEl) shineEl.style.opacity=.5;
    });
    card.addEventListener('mouseleave',function(){
      card.style.transform='perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
    card.addEventListener('mousemove',function(e){
      var glowRect=card.getBoundingClientRect();
      card.style.setProperty('--glow-x',(((e.clientX-glowRect.left)/glowRect.width)*100)+'%');
      card.style.setProperty('--glow-y',(((e.clientY-glowRect.top)/glowRect.height)*100)+'%');
    });
  });
}

/* MAGNETIC BUTTONS - DISABLED ON MOBILE */
if(!isMobile){
  var magButtons=document.querySelectorAll('.btn-primary,.btn-outline');
  magButtons.forEach(function(btn){
    btn.addEventListener('mousemove',function(e){
      var rect=btn.getBoundingClientRect();
      var x=e.clientX-rect.left-rect.width/2;
      var y=e.clientY-rect.top-rect.height/2;
      var distance=Math.sqrt(x*x+y*y);
      if(distance<150){
        var pull=20*(1-distance/150);
        btn.style.transform='translate('+x/10+'px,'+y/10+'px)';
      }
    });
    btn.addEventListener('mouseleave',function(){btn.style.transform='translate(0,0)';});
  });
}

/* COUNTING STATS */
function animateCounter(el,target,duration){
  var start=0,startTime=null;
  function step(timestamp){
    if(!startTime) startTime=timestamp;
    var progress=(timestamp-startTime)/duration;
    var value=Math.floor(start+(target-start)*easeOutQuad(Math.min(progress,1)));
    el.textContent=value;
    if(progress<1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
function easeOutQuad(t){return t*(2-t);}
var statsObserver=new IntersectionObserver(function(entries){
  entries.forEach(function(e){
    if(e.isIntersecting){
      var statNum=e.target.querySelector('.stat-num');
      if(statNum&&!statNum.classList.contains('counted')){
        var text=statNum.textContent;
        var target=parseFloat(text);
        statNum.classList.add('counted');
        animateCounter(statNum,target,2000);
      }
      statsObserver.unobserve(e.target);
    }
  });
},{threshold:.5});
document.querySelectorAll('.stat').forEach(function(stat){statsObserver.observe(stat);});

/* GLITCH EFFECT */
var glitchEl=document.querySelector('.hero-name .glow');
if(glitchEl&&!isMobile&&!prefersReducedMotion){
  setInterval(function(){
    if(Math.random()>.4){
      glitchEl.classList.add('glitch-active');
      setTimeout(function(){glitchEl.classList.remove('glitch-active');},400);
    }
  },2500);
}

/* STAGGER ANIMATIONS FOR CARDS */
document.querySelectorAll('.skill-card').forEach(function(el,idx){el.style.setProperty('--stagger-index',idx);});
document.querySelectorAll('.project-card').forEach(function(el,idx){el.style.setProperty('--stagger-index',idx);});
document.querySelectorAll('.edu-card').forEach(function(el,idx){el.style.setProperty('--stagger-index',idx);});


function toggleSetup(e){ if(e) e.preventDefault(); var g=document.getElementById('setup-guide'); g.style.display=g.style.display==='block'?'none':'block'; }

/* SEND EMAIL */
function sendEmail(){
  var name=document.getElementById('fname').value.trim();
  var email=document.getElementById('femail').value.trim();
  var subject=document.getElementById('fsubject').value.trim();
  var message=document.getElementById('fmessage').value.trim();
  var btn=document.getElementById('sendBtn'),msg=document.getElementById('formMsg');
  
  if(!name||!email||!message){ 
    msg.className='form-msg error'; 
    msg.textContent='Please fill in name, email, and message.'; 
    msg.style.display='block';
    return; 
  }
  
  btn.disabled=true; 
  btn.textContent='Sending...'; 
  msg.className='form-msg'; 
  msg.style.display='none';
  
  // DEBUG: Log what's being sent
  console.log('=== SENDING EMAIL ===');
  console.log('Service ID:', window.EMAILJS_SERVICE_ID);
  console.log('Template ID:', window.EMAILJS_TEMPLATE_ID);
  console.log('Data:', {
    from_name: name,
    from_email: email,
    subject: subject,
    message: message
  });
  
  emailjs.send(window.EMAILJS_SERVICE_ID, window.EMAILJS_TEMPLATE_ID, {
    from_name: name,
    from_email: email,
    subject: subject || 'Portfolio Contact',
    message: message
  })
    .then(function(response){ 
      console.log('✓✓✓ EMAIL SENT SUCCESSFULLY ✓✓✓', response);
      msg.className='form-msg success'; 
      msg.textContent='✓ Message sent! I will get back to you soon.'; 
      msg.style.display='block';
      document.getElementById('fname').value=''; 
      document.getElementById('femail').value=''; 
      document.getElementById('fsubject').value=''; 
      document.getElementById('fmessage').value=''; 
      btn.disabled=false;
      btn.textContent='Send Message';
    })
    .catch(function(err){ 
      console.error('❌ EMAIL FAILED ❌');
      console.error('Error:', err);
      console.error('Error Status:', err.status);
      console.error('Error Text:', err.text);
      
      msg.className='form-msg error'; 
      msg.textContent='✗ Error: ' + (err.text || 'Failed to send'); 
      msg.style.display='block';
      btn.disabled=false;
      btn.textContent='Send Message';
    });
}

/* THEME TOGGLE SLIDER */
var themeToggle=document.getElementById('themeToggle');
themeToggle.addEventListener('click',function(){
  var current=document.documentElement.getAttribute('data-theme')||'dark';
  var next=current==='dark'?'light':'dark';
  document.documentElement.setAttribute('data-theme',next);
  localStorage.setItem('theme',next);
  onThemeChange();
});