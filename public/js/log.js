$(document).ready(function(){
  function initMsg(data) {
    $(".cardID").text(data.cardID);
    $(".name").text(data.name);
    $(".password").text(data.password);
    $(".id").text(data.id);
    $(".trueName").text(data.trueName);
    $(".headUrl").text(data.headUrl);
    $(".regDate").text(data.regDate);
  };
  $(".quebutton").click(function(e) {
    var name = $(".queryName").val();
    console.log(name);
    var data = {
      quename: name
    };
    $.ajax({
      url: '/getUserMsg',
      type: 'POST',
      data: data,
      success: function(data) {
        console.log(data);
        initMsg(data.msg);
      },
      error: function(data) {
        alert("error");
      }
    })
  })
  $(".quetrueName").click(function(e) {
    var trueName = $(".querytrueName").val();
    console.log(trueName);
    var data = {
      quename: trueName
    };
    $.ajax({
      url: '/getTrueNameMsg',
      type: 'POST',
      data: data,
      success: function(data) {
        console.log(data);
        initMsg(data.msg);
      },
      error: function(data) {
        alert("error");
      }
    })
  })

});
