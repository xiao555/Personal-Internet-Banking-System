$(document).ready(function(){
  console.log(document.referrer);
  //检测登录 PS:这个请求会在登出后点击后退是服务器端接收一个get /user的请求？？
  $.ajax({
    url: '/user',
    type: 'POST',
    success: function(data) {
      console.log(data.success);
    },
    error: function(data) {
      console.log(data.error);
      alert("未登录");
      //location.href='/';
    }
  })
  //logout
  $('.logout').click(function(e) {
    $.ajax({
      url: '/logout',
      type: 'POST',
      success: function(data) {
        console.log("ok");
        location.href = '/';
      },
      error: function() {
        console.log("error");
      }
    })
  })

  var openFile = function(fileUrl){
    var reader = new FileReader();
    var _this = this;
    reader.readAsDataURL(fileUrl);
    reader.onload = function(){
      var pic = document.getElementById("user-head");
      console.log(pic);
      pic.src = this.result;
      pic.onload = function(){
          console.log("success");
      };
    };
  }
  // change pages
  $(".sidebar-fuc li").click(function(e){
    var tar = $(this).attr('target');
    console.log(tar);
    console.log($(".content-list[target="+tar+"]"));
    $(".content-list").css("display","none");
    $(".content-list[target="+tar+"]").css("display","block");
  });
  //上传头像
  $(".img-file").change(function(e){
    openFile(e.target.files[0]);
  });
  $(".upload-head").click(function(e){
    if($(".img-file").val().length) {
      var fileName = $(".img-file").val();
      var extension = fileName.substring(fileName.lastIndexOf('.'),fileName.length).toLowerCase();
      if(extension == ".jpg" || extension == ".png") {
        var data = new FormData();
        data.append('file',$('.img-file')[0].files[0]);
        $.ajax({
          url: '/upload',
          type: 'POST',
          data: data,
          cache: false,
          contentType: false,
          processData: false,
          success: function(data) {
            location.href='/user';
          },
          error: function() {
            console.log("upload error");
          }
        });
      } else {
        alert("只支持jpg和png格式的文件");
      }
    } else {
      alert("未选择文件");
    }
  })
  //修改信息
  $(".modifiUserMsg").click(function(e) {
    location.href='/modifi';
  })
  //添加其他银行卡
  $(".addCard").click(function(e) {
    location.href='/addCard';
  })
  //删除账户
  $(".delUser").click(function(e) {
    $.ajax({
      type: 'DELETE',
      url: '/delUser',
      success: function(data) {
        location.href='/';
      },
      error: function(dara) {
        alert('error');
      }
    })
  })
})
