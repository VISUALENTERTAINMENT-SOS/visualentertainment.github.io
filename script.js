/* ===== Data musik: tambah/ubah di sini (foto di folder img/) ===== */
const ALBUMS=[
 {t:"Merry Christmas, Please Don't Call",a:'Bleachers',img:'img/album1.jpg'},
 {t:"All Too Well (10 Minute Version)",a:'Taylor Swift',img:'img/album2.jpg'},
 {t:"About You",a:'The 1975',img:'img/album3.jpg'},
 {t:"Adore You",a:'Harry Styles',img:'img/album4.jpg'},
 {t:"See You Again", a: 'Tyler, The Creator (Ft. Kali Uchis)',img:'img/album5.jpg'},
 {t:"Earrings",a:'Malcolm Todd',img:'img/album6.jpg'}
];

/* ===== Loading ===== */
const bar=document.getElementById('bar'),pct=document.getElementById('pct');
let p=0;
const LOAD_MS=3200,t0=performance.now();
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
let shown=0;
(function tick(now){
  const t=Math.min(1,(now-t0)/LOAD_MS);
  p=ease(t)*100;
  shown+=(p-shown)*.25;
  bar.style.width=shown+'%';pct.textContent=String(Math.round(shown)).padStart(3,'0');
  if(t<1)requestAnimationFrame(tick);
  else{bar.style.width='100%';pct.textContent='100';setTimeout(finish,450)}
})(t0);
function finish(){
  const c=document.getElementById('curtain');
  c.classList.add('go');
  document.getElementById('loader').classList.add('done');
  document.body.classList.add('ready');
  setTimeout(()=>{document.body.classList.remove('is-loading');c.remove()},3900);
}
const cur=document.getElementById('curtain');
for(let i=0;i<8;i++){const s=document.createElement('i');s.style.setProperty('--i',i);cur.appendChild(s)}
document.querySelectorAll('.hero__name span').forEach((s,i)=>s.style.setProperty('--n',i));

/* ===== Band berjalan ===== */
const words=['ANUGRAH','DANIEL','JUNIOR','SANDAG'];
let bh='';for(let r=0;r<8;r++)words.forEach(w=>bh+=`<span>${w}</span><span class="s">✦</span>`);
document.getElementById('bandTrack').innerHTML=bh;

/* ===== About ===== */
const at=document.getElementById('aboutText'),ap=document.getElementById('aboutPhoto');
at.querySelectorAll('.l').forEach((e,i)=>e.style.setProperty('--d',i));
new IntersectionObserver((en,o)=>{if(en[0].isIntersecting){
  at.classList.add('in');o.disconnect();
  const n=at.querySelectorAll('.l').length;
  setTimeout(()=>ap.classList.add('in'),n*250+800);
}},{threshold:.3}).observe(at);

/* ===== Music: looping strip ===== */
const strip=document.getElementById('strip'),track=document.getElementById('stripTrack'),lb=document.getElementById('lightbox');
const SETS=4;
for(let s=0;s<SETS;s++)ALBUMS.forEach(al=>{
  const d=document.createElement('div');d.className='card';
  d.innerHTML=`<div class="card__img"><img src="${al.img}" alt="${al.t}"></div><b>${al.t}</b><small>${al.a}</small>`;
  d.dataset.t=al.t;d.dataset.a=al.a;d.dataset.img=al.img;track.appendChild(d);
});
let pos=0,setW=1,speed=0.7,target=0.7,dir=-1,drag=false,moved=0,lx=0,boost=0,lastY=scrollY;
const measure=()=>{setW=track.scrollWidth/SETS};
addEventListener('load',measure);addEventListener('resize',measure);measure();
(function loop(){
  const dy=Math.abs(scrollY-lastY);lastY=scrollY;boost+= (Math.min(dy,60)*.35-boost)*.1;
  speed+=(target-speed)*.08;
  if(!drag)pos+=dir*(speed+boost);
  pos=((pos%setW)+setW)%setW;
  track.style.transform=`translate3d(${-(setW+pos)}px,0,0)`;
  requestAnimationFrame(loop);
})();
strip.addEventListener('pointerdown',e=>{drag=true;moved=0;lx=e.clientX});
addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-lx;lx=e.clientX;moved+=Math.abs(dx);pos-=dx});
addEventListener('pointerup',()=>{drag=false});
strip.addEventListener('wheel',e=>{const d=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:(e.shiftKey?e.deltaY:0);if(d){e.preventDefault();pos+=d}},{passive:false});
track.addEventListener('pointerover',e=>{const c=e.target.closest('.card');if(!c||drag)return;
  track.querySelectorAll('.card.on').forEach(x=>x.classList.remove('on'));c.classList.add('on');strip.classList.add('focus');target=0});
