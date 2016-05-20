$(document).ready(function(){
  $('.reg-captcha-area').click(function(e){
    $.ajax({
      type: 'GET',
      url: '/reg-captcha.png',
      success:function(data,status) {
        if(status == 'success') {
          console.log("get reg-captcha.png success");
        }
      },
      error:function(data,status,e) {
        if(status == "error") {
          console.log("get reg-captcha.png error");
        }
      }
    })
    $('.reg-captcha-png').attr("src","/reg-captcha.png");
  });
  $('.register-btn').click(function(e){
    var cardID = $("[name='cardID']").val(),
        name = $("[name='name']").val(),
        password = $("[name='password']").val(),
        confirmPassword = $("[name='confirmPassword']").val(),
        id = $("[name='id']").val(),
        trueName = $("[name='trueName']").val(),
        captcha = $("[name='captcha']").val();
    if(password == confirmPassword) {
      var data = {
        cardID: cardID,
        name: name,
        password: password,
        id: id,
        trueName: trueName,
        captcha: captcha
      };
      $.ajax({
        type: 'POST',
        url: '/register',
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
            location.href='/register';
          }
        }

      })
    } else {
      alert("两次输入密码不一致");
    }

  });
});
