
// باز و بسته‌کردن امن زیرمنوهای چندسطحی در موبایل/دسکتاپ
document.querySelectorAll('.mega-menu .row > .col-12.col-lg-4 > h6').forEach(function(el){
  el.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();


    // باز/بسته کردن منوی فعلی
    this.nextElementSibling.classList.toggle('show');
  });
});
// AOS
    AOS.init({ duration: 750, once: true, offset: 80 });

    // سال فوتر
    document.getElementById('year').textContent = new Date().getFullYear();

    // کانترها
    const io = new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          const el=e.target.querySelector('.counter'); const target=+e.target.getAttribute('data-counter');
          let n=0, step=Math.max(1,Math.floor(target/60));
          const t=setInterval(()=>{ n+=step; if(n>=target){n=target; clearInterval(t)} el.textContent=n },16);
          io.unobserve(e.target);
        }
      })
    },{threshold:.5});
    document.querySelectorAll('[data-counter]').forEach(c=>io.observe(c));

    // اسلایدرها
    new Swiper('.ann-swiper',{slidesPerView:1.1,spaceBetween:16,navigation:{nextEl:'.ann-next',prevEl:'.ann-prev'},breakpoints:{640:{slidesPerView:2.2},1024:{slidesPerView:3.2}}});
    new Swiper('.clients-swiper',{slidesPerView:1.1,spaceBetween:16,loop: true,speed: 700,navigation:{nextEl:'#clients .swiper-button-next',prevEl:'#clients .swiper-button-prev'},breakpoints:{640:{slidesPerView:2.2},1024:{slidesPerView:4.2}}});
    var $j = jQuery.noConflict();
    $j(function(){
        $j("#totop-btn").click(scrollTop);
        $j(window).scroll(function() {
            $j(window).scrollTop() > 777 ? $j("#totop-btn").addClass("active") : $j("#totop-btn").removeClass("active")
        });
    });
function scrollTop() {
    $j("html, body").animate({
        scrollTop: 0
    }, "slow");
}


  
  // ===== پنل دسترس‌پذیری =====
  const $ = s=>document.querySelector(s);
  const $$ = s=>document.querySelectorAll(s);
  const body=document.body, html=document.documentElement;

  // پیش‌فرض‌ها و مهاجرت از نسخه قدیمی (boolean -> سه‌حالته)
  const defaults = { font:100, lh:0, hc:0, bw:0, imgmode:0, ul:0, theme:'#0664b7' };
  const migrate = (p)=>{
    const o={...p};
    if (typeof o.lh === 'boolean') o.lh = o.lh ? 1 : 0;
    if (typeof o.hc === 'boolean') o.hc = o.hc ? 1 : 0;
    if (typeof o.bw === 'boolean') o.bw = o.bw ? 2 : 0;           // قبلاً سیاه‌وسفید = فعال/غیرفعال
    if (typeof o.noimg === 'boolean') { o.imgmode = o.noimg ? 2 : 0; delete o.noimg; }
    if (typeof o.underline === 'boolean') { o.ul = o.underline ? 2 : 0; delete o.underline; }
    return o;
  };

  const getPrefs = ()=>{
    const raw = JSON.parse(localStorage.getItem('accPrefs')||'{}');
    return { ...defaults, ...migrate(raw) };
  };
  const savePrefs = p=>localStorage.setItem('accPrefs', JSON.stringify(p));

  const syncTriSwitch = (p)=>{
    $$('.tri-switch').forEach(group=>{
      const key = group.dataset.key;
      const val = Number(p[key] ?? 0);
      group.querySelectorAll('button').forEach(btn=>{
        const v = Number(btn.dataset.val);
        btn.classList.toggle('active', v===val);
        btn.setAttribute('aria-pressed', v===val ? 'true' : 'false');
      });
    });
  };

  const applyPrefs = p=>{
    // اندازه فونت
    html.style.fontSize = p.font+'%';

    // پاک‌سازی کلاس‌های قدیمی/جدید
    body.classList.remove('lh-boost','hc','bw','no-images','underline-links');
    body.classList.remove('lh-1','lh-2','img-1','img-2','ul-1','ul-2');

    // فاصله خطوط
    if (p.lh===1) body.classList.add('lh-1');
    else if (p.lh===2) body.classList.add('lh-2');

    // تصاویر
    if (p.imgmode===1) body.classList.add('img-1');       // بلور
    else if (p.imgmode===2) body.classList.add('img-2');  // عدم نمایش

    // زیرخط لینک‌ها
    if (p.ul===1) body.classList.add('ul-1');   // فقط روی هاور
    else if (p.ul===2) body.classList.add('ul-2'); // همیشه

    // فیلتر ترکیبی (کنتراست + سیاه‌وسفید)
    const filters = [];
    if (p.hc===1) filters.push('contrast(1.2)');
    else if (p.hc===2) filters.push('contrast(1.5)');
    if (p.bw===1) filters.push('grayscale(0.6)');
    else if (p.bw===2) filters.push('grayscale(1)');
    html.style.setProperty('--acc-filter', filters.join(' ') || 'none');

    // رنگ برند
    document.documentElement.style.setProperty('--brand', p.theme);

    // همگام‌سازی UI
    syncTriSwitch(p);
  };

  let prefs = getPrefs();
  applyPrefs(prefs);

  // باز/بسته پنل
  const panel=$('#accPanel'), btn=$('#accToggle'), close=$('#accClose');
  btn.onclick = ()=>panel.classList.toggle('d-none');
  close.onclick = ()=>panel.classList.add('d-none');

  // فونت +/-/reset
  document.querySelectorAll('[data-fs]').forEach(b=>{
    b.onclick=()=>{
      const d=parseInt(b.dataset.fs,10);
      prefs.font = d===0 ? 100 : Math.min(150, Math.max(80, prefs.font + d));
      applyPrefs(prefs); savePrefs(prefs);
    }
  });

  // سوییچ‌های سه‌حالته
  $$('.tri-switch button').forEach(btn=>{
    btn.onclick=()=>{
      const key = btn.closest('.tri-switch').dataset.key;
      prefs[key] = Number(btn.dataset.val);
      applyPrefs(prefs); savePrefs(prefs);
    };
  });

  // انتخاب رنگ تم
  document.querySelectorAll('.theme-dot').forEach(t=>{
    t.onclick=()=>{ prefs.theme=t.dataset.color; applyPrefs(prefs); savePrefs(prefs); }
  });

  // ریست
  $('#accReset').onclick=()=>{
    prefs = { ...defaults };
    applyPrefs(prefs); savePrefs(prefs);
  };

document.querySelectorAll('[data-fs]').forEach(b => b.dataset.active = (parseInt(b.dataset.fs,10)===0 ? (prefs.font===100?1:0) : 0));

