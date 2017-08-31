<?php
header('Content-Type:text/html');
$did=$_REQUEST['did'];
$count=$_REQUEST['count'];
//连接数据库
include('0_config.php');
$conn=mysqli_connect($db_url,$db_user,$db_pwd,$db_name,$db_port);
//SQL1：数据库更新语句
$sql="UPDATE jd_cart_detail SET count='$count' WHERE did='$did'";
$result=mysqli_query($conn,$sql);
if($result){
	echo 'succ';
}else{
	echo 'sqlerr';
}