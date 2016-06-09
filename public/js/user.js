$(document).ready(function(){
  // 验证手机号
  function isPhoneNo(phone) {
      var pattern = /^1[34578]\d{9}$/;
      return pattern.test(phone);
  }
  //initDetail
  function initDetail(data) {
    var detail = $(".detail-list");
    detail.find("tr").remove();
    detail.append(
      '<tr>'+
        '<th>交易日期</th>'+
        '<th>交易方式</th>'+
        '<th>支出金额</th>'+
        '<th>收入金额</th>'+
        '<th>对方卡号</th>'+
        '<th>对方户名</th>'+
        '<th>余额</th>'+
      '</tr>'
    );
    console.log(data);
    for(var i=0;i<data.length;i++) {
      detail.append(
        '<tr>'+
        '<td>'+ data[i].date +'</td>'+
        '<td>'+ data[i].method +'</td>'+
        '<td>'+ data[i].out +'</td>'+
        '<td>'+ data[i].in +'</td>'+
        '<td>'+ data[i].opCard +'</td>'+
        '<td>'+ data[i].opName +'</td>'+
        '<td>'+ data[i].balance +'</td>'+
        '</tr>'
      );
    }

  }

  //Detail
  function detail(e) {
    var _cardID = $(".date-cardID").text();
    console.log(_cardID);
    var data = {
      cardID: _cardID
    };
    $.ajax({
      url: '/getDetail',
      type: 'POST',
      data: data,
      success: function(data) {
        initDetail(data.details);
        console.log("get detail success");
      },
      error: function(data) {
        alert("get detail error");
      }
    })
  }
  $(".selCardId-detail").change(function(e) {
    detail();
  })

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
    if(tar == "list3") detail();
    //console.log(tar);
    //console.log($(".content-list[target="+tar+"]"));
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
  //转账
  $(".transfer").click(function(e) {
    var fromID = $("#cardID").text(),
        transNum = $("[name='transferNum']").val(),
        fromIDBal = $("#balance").text(),
        toID = $("[name='transferID']").val(),
        toName = $("[name='transferName']").val();
    console.log(transNum);
    console.log(toID);
    if(toID||toName||transNum) {
      if(parseInt(transNum) > parseInt(fromIDBal)) {
        console.log(transNum);
        console.log(fromIDBal);
        alert("你还想转多少？");
      } else {
        var data = {
          fromID: fromID,
          transNum: transNum,
          toID: toID,
          toName: toName
        };
        $.ajax({
          url: '/transfer',
          type: 'POST',
          data: data,
          success: function(data) {
            location.href='/user';
          },
          error: function(data) {
            console.log(data);
            alert("转账失败: "+data.responseJSON.error);
          }
        })
      }
    } else {
      alert("请填写完整！");
    }
  })
  $("[name='phoneRecharge']").click(function(e) {
    var phone = $("[name='phoneNum']").val(),
        cardID = $(".selCardId-phone").find("option:selected").text(),
        money = $("input[name='money']:checked").val();
    console.log(phone);
    console.log(cardID);
    console.log(money);
    if(phone&&money&&cardID) {
      if(isPhoneNo(phone) == false) {
        alert("请输入正确的电话号码");
      } else {
        var data = {
          cardID: cardID,
          phone: phone,
          money: money
        };
        $.ajax({
          url: '/phoneRecharge',
          type: 'POST',
          data: data,
          success: function(data) {
            alert("充值成功");
            location.href="/user";
          },
          error: function(data) {
            alert("充值失败: "+ data.responseJSON.error);
          }
        })//ajax
      }
    } else {
      alert("请填写完整");
    }
  })


})
