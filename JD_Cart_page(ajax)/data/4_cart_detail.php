<?php
/**接收客户端提交的用户名，向客户端输出该用户的购物车详情**/
header('Content-Type:application/json;charset=UTF-8');
$uname=$_REQUEST['uname'];
//连接数据库
include('0_config.php');
$conn=mysqli_connect($db_url,$db_user,$db_pwd,$db_name,$db_port);
//SQL1: 设置编码方式
//SQL2：根据用户名查询用户编号，再根据用户编号查询出购物车编号
$sql="SELECT cid FROM jd_cart WHERE userId=(SELECT uid FROM jd_user WHERE uname='$uname')";
$result=mysqli_query($conn,$sql);
$row=mysqli_fetch_assoc($result);
$cid=$row['cid'];
//echo $cid;
//SQL3：根据购物车编号查询出其中的产品
$sql="SELECT did,cartId,productId,count,pname,price,pic FROM jd_cart_detail,jd_product WHERE cartId='$cid' AND productId=pid";
$result=mysqli_query($conn,$sql);
$list=mysqli_fetch_all($result,MYSQLI_ASSOC);
echo json_encode($list);