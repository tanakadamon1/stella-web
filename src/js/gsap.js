import { gsap } from "gsap";
    
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from '@studio-freight/lenis'



gsap.registerPlugin(ScrollTrigger);

// kv
const h2 = document.querySelectorAll('.h2')
h2.forEach(element => {
    gsap.from(element, {
        y: 90,
        scrollTrigger: {
            trigger: element,
            start: 'top 50%',
            end: '50% 50%',
            scrub: 2,
        }
    });    
});



var fadein = document.querySelectorAll('.fadein')
fadein.forEach( e => {
    gsap.from(e,{
        scale: .9,
        y: -20,
        opacity: 0,
        scrollTrigger: {
            trigger : e,
            start: '0% 80%',
            end: '20% 50%',
            scrub: .5,
            once: false,
            // markers: true,
            ease: "power1.out",
        }
    })
})

var item = document.querySelectorAll('.item')
item.forEach( e => {
    gsap.from(e,{
        scale: 0,
        scrollTrigger: {
            trigger : e,
            start: '0% 80%',
            end: '20% 50%',
            scrub: .5,
            once: false,
            // markers: true,
            ease: "power1.out",
        }
    })
})





gsap.from('.bg_sky_blue', {
    background: '#000304',
    scrollTrigger:{
        trigger: '.bg_sky_blue',
        start: '20% 60%',
        end: '70% 50%',
        scrub: true,
        ease: "power1.in",
    }
})




window.addEventListener("DOMContentLoaded", () => {
    const tl_load = gsap.timeline()
    // ロードアニメーション
    tl_load.to('.now', {
        x: -300
    })
    .to('.now', 2, {
        x: -100
    })
    .to('.now', 1, {
        x: 0,
    });
    
    const counterElement = document.querySelector('.percent');
    const tl_percent = gsap.timeline();
    tl_percent.to({ value: 0 }, {
        value: 70,
        duration: 2,
        onUpdate: function () {
            counterElement.textContent = Math.floor(this.targets()[0].value) + '%';
          },
    })
    .to({ value: 70 }, {
        value: 100,
        duration: 1,
        onUpdate: function () {
            counterElement.textContent = Math.floor(this.targets()[0].value) + '%';
          },
    })
    


    const tl_load_thumbnail = gsap.timeline();
    tl_load_thumbnail.from(".thumbnail",{
        scale: 0,
        delay: 1,
        duration: 2
    })
    .from('.thumbnail', {
        rotateY: 180,
    }, "-=1.8" );


    setTimeout(() => {
        load_end();
      }, 5000); // 1秒待機してから実行


});
function load_end() {
    const tl_load_box = gsap.timeline();
    tl_load_box.to('.load', {
        autoAlpha: 1
    })
    .to('.load', 1, {
        autoAlpha: 0
    });

    document.body.classList.remove('loading');

    // tl_load_navを実行
    const tl_load_nav = gsap.timeline();
    tl_load_nav.to(".nav", {
        x: 0
    });
    tl_load_box.add(tl_load_nav);
}




// nav
const nav = document.querySelector(".nav");
const navBtn = document.querySelector(".nav_btn");
const navSpan = document.querySelectorAll(".nav_btn span");

let isMenuOpen = false;

navBtn.addEventListener("click", () => {
if (!isMenuOpen) {
    gsap.to(nav, { x: "250", duration: 0.5, ease: "power2.out" });
    gsap.to(navSpan[0], { rotateZ: -45, translateX: -6, duration: 0.5, ease: "power2.out" });
    gsap.to(navSpan[1], { opacity: 0, duration: 0.5, ease: "power2.out" });
    gsap.to(navSpan[2], { rotateZ: 45, translateX: -6, duration: 0.5, ease: "power2.out" });
} else {
    gsap.to(nav, { x: "0", duration: 0.5, ease: "power2.in" });
    gsap.to(navSpan[0], { rotateZ: 0, translateX: 0, duration: 0.5, ease: "power2.in" });
    gsap.to(navSpan[1], { opacity: 1, duration: 0.5, ease: "power2.in" });
    gsap.to(navSpan[2], { rotateZ: 0, translateX: 0, duration: 0.5, ease: "power2.in" });
}
isMenuOpen = !isMenuOpen;
});




// Lenisを初期化
const lenis = new Lenis()

// requestAnimationFrameを使用してスクロールを継続的に更新
function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)