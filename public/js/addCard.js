$(document).ready(function(){
  $('.add-btn').click(function(e){
    var cardID = $("[name='cardID']").val();
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
  });
});
