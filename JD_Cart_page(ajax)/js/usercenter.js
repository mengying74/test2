/**为所有的Date对象添加一个新的成员方法，转换为形如y-m-d<br>h:m:s**/
Date.prototype.stringify = function(){
  var s = this.getFullYear()+'-';
  s += (this.getMonth()+1)+'-';
  s += this.getDate()+'<br>';
  s += this.getHours()+':';
  s += this.getMinutes()+':';
  s += this.getSeconds();
  return s;
}

/**功能点0：检验当前是否已经登录*********************/
if(!sessionStorage['loginName']){
  location.href = 'productlist.html'; //未登录的话跳转到登录页
}

/**功能点1：异步加载页头和页尾**********************/
$('#header').load('header.php',function(){
  $('#welcome').html('欢迎回来：'+sessionStorage['loginName']);
});
$('#footer').load('footer.php');

/**功能点2：为附加导航中项添加事件监听，进行内容切换**/
$('.affix ul li a').click(function (e) {
  e.preventDefault();
  //修改li的.active的位置
  $(this).parent()
         .addClass('active')
         .siblings('.active')
         .removeClass('active');
  //修改右侧主体中的div的.active位置
  var id=$(this).attr('href');
  $(id).addClass('active').siblings('.active').removeClass('active');
});


/**功能点3：异步请求当前登录用户的所有订单****************/
$.ajax({
  type:'GET',
  url:'data/7_order_select.php',
  data:{uname:sessionStorage['loginName']},
  success:function(orderList){
    // console.log(orderList);
    //遍历订单数组，拼接HTML字符串
    var html='';
    $.each(orderList,function(i,order){
      html+=`
        <tr>
          <td colspan="6">
            订单编号：${order.orderNum}
            <span>${order.shopName}</span>
          </td>
        </tr>
        <tr>
          <td> `;
      $.each(order.productList,function(j,p){
        html+=`<a href="#"><img src="${p.pic}"></a>`;
      });
      html+=`
        </td>
        <td>
          ${order.rcvName}
        </td>
        <td>
          ￥${order.price}<br>
          ${order.payment=='1'?'货到付款':(order.payment=='2'?'京东支付':(order.payment=='3'?'支付宝支付':'在线支付'))}
        </td>
        <td>
          ${order.orderTime}<br>
        </td>
        <td>
          ${order.status}
        </td>
        <td>
          <a href="#">查看</a><br>
          <a href="#">评价</a><br>
          <a href="#">晒单</a><br>
          <a href="#">还要买</a>
        </td>
       </tr> `;
    });
    $('#order-table tbody').html(html);
    //把所有的日期对应的数字转换为年月日格式
    var jqObj = $('#order-table tbody td:nth-child(4)');
    jqObj.each(function(i,td){
      var num = td.innerHTML;
      var str = new Date(parseInt(num)).stringify();
      td.innerHTML = str;
    });

  }
});