strip.addEventListener('pointerleave',()=>{strip.classList.remove('focus');track.querySelectorAll('.card.on').forEach(x=>x.classList.remove('on'));target=.7});

/* klik -> seluruh halaman blur, hanya foto terpilih */
let clone=null;
track.addEventListener('click',e=>{
  const c=e.target.closest('.card');if(!c||moved>6)return;
  const r=c.querySelector('img').getBoundingClientRect();
  clone=document.createElement('img');clone.src=c.dataset.img;
  Object.assign(clone.style,{left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px'});
  lb.prepend(clone);document.getElementById('lbCap').innerHTML=`${c.dataset.t}<small>${c.dataset.a}</small>`;
  lb.classList.add('open');
  const s=Math.min(innerWidth*.8,innerHeight*.62,640);
  requestAnimationFrame(()=>requestAnimationFrame(()=>Object.assign(clone.style,{width:s+'px',height:s+'px',left:(innerWidth-s)/2+'px',top:(innerHeight-s)/2-innerHeight*.05+'px'})));
});
function closeLb(){lb.classList.remove('open');if(clone){const x=clone;x.style.opacity=0;setTimeout(()=>x.remove(),500);clone=null}}
lb.addEventListener('click',closeLb);addEventListener('keydown',e=>e.key==='Escape'&&closeLb());

/* ===== Contact ===== */
const cg=document.getElementById('contactGrid');
cg.querySelectorAll('.ct').forEach((e,i)=>e.style.setProperty('--d',i));
new IntersectionObserver((en,o)=>{if(en[0].isIntersecting){cg.classList.add('in');o.disconnect()}},{threshold:.35}).observe(cg);


/* ===== Interaktif tambahan ===== */
const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;

/* progress bar scroll */
const sp=document.createElement('div');sp.className='sprog';document.body.appendChild(sp);
addEventListener('scroll',()=>{
  const m=document.documentElement.scrollHeight-innerHeight;
  sp.style.transform=`scaleX(${m>0?scrollY/m:0})`;
},{passive:true});

/* reveal saat scroll */
const rvIO=new IntersectionObserver(en=>en.forEach(x=>{if(x.isIntersecting){x.target.classList.add('rv-in');rvIO.unobserve(x.target)}}),{threshold:.2});
document.querySelectorAll('.tag,.music__title,.contact__title,footer').forEach(e=>{e.classList.add('rv');rvIO.observe(e)});

if(fine){
  /* kursor pengikut */
  const ring=document.createElement('div');ring.className='cursor';document.body.appendChild(ring);
  let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
  addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;ring.classList.add('show')});
  document.addEventListener('pointerleave',()=>ring.classList.remove('show'));
  document.addEventListener('pointerover',e=>{
    ring.classList.toggle('big',!!e.target.closest('a,.card,button'));
    ring.classList.toggle('drag',!!e.target.closest('.strip')&&!e.target.closest('.card'));
  });
  addEventListener('pointerdown',()=>ring.classList.add('press'));
  addEventListener('pointerup',()=>ring.classList.remove('press'));

  /* parallax hero + magnetic kontak (dihaluskan dengan lerp) */
  const hero=document.getElementById('beranda'),hp=document.querySelector('.hero__photo'),hs=document.querySelector('.hero__script'),hb=document.querySelector('.hero__brand');
  let nx=0,ny=0,cx=0,cy=0;
  hero.addEventListener('pointermove',e=>{nx=e.clientX/innerWidth-.5;ny=e.clientY/innerHeight-.5});
  hero.addEventListener('pointerleave',()=>{nx=0;ny=0});
  const mags=[...document.querySelectorAll('.ct')].map(el=>({el,x:0,y:0,tx:0,ty:0}));
  mags.forEach(m=>{
    m.el.addEventListener('pointermove',e=>{const r=m.el.getBoundingClientRect();m.tx=(e.clientX-r.left-r.width/2)*.18;m.ty=(e.clientY-r.top-r.height/2)*.18});
    m.el.addEventListener('pointerleave',()=>{m.tx=0;m.ty=0});
  });
  (function fx(){
    cx+=(nx-cx)*.07;cy+=(ny-cy)*.07;
    hp.style.translate=`${cx*-26}px ${cy*-12}px`;
    hs.style.translate=`${cx*40}px ${cy*20}px`;
    hb.style.translate=`${cx*14}px ${cy*8}px`;
    rx+=(mx-rx)*.18;ry+=(my-ry)*.18;
    ring.style.transform=`translate3d(${rx}px,${ry}px,0) translate(-50%,-50%)`;
    mags.forEach(m=>{m.x+=(m.tx-m.x)*.15;m.y+=(m.ty-m.y)*.15;m.el.style.translate=`${m.x}px ${m.y}px`});
    requestAnimationFrame(fx);
  })();

  /* tilt 3D pada kartu musik */
  track.addEventListener('pointermove',e=>{
    const c=e.target.closest('.card');if(!c||drag)return;
    const i=c.querySelector('.card__img'),r=i.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    i.style.transform=`perspective(700px) rotateY(${x*16}deg) rotateX(${-y*16}deg)`;
  });
  track.addEventListener('pointerout',e=>{
    const c=e.target.closest('.card');if(c)c.querySelector('.card__img').style.transform='';
  });
}

