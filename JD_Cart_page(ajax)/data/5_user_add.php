<?php
/**
*接收客户端提交的新用户信息，保存入数据库，返回 {"msg": "succ", "uid": 3} 或 {"msg":"err", "sql":"INSERT...."}
*/
header('Content-Type:application/json;charset=UTF-8');

$uname=$_REQUEST['uname'];
$upwd=$_REQUEST['upwd'];
$email=$_REQUEST['email'];
$homepage=$_REQUEST['homepage'];
$age=$_REQUEST['age'];
$birthday=$_REQUEST['birthday'];
//把'y-M-d'解析为一个整数
$birthday=strtotime($birthday)*1000;

include('0_config.php');
$conn = mysqli_connect($db_url, $db_user, $db_pwd, $db_name, $db_port);
$sql="INSERT INTO jd_user VALUES(NULL,'$uname','$upwd','$email','$homepage','$age','$birthday')";
$result=mysqli_query($conn,$sql);

//创建要输出给客户端的数据
$output=[];
if($result){
  $output['msg']='succ';
  $output['uid']=mysqli_insert_id($conn);
}else{
  $output['msg']='err';
  $output['sql']=$sql;
}
echo json_encode($output);
