// var s=location.search;
// var loginName=s.substring(s.indexOf('=')+1);//substring=slice
//alert(loginName);
/**功能点0：检验当前是否已经登录**/
if(!sessionStorage['loginName']){
	location.href='productlist.html';
}

$('#header').load('header.php',function(){
	$('#welcome').html('欢迎回来：'+sessionStorage['loginName']);
});
$('#footer').load('footer.php');

/**功能点3：异步请求当前登录用户的购物车内容**/
$(function(){
	$.ajax({
		url:'data/4_cart_detail.php',
		data:{uname:sessionStorage['loginName']},
		success:function(detailList){
			var html='';
			var totalPrice = 0;
			$.each(detailList,function(i,d){
				totalPrice += d.price*d.count;
				html+=`
				<tr>
                    <td>
                        <input type="checkbox"/>
                        <input type="hidden" name="did" value="${d.did}" />
                        <div><img src="${d.pic}"></div>
                    </td>
                    <td><a href="">${d.pname}</td>
                    <td><a href="">${d.price}</td>
                    <td>
                        <button>-</button><input type="text" value="${d.count}"/><button>+</button>
                    </td>
                    <td><span>${d.price*d.count}</span></td>
                    <td><a href="${d.did}">删除</a></td>
                </tr>
				`;
			});
			 	$('#cart tbody').html(html);
				$('.totalprice').html(totalPrice);
				$('input[name="price"]').val(totalPrice);
		}
	});
});
/**功能点4：单击+和-修改购物数量**/
$('#cart').on('click','button',function(){
	//客户端修改
	var self = this;
	var operation=$(this).html();
	var count=parseInt($(this).siblings('input').val());
	//获得商品的单价
	var pirce=$(this).parent().prev().children().html();
	if(operation=='-'&&count>1){
		count--;
	}
	if(operation=='+'){
		count++;
	}
	//小计的计算方法：单价*数量
	var total_prices=pirce*count;
	//修改小计在客户端上的的内容
	$(this).parent().next().children().html(total_prices);
	//console.log(total_prices);
	//服务器端修改
	var did=$(this).parent().parent().find('input[name="did"]').val();
	$.ajax({
		url:'data/5_cart_update.php',
		data:{did:did,count:count},
		success:function(txt){
			if(txt=='succ'){
				console.log('修改成功');
				$(self).siblings('input').val(count);
			}else{
				console.log('修改失败');
			}
		}
	});
});
/**功能点5：单击"删除"超链接删除该商品**/
$('#cart').on('click','a:contains("删除")',function(e){
	e.preventDefault();
	//服务器端修改
	var did=$(this).attr('href');
	var self=this;
	$.ajax({
		url:'data/6_cart_detail_delete.php',
		data:{did:did},
		success:function(txt){
			if(txt=='succ'){
				 console.log('删除成功');
				 //客户端TR元素的删除
				 $(self).parent().parent().remove();
			}else{
				alert('删除失败');
			}
		}
	});
});

/**功能点6：单击"结算"跳转页面**/
$('#btn_pay').click(function(){
	location.href='addorder.html';
});
