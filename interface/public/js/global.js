
window.setTimeout(function(){
$(".loading").fadeOut(500)
var wow = new WOW({
    boxClass: 'wow',
    animateClass: 'animated',
    offset: 0,
    mobile: true,
    live: true
});
wow.init();
},400)

$(document).ready(function(){
  $(window).load(function () {
          $(".mobile-inner-header-icon").click(function(){
            $(this).toggleClass("mobile-inner-header-icon-click mobile-inner-header-icon-out");
            $(".mobile-inner-nav").slideToggle(250);
          });
          $(".mobile-inner-nav li").each(function( index ) {
            $( this ).css({'animation-delay': (index/10)+'s'});
          });
          $(".mobile-inner-nav li").click(function(){
            $(this).find('dl').slideToggle(200)
          })
        });

})

$(document).ready(function(){


$('.alertModel .shadow').click(function(){
  $('.alertModel').fadeOut(200)
})


function height(){
  var sc = $(window).scrollTop();
  if (sc > 200) {
      $("body").addClass("current");
    } else {
      $("body").removeClass("current");
    }
}
height()
$(window).scroll(function () {
  height()
});


$('.section1 .content table tr,.inputwords .send').click(function(){
  $('.section2').fadeIn(200)
})

$('.section1 .vals .val a').click(function(){
  $('.alertModel').fadeIn(200)
})

});