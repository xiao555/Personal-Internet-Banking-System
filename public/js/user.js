$(document).ready(function(){
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
})
