function boxShow(){//点击广告区侧边栏的box，显示和隐藏弹出框
	//查找#cate_box元素，为#boxShow,.sub_cate_box绑定鼠标进入事件
	$("#cate_box").on("mouseover","#boxShow,.sub_cate_box",function(){
		//将.sub_cate_box显示(动画效果3秒内)
		$(".sub_cate_box").show("3000");
	});
	//查找.sub_cate_box下的close元素，绑定点击事件
	$(".sub_cate_box .close").click(function(){
		//将.sub_cate_box隐藏(动画效果3秒内)
		$(".sub_cate_box").hide("3000");
	})
}
boxShow();