export async function onRequest(context) {
  const response = await context.next();
  const type = response.headers.get('content-type') || '';
  if (!type.includes('text/html')) return response;

  const html = await response.text();
  const injected = `
<style id="aerivo-motion">
  html{scroll-behavior:smooth}
  #mobile{overflow:hidden;max-height:0;transition:max-height .45s cubic-bezier(.22,.8,.2,1)}
  #mobile.open{display:block!important;max-height:500px}
  #mobile .wrap{padding:12px 0 14px;display:grid;gap:4px}
  #mobile a{padding:11px 13px;border-radius:12px;font-weight:800}
  #mobile a:hover{background:#f6fafa}
  [data-reveal]{opacity:0;transform:translate3d(0,28px,0) scale(.985);filter:blur(2px);transition:opacity .85s cubic-bezier(.22,.8,.2,1),transform .85s cubic-bezier(.22,.8,.2,1),filter .85s cubic-bezier(.22,.8,.2,1)}
  [data-reveal].is-visible{opacity:1;transform:none;filter:none}
  [data-hero]{opacity:0;transform:translateY(20px);transition:opacity .85s cubic-bezier(.22,.8,.2,1),transform .85s cubic-bezier(.22,.8,.2,1)}
  [data-hero].is-visible{opacity:1;transform:none}
  .chip{animation:aerivoFloat 5.5s ease-in-out infinite}
  @keyframes aerivoFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
  .gallery .g{cursor:zoom-in;transition:transform .45s cubic-bezier(.22,.8,.2,1),box-shadow .45s ease}
  .gallery .g:hover{transform:translateY(-5px);box-shadow:0 22px 55px rgba(10,25,47,.12)}
  .gallery-lightbox{position:fixed;inset:0;z-index:9999;background:rgba(4,18,30,.94);display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .35s ease;padding:28px}
  .gallery-lightbox.open{opacity:1;pointer-events:auto}
  .gallery-lightbox img{max-width:min(92vw,1400px);max-height:88vh;object-fit:contain;border-radius:18px;box-shadow:0 30px 100px rgba(0,0,0,.45);transform:scale(.96);transition:transform .45s cubic-bezier(.22,.8,.2,1)}
  .gallery-lightbox.open img{transform:scale(1)}
  .gallery-lightbox button{position:absolute;border:0;color:#fff;background:rgba(255,255,255,.12);backdrop-filter:blur(12px);width:46px;height:46px;border-radius:50%;font-size:26px;cursor:pointer;display:grid;place-items:center}
  .gallery-lightbox .close{top:22px;right:22px}.gallery-lightbox .prev{left:22px}.gallery-lightbox .next{right:22px}
  .aerivo-progress{position:fixed;top:0;left:0;height:3px;width:0;background:#0D9488;z-index:10001;transform-origin:left}
  @media(prefers-reduced-motion:reduce){[data-reveal],[data-hero]{opacity:1!important;transform:none!important;filter:none!important;transition:none!important}.chip{animation:none!important}}
</style>
<div class="aerivo-progress" id="aerivo-progress"></div>
<div class="gallery-lightbox" id="gallery-lightbox" aria-hidden="true">
  <button class="close" aria-label="Close">×</button>
  <button class="prev" aria-label="Previous">‹</button>
  <img alt="Sri Aadhya Hospital gallery image">
  <button class="next" aria-label="Next">›</button>
</div>
<script>
(()=>{
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const qs=(s,r=document)=>r.querySelector(s), qsa=(s,r=document)=>[...r.querySelectorAll(s)];
 const header=qs('#header');
 const progress=qs('#aerivo-progress');
 const onScroll=()=>{
   if(header) header.classList.toggle('scrolled',window.scrollY>20);
   if(progress){const h=document.documentElement.scrollHeight-window.innerHeight;progress.style.width=(h>0?(window.scrollY/h)*100:0)+'%'}
 };
 onScroll(); addEventListener('scroll',onScroll,{passive:true});
 const hero=qs('.hero');
 if(hero){qsa('.eyebrow,h1,p,.actions,.phone,.hero-visual',hero).forEach((el,i)=>{el.dataset.hero='';el.style.transitionDelay=Math.min(i*90,450)+'ms'});}
 qsa('main section').forEach(section=>{
   const targets=qsa('.sectionhead,.aboutphoto,.aboutcopy,.card,.servicecard,.doctor,.facility,.g,.manifesto-item,.scorebox,.reviewgroup,.presencecard,.contactgrid>div,.formcard',section);
   targets.forEach((el,i)=>{if(!el.dataset.reveal){el.dataset.reveal='';el.style.transitionDelay=Math.min((i%6)*70,350)+'ms'}});
 });
 if(!reduce){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -7% 0px'});qsa('[data-reveal],[data-hero]').forEach(el=>io.observe(el));}
 else qsa('[data-reveal],[data-hero]').forEach(el=>el.classList.add('is-visible'));
 // hero depth effect
 const heroImg=qs('.hero-frame img');
 if(heroImg&&!reduce)addEventListener('scroll',()=>{const y=Math.min(scrollY,600);heroImg.style.transform='translate3d(0,'+(y*.035)+'px,0) scale(1.02)'},{passive:true});
 // mobile menu
 const menu=qs('#menu'), mobile=qs('#mobile');
 if(menu&&mobile){menu.addEventListener('click',()=>mobile.classList.toggle('open'));qsa('#mobile a').forEach(a=>a.addEventListener('click',()=>mobile.classList.remove('open')))}
 // smooth internal links
 qsa('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const target=qs(a.getAttribute('href'));if(target){e.preventDefault();target.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'})}}));
 // gallery lightbox
 const boxes=qsa('.gallery .g'); const lb=qs('#gallery-lightbox'); const img=qs('#gallery-lightbox img'); let index=0;
 const images=boxes.map(b=>qs('img',b)).filter(Boolean);
 const show=i=>{if(!images.length)return;index=(i+images.length)%images.length;img.src=images[index].src;img.alt=images[index].alt||'Sri Aadhya Hospital';lb.classList.add('open');lb.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'};
 const close=()=>{lb.classList.remove('open');lb.setAttribute('aria-hidden','true');document.body.style.overflow=''};
 boxes.forEach((b,i)=>b.addEventListener('click',()=>show(i))); qs('.gallery-lightbox .close').addEventListener('click',close); qs('.gallery-lightbox .prev').addEventListener('click',()=>show(index-1)); qs('.gallery-lightbox .next').addEventListener('click',()=>show(index+1)); lb.addEventListener('click',e=>{if(e.target===lb)close()});
 addEventListener('keydown',e=>{if(!lb.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(index-1);if(e.key==='ArrowRight')show(index+1)});
 // subtle card tilt on larger screens
 if(!reduce && innerWidth>1000){qsa('.card,.doctor,.facility,.presencecard,.servicecard').forEach(card=>{card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;card.style.transform='perspective(900px) rotateX('+(-y*2)+'deg) rotateY('+(x*2)+'deg) translateY(-5px)'});card.addEventListener('pointerleave',()=>{card.style.transform=''})})}
})();
</script>`;

  const output = html.includes('</body>') ? html.replace('</body>', injected + '</body>') : html + injected;
  return new Response(output, { headers: new Headers(response.headers) });
}
