$(document).ready(function(){
  //刷新验证码
  $('.captcha-area').click(function(e){
    $.ajax({
      type: 'GET',
      url: '/captcha.png',
      success:function(data,status) {
        if(status == 'success') {
          console.log("get captcha.png success");
        }
      },
      error:function(data,status,e) {
        if(status == "error") {
          console.log("get captcha.png error");
        }
      }
    })
    $('.captcha-png').attr("src","/captcha.png");
  });
  //登录
  $("#input-captcha").keyup(function(e){
    if(e.keyCode == 13) {
      console.log("commit");
      commit();
    }
  })

  $("#login").click(function(){
    console.log("commit");
    commit();
  })
  var commit = function(e){
    var name = $('#name').val(),
        password = $('#password').val(),
        captcha = $('#input-captcha').val();
        console.log(captcha);
    var data = {
          name: name,
          password: password,
          captcha: captcha,
        }
    $.ajax({
      type: 'POST',
      url: '/',
      data: data,
      success:function(data,status) {
        if(status == 'success') {
          console.log("success");
          location.href='/user';
        }
      },
      error:function(data,status,e) {
        if(status == "error") {
          console.log("error");
          location.href='/';
        }
      }
    })
  }
});
