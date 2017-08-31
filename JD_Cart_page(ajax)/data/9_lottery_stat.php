<?php
/**
*接收客户端提交的用户名，
*返回该用户的抽奖统计情况，
*形如：
    {
       "uname":"qiangdong",
       "uid":1,
       "totalCount":39,
       "usedCount": 3,
       "leftCount":36
    }
**/
header('Content-Type:application/json;charset=UTF-8');

$uname=$_REQUEST['uname'];

$output=[
   'uname'=>$uname
];

include('0_config.php');
$conn = mysqli_connect($db_url, $db_user, $db_pwd, $db_name, $db_port);

//SQL1: 设置编码方式
//SQL2: 根据用户名查询用户编号
$sql="SELECT uid FROM jd_user WHERE uname='$uname'";
$result=mysqli_query($conn,$sql);
$uid = mysqli_fetch_assoc($result)['uid'];
$output['uid']=$uid;

//SQL3: 根据用户编号，查询其所下所有订单的总金额
$sql="SELECT SUM(price) AS sp FROM jd_order WHERE userId=$uid";
$result=mysqli_query($conn,$sql);
$sp = mysqli_fetch_assoc($result)['sp'];
$output['totalCount']=floor($sp/1000);

//SQL4: 根据用户编号，查询已经抽奖的次数
$sql="SELECT COUNT(*) AS c FROM jd_lottery WHERE  userId=$uid";
$result=mysqli_query($conn,$sql);
$c = mysqli_fetch_assoc($result)['c'];
$output['usedCount']=intval($c);//把字符串解析为整数

//计算剩余抽奖次数
$output['leftCount']=$output['totalCount']-$output['usedCount'];

echo json_encode($output);