/**功能点4：页面加载完成后，异步请求当前登录用户的消费统计数据，绘制Canvas统计图********/
$.ajax({
  type:'GET',
  url:'data/8_buy_stat.php',
  data:{uname:sessionStorage['loginName']},
  success:function (list) {
    // console.log('接受统计数据消息')
    console.log(list);
    //根据获得的数据绘制Canvas统计图

    /***绘图必需的变量***/
    var w=800;  //画布的宽
    var h=500;  //画布的高
    var count=list.length;  //数据的个数
    var padding=80;  //内容到画布边界的距离
    var barWidth=(w-2*padding)/(2*count+1); //Y轴上坐标点间距
    var yPointCount = 6;  //Y轴上坐标点的数量
    var yPointSpacing = (h-2*padding)/(yPointCount); //Y轴上坐标点间距
    var origin={x:padding,y:h-padding};  //坐标轴原点的坐标
    var xEnd={x:w-padding,y:h-padding};  //x轴端点
    var yEnd={x:padding,y:padding};   //Y轴端点

    /***开始绘制***/
    //var ctx = $('#canvas-buy-stat')[0].getContext('2d');
    var canvas = document.getElementById('canvas-buy-stat');
    canvas.width=w;
    canvas.height=h;
    var ctx=canvas.getContext('2d');
    ctx.textBaseline='bottom';//文本基线设置为第四线
    ctx.font='12px SimHei';


    //1绘制X轴及上面的坐标点
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y); //挪到原点
    ctx.lineTo(xEnd.x, xEnd.y); //到X轴端点画线
    ctx.lineTo(xEnd.x-10, xEnd.y-5);//到X轴箭头
    ctx.moveTo(xEnd.x, xEnd.y); //到X轴端点
    ctx.lineTo(xEnd.x-10, xEnd.y+5); //X轴箭头
    for(var i=0;i<count;i++){
      var x=origin.x+(2*i+1)*barWidth;
      var y=origin.y;
      ctx.moveTo(x,y);  //X轴坐标点起点
      ctx.lineTo(x,y-5);//X轴坐标点终点
      var txt=list[i].label;
      var txtWidth=ctx.measureText(txt).width;
      ctx.fillText(txt,x-txtWidth/2,y+18);
    }

    //2绘制Y轴及上面的坐标点
    ctx.moveTo(origin.x, origin.y); //挪到原点
    ctx.lineTo(yEnd.x, yEnd.y); //到Y轴端点画线
    ctx.lineTo(yEnd.x-5, yEnd.y+10);//到Y轴箭头
    ctx.moveTo(yEnd.x, yEnd.y); //到Y轴端点
    ctx.lineTo(yEnd.x+5, yEnd.y+10); //Y轴箭头
    //计算所有消费金额中的最大值
    var max=list[0].value;
    for(var i=0;i<count;i++){
      if(list[i].value>max){
        max=list[i].value;
      }
    }
    //Y轴两个坐标点表示的金额的间距
    var valueSpacing=parseInt(max/yPointCount);
    for(var i=0;i<yPointCount-1;i++){
      var x=origin.x;
      var y=origin.y-(i+1)*yPointSpacing;
      ctx.moveTo(x,y);
      ctx.lineTo(x+5,y);
      var txt=(i+1)*valueSpacing;
      var txtWidth=ctx.measureText(txt).width;
      ctx.fillText(txt,x-txtWidth-3,y+7);
    }
    ctx.stroke();

    //3绘制柱状图
    for(var i=0;i<count;i++){
      var barHeight=(list[i].value)*(h-2*padding)/(max);
      var x=origin.x+(2*i+1)*barWidth-barWidth/2;
      var y=origin.y-barHeight;
      ctx.strokeRect(x,y,barWidth,barHeight);
      //绘制折线
      //填充渐变色
      var g= ctx.createLinearGradient(x,y,x,y+barHeight);
      g.addColorStop(0,rc(50,230));
      g.addColorStop(1,'#fff');
      ctx.fillStyle = g;
      ctx.fillRect(x,y,barWidth,barHeight);
      //绘制文本——当前柱表示的值
      var txt=list[i].value;
      var txtWidth=ctx.measureText(txt).width;
      ctx.fillText(txt,x,y);
    }
    function rn(min,max){
      return Math.floor(Math.random()*(max-min)+min);
    }
    function rc(min,max){
      var r=rn(min,max);
      var g=rn(min,max);
      var b=rn(min,max);
      return `rgb(${r},${g},${b})`;
    }
    //4绘制折线图????
    for(var i=0;i<count;i++){
      var barHeight=(list[i].value)*(h-2*padding)/(max);
      var x=origin.x+(2*i+1)*barWidth-barWidth/2;
      var y=origin.y-barHeight;
      ctx.strokeStyle='#000';
      ctx.moveTo(x,y);
      ctx.lineTo(x,y);
    }
  }
});

