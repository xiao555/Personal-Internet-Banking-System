$(document).ready(function(){
  // 验证身份证
  function isCardNo(card) {
     var pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
     return pattern.test(card);
  };
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
    if(cardID&&name&&password&&confirmPassword&&id&&trueName&&captcha) {
      if(cardID < 100000000 || cardID > 999999999) {
        alert("请输入9位卡号");
      } else {
        if(isCardNo(id) == false) {
          alert("请输入正确的身份证号");
        } else {
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
                  alert("error");
                  location.href='/register';
                }
              }
            })//ajax
          } else {
            alert("两次输入密码不一致");
          }
        }
      }
    } else {
      alert("请填写完整");
    }
  });
});
