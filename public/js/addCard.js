$(document).ready(function(){
  $('.add-btn').click(function(e){
    var cardID = $("[name='cardID']").val();
    if(cardID >= 100000000 && cardID <= 999999999) {
      var data = {
        cardID: cardID
      };
      $.ajax({
        type: 'POST',
        url: '/addCard',
        data: data,
        success:function(data,status) {
          if(status == 'success') {
            console.log("success");
            alert("添加成功！");
            location.href='/user';
          }
        },
        error:function(data,status,e) {
          if(status == "error") {
            console.log("error");
            location.href='/addCard';
          }
        }
      })
    } else {
      alert("请输入9位卡号");
    }

  });
});
