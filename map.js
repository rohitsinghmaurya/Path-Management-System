window.addEventListener('load',function(){
    document.querySelector('#firstpage h1').classList.add('loaded');
});

setTimeout(()=>{
      document.getElementById('firstpage').style.opacity = '0';
      setTimeout(()=>{
         document.getElementById('firstpage').style.display = 'none';
         document.getElementById('mainpage').style.opacity = '1';
      },500);
},2000);


var crsr = document.querySelector(".cursor");
var crsrbl = document.querySelector(".cursor-blur");

document.addEventListener("mousemove",function(dets){
      crsr.style.left = dets.x+30+"px"
      crsr.style.top =  dets.y+"px"
      crsrbl.style.left = dets.x-250+"px"
      crsrbl.style.top  = dets.y-250+"px"
})

var h4all = document.querySelectorAll(".nav h4");
 
h4all.forEach(function(elem){
       elem.addEventListener("mouseenter",function(){
           crsr.style.scale = 3
           crsr.style.border = "1px solid white"
           crsr.style.backgroundColor = "transparent"
       })

       elem.addEventListener("mouseleave",function(){
           crsr.style.scale = 1
           crsr.style.border = "0px solid #95C11E"
           crsr.style.backgroundColor = "#95C11E"
       })
})

gsap.to(".nav",{
       backgroundColor:"black",
      height:"110px",
      duration:0.5,
      scrollTrigger:{
          trigger:".nav",
          scroller:"body",
          start:"top -10%",
          end:"top -11%",
          scrub:1
      }
})

gsap.to(".main",{
     backgroundColor:"black",
     scrollTrigger:{
         trigger:".main",
         scrollger:"body",
         start:"top -25%",
         end:"top -100%",
         scrub:2
     }
})


gsap.from(".about-us img,.about-us-in",{
      y:50,
      opacity:0,
      duration:1,
      scrollTrigger:{
        trigger:".about-us",
        scroller:"body",
        start:"top 67%",
        end:"top 65%",
        scrub:0.5
      }
})
