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
/* Close menu on link click */
document.querySelectorAll('.nav-drawer a').forEach(function(link){
  link.addEventListener('click',closeMenu);
});

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
var cursorEl=document.getElementById('cursor'),trailEl=document.getElementById('cursor-trail');
if(!isMobile&&window.matchMedia('(hover:hover)').matches){
  document.addEventListener('mousemove',function(e){ cursorX=e.clientX; cursorY=e.clientY; cursorEl.style.transform='translate('+cursorX+'px,'+cursorY+'px) translate(-50%,-50%)'; });
  setInterval(function(){ trailEl.style.transform='translate('+cursorX+'px,'+cursorY+'px) translate(-50%,-50%)'; },60);
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

/* MOBILE DETECTION */
var isMobile=window.innerWidth<=768||window.matchMedia('(hover:none)').matches;

/* ANIMATED PARTICLES */
var canvas=document.getElementById('grid-canvas'),ctx=canvas.getContext('2d');
var particles=[],cursorX=window.innerWidth/2,cursorY=window.innerHeight/2;
function Particle(x,y){this.x=x;this.y=y;this.vx=(Math.random()-.5)*.5;this.vy=(Math.random()-.5)*.5;this.radius=Math.random()*1.5+.5;this.baseX=x;this.baseY=y;this.active=true;}
Particle.prototype.update=function(){
  var dx=cursorX-this.x,dy=cursorY-this.y,dist=Math.sqrt(dx*dx+dy*dy);
  if(dist<150){this.vx-=dx*.001;this.vy-=dy*.001;}
  this.x+=this.vx;this.y+=this.vy;this.vx*=.99;this.vy*=.99;
  if(this.x<0||this.x>canvas.width||this.y<0||this.y>canvas.height){
    this.x=this.baseX+Math.random()*4-2;this.y=this.baseY+Math.random()*4-2;this.vx=0;this.vy=0;
  }
};
function initParticles(){
  particles=[];
  var particleCount=isMobile?20:80;
  for(var i=0;i<particleCount;i++){
    var x=Math.random()*canvas.width;
    var y=Math.random()*canvas.height;
    particles.push(new Particle(x,y));
  }
}
function animateParticles(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  var isDark=document.documentElement.getAttribute('data-theme')!=='light';
  var particleColor=isDark?'rgba(0,229,255,0.4)':'rgba(0,40,120,0.9)';
  var lineColor=isDark?'rgba(0,229,255,0.2)':'rgba(0,40,120,0.6)';
  ctx.fillStyle=particleColor;
  particles.forEach(function(p){p.update();ctx.beginPath();ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);ctx.fill();});
  if(!isMobile){
    ctx.strokeStyle=lineColor;ctx.lineWidth=1;
    for(var i=0;i<particles.length;i++){
      for(var j=i+1;j<particles.length;j++){
        var p1=particles[i],p2=particles[j];
        var dx=p1.x-p2.x,dy=p1.y-p2.y,dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<100){ctx.globalAlpha=(1-dist/100)*.5;ctx.beginPath();ctx.moveTo(p1.x,p1.y);ctx.lineTo(p2.x,p2.y);ctx.stroke();ctx.globalAlpha=1;}
      }
    }
  }
  requestAnimationFrame(animateParticles);
}
function resizeCanvas(){
  canvas.width=window.innerWidth;canvas.height=window.innerHeight;
  if(particles.length===0) initParticles();
}
resizeCanvas();
initParticles();
animateParticles();
window.addEventListener('resize',resizeCanvas,{passive:true});

/* SPOTLIGHT EFFECT */
var spotlight=document.getElementById('spotlight');
if(!isMobile&&window.matchMedia('(hover:hover)').matches){
  document.addEventListener('mousemove',function(e){
    cursorX=e.clientX;cursorY=e.clientY;
    spotlight.style.left=(cursorX-200)+'px';
    spotlight.style.top=(cursorY-200)+'px';
    spotlight.style.display='block';
  });
}

/* FADE-UP */
var observer=new IntersectionObserver(function(entries){
  entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('visible'); observer.unobserve(e.target); } });
},{threshold:0.1});
document.querySelectorAll('.fade-up').forEach(function(el){ observer.observe(el); });

/* SCROLL PROGRESS BAR */
var lastScrollUpdate=0;
window.addEventListener('scroll',function(){
  var now=Date.now();
  if(now-lastScrollUpdate>100) return;
  var h=document.documentElement.scrollHeight-window.innerHeight;
  var scrolled=(window.scrollY/h)*100;
  document.getElementById('scroll-progress').style.width=scrolled+'%';
  lastScrollUpdate=now;
},{passive:true});

/* BACK TO TOP BUTTON */
var backToTopBtn=document.getElementById('back-to-top');
window.addEventListener('scroll',function(){
  if(window.scrollY>400) backToTopBtn.classList.add('show');
  else backToTopBtn.classList.remove('show');
},{passive:true});
function scrollToTop(){window.scrollTo({top:0,behavior:'smooth'});}

/* ACTIVE NAV HIGHLIGHT */
var lastNavUpdate=0;
window.addEventListener('scroll',function(){
  var now=Date.now();
  if(now-lastNavUpdate<200) return;
  var sections=document.querySelectorAll('section[id]');
  var navLinks=document.querySelectorAll('.nav-links a, .nav-drawer a');
  var current='';
  sections.forEach(function(section){
    if(window.scrollY>=section.offsetTop-200) current=section.getAttribute('id');
  });
  navLinks.forEach(function(link){
    link.classList.remove('active');
    if(link.getAttribute('href')==='#'+current) link.classList.add('active');
  });
  lastNavUpdate=now;
},{passive:true});

/* 3D CARD TILT */
if(!isMobile){
  var tiltCards=document.querySelectorAll('.skill-card,.project-card,.edu-card,.pub-card');
  tiltCards.forEach(function(card){
    card.addEventListener('mousemove',function(e){
      var rect=card.getBoundingClientRect();
      var x=(e.clientX-rect.left)/rect.width;
      var y=(e.clientY-rect.top)/rect.height;
      var rotX=(y-.5)*25;
      var rotY=(x-.5)*-25;
      card.style.transform='perspective(1000px) rotateX('+rotX+'deg) rotateY('+rotY+'deg) translateZ(20px)';
      var shineEl=card.querySelector('::after');
      if(shineEl) shineEl.style.opacity=.5;
    });
    card.addEventListener('mouseleave',function(){
      card.style.transform='perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
  });
}

/* MAGNETIC BUTTONS */
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
    if(el) el.textContent=value;
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
document.querySelectorAll('.stat').forEach(function(stat){if(stat) statsObserver.observe(stat);});

/* GLITCH EFFECT */
var glitchEl=document.querySelector('.hero-name .glow');
if(!isMobile){
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
      btn.textContent='&#9889; Send Message';
      setTimeout(function(){msg.style.display='none';},3000);
    })
    .catch(function(err){ 
      console.error('❌ EMAIL FAILED ❌');
      console.error('Error:', err);
      msg.className='form-msg error'; 
      msg.textContent='✗ Error: ' + (err.text || 'Failed to send'); 
      msg.style.display='block';
      btn.disabled=false;
      btn.textContent='&#9889; Send Message';
    });
}

/* THEME TOGGLE SLIDER */
var themeToggle=document.getElementById('themeToggle');
themeToggle.addEventListener('click',function(){
  var current=document.documentElement.getAttribute('data-theme')||'dark';
  var next=current==='dark'?'light':'dark';
  document.documentElement.setAttribute('data-theme',next);
  localStorage.setItem('theme',next);
});