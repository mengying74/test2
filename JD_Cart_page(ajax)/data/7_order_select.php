<?php
/**
*接收客户端提交的用户名，查询出该用户所有的订单，
*以JSON格式返回给客户端
*/
header('Content-Type:application/json;charset=UTF-8');

//接收并处理客户端提交的请求数据
$uname=$_REQUEST['uname'];

include('0_config.php');
$conn = mysqli_connect($db_url, $db_user, $db_pwd, $db_name, $db_port);

//SQL1: 设置编码方式
//SQL2: 根据用户名查询用户编号
$sql="SELECT uid FROM jd_user WHERE uname='$uname'";
$result=mysqli_query($conn,$sql);
$uid=mysqli_fetch_assoc($result)['uid'];

//SQL3: 根据用户编号查询其对应的订单
$sql="SELECT * FROM jd_order WHERE userId='$uid'";
$result=mysqli_query($conn,$sql);
$orderList=mysqli_fetch_all($result,MYSQLI_ASSOC);

//遍历每个订单对象，添加一个新的属性:productList
foreach($orderList as $i=>$o){
    //$o['productList'] = []; //订单的产品列表是个数组
    //$o是每个元素的副本，不是元素本身
    //$orderList[$i]['productList'] = [];
    //根据当前订单编号查询出它所购买的产品
   $oid=$orderList[$i]['oid'];
   $sql="SELECT pid,pname,pic FROM jd_product WHERE pid IN(SELECT productId FROM jd_order_detail WHERE orderId=$oid)";
   $result=mysqli_query($conn,$sql);
   $plist=mysqli_fetch_all($result,MYSQLI_ASSOC);
   $orderList[$i]['productList']=$plist;
}
echo json_encode($orderList);
