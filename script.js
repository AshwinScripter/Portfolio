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
if(window.matchMedia('(hover:hover)').matches){
  document.addEventListener('mousemove',function(e){ mx=e.clientX; my=e.clientY; cursorEl.style.transform='translate('+mx+'px,'+my+'px) translate(-50%,-50%)'; });
  setInterval(function(){ trailEl.style.transform='translate('+mx+'px,'+my+'px) translate(-50%,-50%)'; },60);
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

/* CANVAS GRID */
var canvas=document.getElementById('grid-canvas'),ctx=canvas.getContext('2d');
function resizeAndDraw(){
  canvas.width=window.innerWidth; canvas.height=window.innerHeight;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  var sz=50;
  ctx.strokeStyle='rgba(0,229,255,0.07)'; ctx.lineWidth=0.5;
  for(var x=0;x<=canvas.width;x+=sz){ ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke(); }
  for(var y=0;y<=canvas.height;y+=sz){ ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke(); }
  ctx.fillStyle='rgba(0,229,255,0.2)';
  for(var x=0;x<=canvas.width;x+=sz) for(var y=0;y<=canvas.height;y+=sz){ ctx.beginPath();ctx.arc(x,y,1,0,Math.PI*2);ctx.fill(); }
}
resizeAndDraw();
window.addEventListener('resize',resizeAndDraw,{passive:true});

/* FADE-UP */
var observer=new IntersectionObserver(function(entries){
  entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('visible'); observer.unobserve(e.target); } });
},{threshold:0.1});
document.querySelectorAll('.fade-up').forEach(function(el){ observer.observe(el); });

/* SETUP GUIDE */
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
});