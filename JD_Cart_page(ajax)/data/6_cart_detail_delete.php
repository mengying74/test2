<?php
header('Content-Type:text/html');
$did=$_REQUEST['did'];

include('0_config.php');
$conn = mysqli_connect($db_url, $db_user, $db_pwd, $db_name, $db_port);

$sql="DELETE FROM jd_cart_detail WHERE did='$did'";
$result=mysqli_query($conn,$sql);
if($result){
	echo 'succ';
}else{
	echo 'err';
}