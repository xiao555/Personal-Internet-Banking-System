$(document).ready(function(){
  // 验证身份证
  function isCardNo(card) {
     var pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
     return pattern.test(card);
  };
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
    var name = $("[name='name']").val(),
        id = $("[name='id']").val(),
        trueName = $("[name='trueName']").val(),
        captcha = $("[name='captcha']").val();
    if (isCardNo(id) == false) {
      alert("请输入正确的身份证号");
    } else {
      var data = {
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
            alert("修改成功！");
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
    }
  });
});