/* foto about: miring mengikuti kursor */
ap.addEventListener('pointermove',e=>{
  const r=ap.getBoundingClientRect();
  ap.style.rotate=`${((e.clientX-r.left)/r.width-.5)*10}deg`;
});
ap.addEventListener('pointerleave',()=>{ap.style.rotate='0deg'});

/* ===== Saran & kritik ===== */
(function(){
  /* Alamat ngrok yang mengarah ke Flask di laptopmu, contoh: 'https://nama-kamu.ngrok-free.app'
     Isi ini kalau website dibuka dari Vercel. Kalau website dibuka lewat Flask sendiri
     (localhost:5000, 192.168.x.x:5000, atau alamat ngrok), kodenya otomatis memakai '/api/saran'. */
  const NGROK_URL='https://exclude-creed-puma.ngrok-free.dev';
  const dariFlask=location.port==='5000'||(NGROK_URL!==''&&location.origin===NGROK_URL.replace(/\/+$/,''));
  const SERVER_URL=(dariFlask||!NGROK_URL)?'/api/saran':NGROK_URL.replace(/\/+$/,'')+'/api/saran';
  const KEY='dataSaran'; // nama kunci localStorage (dipakai hanya kalau SERVER_URL kosong)
  const box=document.getElementById('saran'),head=document.getElementById('saranHead'),panel=document.getElementById('saranPanel'),
        form=document.getElementById('saranForm'),inName=document.getElementById('saranNama'),inText=document.getElementById('saranIsi'),
        count=document.getElementById('saranCount'),err=document.getElementById('saranErr'),send=document.getElementById('saranSend'),
        toast=document.getElementById('toast'),toastText=document.getElementById('toastText'),
        thanks=document.getElementById('thanks'),strips=document.getElementById('thanksStrips'),
        tName=document.getElementById('thanksName'),back=document.getElementById('thanksBack');

  for(let i=0;i<8;i++){const s=document.createElement('i');s.style.setProperty('--i',i);strips.appendChild(s)}

  let busy=false,toastTimer;

  /* buka / tutup kotak */
  function setOpen(open){
    box.classList.toggle('open',open);
    head.setAttribute('aria-expanded',String(open));
    panel.inert=!open;
  }
  head.addEventListener('click',()=>{
    const open=!box.classList.contains('open');
    setOpen(open);
    if(open)setTimeout(()=>{inName.focus({preventScroll:true});box.scrollIntoView({behavior:'smooth',block:'center'})},650);
  });

  inText.addEventListener('input',()=>{count.textContent=inText.value.length+' / 500';err.textContent=''});
  inName.addEventListener('input',()=>{err.textContent=''});

  /* simpan ke localStorage (cadangan kalau SERVER_URL kosong) */
  function saveLocal(item){
    try{
      let d=[];
      try{d=JSON.parse(localStorage.getItem(KEY))||[]}catch(e){}
      d.push(item);
      localStorage.setItem(KEY,JSON.stringify(d));
      return true;
    }catch(e){return false}
  }

  /* kirim ke server (Flask lewat ngrok, atau Vercel Function); hasilnya true kalau berhasil */
  async function save(item){
    if(!SERVER_URL)return saveLocal(item);
    const ctl=new AbortController(),t=setTimeout(()=>ctl.abort(),12000);
    try{
      const res=await fetch(SERVER_URL,{method:'POST',headers:{'ngrok-skip-browser-warning':'1'},body:JSON.stringify(item),signal:ctl.signal});
      const out=await res.json();
      return out.ok===true;
    }catch(e){return false}
    finally{clearTimeout(t)}
  }

  /* notif pop kecil */
  function showToast(msg,isErr){
    clearTimeout(toastTimer);
    toastText.textContent=msg;
    toast.classList.toggle('err',!!isErr);
    toast.classList.remove('show');void toast.offsetWidth;toast.classList.add('show');
    toastTimer=setTimeout(()=>toast.classList.remove('show'),isErr?3200:1500);
  }

  /* layar terima kasih */
  function openThanks(nama){
    tName.textContent=nama; // textContent: aman dari kode berbahaya
    const n=nama.length;
    tName.style.setProperty('--k',n>24?.5:n>16?.68:n>10?.85:1);
    thanks.setAttribute('aria-hidden','false');
    document.body.classList.add('is-thanks');
    thanks.classList.add('open');
    setTimeout(()=>{form.reset();count.textContent='0 / 500';setOpen(false)},1500); // dikosongkan saat layar tertutup strip
    setTimeout(()=>back.focus({preventScroll:true}),2600);
  }
  function closeThanks(){
    if(!thanks.classList.contains('open')||thanks.classList.contains('closing'))return;
    thanks.classList.add('closing');
    setTimeout(()=>{
      thanks.classList.remove('open','closing');
      thanks.setAttribute('aria-hidden','true');
      document.body.classList.remove('is-thanks');
      busy=false;send.disabled=false;
    },1600);
  }
  back.addEventListener('click',closeThanks);
  addEventListener('keydown',e=>{
    if(e.key==='Escape')closeThanks();
    if(e.key==='Tab'&&thanks.classList.contains('open')){e.preventDefault();back.focus()}
  });

  /* kirim */
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    if(busy)return;
    const nama=inName.value.trim().replace(/\s+/g,' '),saran=inText.value.trim();
    if(!nama){err.textContent='Tulis namamu dulu ya.';inName.focus();return}
    if(!saran){err.textContent='Tulis saran atau kritikmu dulu ya.';inText.focus();return}
    busy=true;send.disabled=true;send.textContent='Mengirim...';
    const ok=await save({nama:nama,saran:saran,waktu:new Date().toISOString()});
    send.textContent='Kirim saran';
    if(!ok){
      busy=false;send.disabled=false;
      showToast('Data belum tersimpan. Coba kirim lagi.',true);
      return;
    }
    showToast('Data tersimpan');
    setTimeout(()=>openThanks(nama),1700);
  });
})();