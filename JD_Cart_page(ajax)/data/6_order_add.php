<?php
/**
*接收客户端提交的订单信息，保存入订单表和订单详情表，
*返回 {"msg":"succ","oid",12, "orderNum": 1234567890 } 或 {"msg":"err", "sql":"INSERT ...."}
*/
header('Content-Type:application/json;charset=UTF-8');
/***
*请求数据形如：
*rcvName=刘强东&price=1234.56&payment=1&uname=qiangdong&productList=[{"productId":10,"count":3},{"productId":20,"count":1}]
**/
//接收并处理客户端提交的请求数据
$orderNum=rand(1000000000,10000000000);
$shopName='京东自营';
$rcvName=$_REQUEST['rcvName']; //收件人姓名
$price=$_REQUEST['price'];
$payment=$_REQUEST['payment'];
$orderTime=time()*1000; //time返回的秒，需要毫秒
$status=1;
$uname=$_REQUEST['uname'];
$productList=$_REQUEST['productList'];//客户端提交的JSON字符串，形如[{"productId":10, "count":3},{"productId":20, "count":1},{"productId":30, "count":2}]
$productList=json_decode($productList);//把JSON字符串解码为PHP对象数组

include('0_config.php');
$conn = mysqli_connect($db_url, $db_user, $db_pwd, $db_name, $db_port);

//SQL1: 设置编码方式
//SQL2: 根据用户名查询用户编号
$sql="SELECT uid FROM jd_user WHERE uname='$uname'";
$result=mysqli_query($conn,$sql);
$uid=mysqli_fetch_assoc($result)['uid'];

//SQL3: 向订单表插入一行记录，得到自增的订单编号
$sql="INSERT INTO jd_order VALUES(NULL,'$orderNum','$shopName','$rcvName','$price','$payment','$orderTime','$status','$uid')";
$result=mysqli_query($conn,$sql);
$oid = mysqli_insert_id($conn);

//SQL4: 循环执行：向订单详情表中插入记录
foreach($productList as $p){
   $pid=$p->productId;
   $count=$p->count;
   $sql = "INSERT INTO jd_order_detail VALUES(NULL,'$oid','$pid','$count')";
   mysqli_query($conn,$sql);
}

//创建要输出给客户端的数据
$output=[];
if($oid){
  $output['msg']='succ';
  $output['oid']=$oid;
  $output['orderNum']=$orderNum;
}else{
  $output['msg']='err';
}
echo json_encode($output);
