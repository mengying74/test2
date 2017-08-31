/**功能点0：检验当前是否已经登录**/
if(!sessionStorage['loginName']){
  location.href = 'productlist.html'; //未登录的话跳转到登录页
}

/**功能点1：异步加载页头和页尾**/
$('#header').load('header.php',function(){
  $('#welcome').html('欢迎回来：'+sessionStorage['loginName']);
});
$('#footer').load('footer.php');

/**功能点2：当用户改选了支付方式时，修改payment的值**/
$('.payment-list li').click(function(){
  $(this).addClass('payment-item-selected').siblings('.payment-item-selected').removeClass('payment-item-selected');
  //修改隐藏域payment的值
  var i = $('.payment-list li').index(this); //0/1/2/3
  $('input[name="payment"]').val(i+1);
});

/**功能点3：根据当前登录用户名，查询其购物车内容**/
$(function(){
  $.ajax({
    url: 'data/4_cart_detail.php',
    data: {uname: sessionStorage['loginName']},
    success: function(detailList){
      //遍历购物车详情列表，拼接HTML片段，添加到展示列表
      console.log(detailList);
      var html = '';
      var totalPrice = 0;  //购物车总金额
      $.each(detailList, function(i, d){
        totalPrice += d.price*d.count; //计算总金额
        html += `
        <div class="goods-item">
                <div class="p-img">
                  <a target="_blank" href=""><img src="${d.pic}" alt=""></a>
                </div>
                <div class="p-name">
                  <a href="" target="_blank">
                    ${d.pname}
                  </a>
                </div>
                <div class="p-price">
                  <strong class="jd-price">￥${d.price}</strong>
                  <span class="p-num">x${d.count}</span>
                  <span class="p-state">有货</span>
                </div>
              </div>
        `;
      });
      $('.goods-items').html(html);
      $('.price-num').html('￥'+totalPrice);//修改总金额
      $('input[name="price"]').val(totalPrice);

      //精简购物车详情数组，编码为JSON字符串，赋值给input隐藏域用于表单
      $.each(detailList,function(i,d){
        delete(d.cartId);  //只保留productId和count
        delete(d.did);
        delete(d.pic);
        delete(d.pname);
        delete(d.price);
      })
      var str = JSON.stringify(detailList); //把JS的数组编码为JSON字符串
      $('input[name="productList"]').val(str);
    }
  });
});

/**功能点4：点击“提交订单”异步提交表单信息给服务器**/
$('.checkout-submit').click(function(){
  $('input[name="uname"]').val(sessionStorage['loginName']);
  //表单序列化，读取所有的要提交的数据
  var data = $('#form-order').serialize();
  $.ajax({
    type: 'POST',
    url: 'data/6_order_add.php',
    data: data,
    success: function(result){
      //result形如：{msg:succ, oid:105, orderNum:123457890}
      if(result.msg == 'succ'){
        sessionStorage['orderNum'] = result.orderNum;
        location.href='addorder_result.html';
      }else {
        alert('订单提交失败！请检查响应消息主体！')
      }
    }
  });
});
