$(document).ready(function(){
  //刷新验证码
  $('.mod-captcha-area').click(function(e){
    $.ajax({
      type: 'GET',
      url: '/mod-captcha.png',
      success:function(data,status) {
        if(status == 'success') {
          console.log("get mod-captcha.png success");
        }
      },
      error:function(data,status,e) {
        if(status == "error") {
          console.log("get mod-captcha.png error");
        }
      }
    })
    $('.mod-captcha-png').attr("src","/mod-captcha.png");
  });
  //确认修改
  $('.modifi-btn').click(function(e){
    var cardID = $("[name='cardID']").val(),
        name = $("[name='name']").val(),
        id = $("[name='id']").val(),
        trueName = $("[name='trueName']").val(),
        captcha = $("[name='captcha']").val();

    var data = {
        cardID: cardID,
        name: name,
        id: id,
        trueName: trueName,
        captcha: captcha
      }
    $.ajax({
      type: 'POST',
      url: '/modifi',
      data: data,
      success:function(data,status) {
        if(status == 'success') {
          console.log("success");
          location.href='/';
        }
      },
      error:function(data,status,e) {
        if(status == "error") {
          console.log("error");
          location.href='/modifi';
        }
      }
    })
  });
});
