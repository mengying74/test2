<?php
header('Content-Type:text/plain');
$uname=$_REQUEST['uname'];
$upwd=$_REQUEST['upwd'];
include('0_config.php');
$conn=mysqli_connect($db_url,$db_user,$db_pwd,$db_name,$db_port);
$sql="SELECT uid FROM jd_user WHERE uname='$uname'AND upwd='$upwd'";
$result=mysqli_query($conn,$sql);
$row=mysqli_fetch_assoc($result);
if($row){
	echo 'ok';
}else{
	echo 'err';
}