/**功能点5：页面加载完成后，异步请求当前登录用户的消费统计数据，绘制SVG统计图——使用第三方绘图库：FusionCharts**/
$.ajax({
  type:'GET',
  url:'data/8_buy_stat.php',
  data:{uname:sessionStorage['loginName']},
  success:function (list) {
    //list:[{label:'',value:''},{}];
    //使用FusionCharts绘制统计图
    var fc=new FusionCharts({
      type:'column3d',//column2d、column3d、bar2d、bar3d、pie2d、pie3d、doughnut2d、doughnut3d
      width:'800',
      height:'400',
      dataSource:{//指定数据源
        data:list
      }
    });
    fc.render('container-buy-stat-svg');
  }
});

/**功能点6：页面加载完后，异步请求登录用户的抽奖统计信息**/
$.ajax({
  type:'GET',
  url:'data/9_lottery_stat.php',
  data:{uname:sessionStorage['loginName']},
  success:function(result){
    //result形如：{uname:xx,uid:xx,totalCount:xx,usedCount:xx,leftCount:xx}
    // console.log(result);
    if(result.leftCount<=0){
      alert('剩余抽奖次数为0');
      return;
    }
    $('#bt-lottery').html(`
      开始抽奖(总次数:${result.totalCount},
      剩余此时:${result.leftCount})`).prop('disabled',false
    );//启用按钮
    /**绘制抽奖的界面*******************/
    drawLottery();
    function drawLottery() {
      var progress=0;
      var pan=new Image();//圆盘图片
      pan.src='img/pan.png';
      pan.onload=function () {
        progress+=80;
        if(progress==100){
          startDraw();
        }
      }
      var pin =new Image();//指针图片
      pin.src='img/pin.png';
      pin.onload=function () {
        progress+=20;
        if(progress==100){
          startDraw();
        }
      }
      function startDraw(){
        var canvas=document.querySelector('#canvas-lottery');
        canvas.width=pan.width;
        canvas.height=pan.height;
        var ctx=canvas.getContext('2d');
        ctx.drawImage(pan,0,0);
        ctx.drawImage(pin,canvas.width/2-pin.width/2,canvas.height/2-pin.height/2);
        //为“开始抽奖”按钮绑定一次监听函数
        $("#bt-lottery").one('click',function(){
          //允许旋转的总时长
          var duration=Math.random()*4000+5000;
          //当前已经旋转的持续时长
          var last=0;
          var degree=0;
          //平移坐标系的原点——旋转的轴点——让它平移到画布中央
          ctx.translate(canvas.width/2,canvas.height/2);
          var timer=setInterval(function () {
            //degree += speedFn(duration,last);
            degree+=5;
            degree%=360;  //370和10度是等价的
            ctx.rotate(degree*Math.PI/180);
            ctx.drawImage(pan,-pan.width/2,-pan.height/2);
            ctx.rotate(-degree*Math.PI/180);
            ctx.drawImage(pin,-pin.width/2,-pin.height/2);

            last+=16.7;
            if(last>=duration){
              clearInterval(timer);
              //把坐标系原点平移回到画布左上角，为下一次抽奖做准备
              ctx.translate(-canvas.width/2,-canvas.height/2);

              var level=0;
              if(degree>=270&&degree<300){
                level=1;
              }else if((degree>=0&&degree<30)||(degree>=210&&degree<240)){
                level=2;
              }else if((degree>=30&&degree<60)||(degree>=90&&degree<120)||(degree>=150&&degree<180)||(degree>=300&&degree<330)){
                level=3;
              }else{
                level=4;
              }
              //给用户以提示并异步提交给服务器：lottery_add.php
              alert('所获奖项:'+level);
            }
          },16.7);
        });
      }
    }
  }
});

function speedFn(duration,last) {
  var speed=0;
  return speed;

}



















