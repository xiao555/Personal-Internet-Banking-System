$(document).ready(function(){
  // change pages
  $(".sidebar-fuc li").click(function(e){
    var tar = $(this).attr('target');
    console.log(tar);
    console.log($(".content-list[target="+tar+"]"));
    $(".content-list").css("display","none");
    $(".content-list[target="+tar+"]").css("display","block");
  })
})
