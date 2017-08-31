<?php
/**
*根据客户端提交的用户名，访问数据库读取过去的消费记录——SQL分组求和，——太麻烦
*模拟创建过去12个月中的消费总金额，直接伪造出JSON数据即可，
*返回数据形如：
*[
*   {"label":"10月","value":3500},
*   {"label":"11月","value":3000},
*   ...
*]
**/
header('Content-Type:application/json;charset=UTF-8');

$uname=$_REQUEST['uname'];

//TODO:此处应该访问数据库，获取数据
$output=[
    ['label'=>'10月','value'=>5500],
    ['label'=>'11月','value'=>7500],
    ['label'=>'12月','value'=>5000],
    ['label'=>'1月','value'=>8000],
    ['label'=>'2月','value'=>2000],
    ['label'=>'3月','value'=>500],
    ['label'=>'4月','value'=>6500],
    ['label'=>'5月','value'=>6000],
    ['label'=>'6月','value'=>8500],
    ['label'=>'7月','value'=>4000],
    ['label'=>'8月','value'=>6000],
    ['label'=>'9月','value'=>5000]
];
echo json_encode($output);
