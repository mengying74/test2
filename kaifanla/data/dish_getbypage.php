<?php

header('Content-Type:application/json');

$output = [];

//接收传来的参数
@$start = $_REQUEST['start'];

$count = 5;
if(empty($start)){
    $start = 0;
}

$conn = mysqli_connect('localhost','root','root','kaifanla');

$sql = "SET NAMES UTF8";
mysqli_query($conn,$sql);

//在kf_dish的数据表里查询出从$start开始$count行的数据包括：id，姓名，价格，小图片，用料
$sql = "SELECT did,name,price,img_sm,material FROM kf_dish LIMIT $start,$count";
$result = mysqli_query($conn,$sql);

while(true){
    $row = mysqli_fetch_assoc($result);
    if(!$row){
       break;
    }
    $output[] = $row;
}
echo json_encode($output);