/**功能点0：检验当前是否已经登录**/
if(!sessionStorage['loginName']){
  location.href='productlist.html';
}
/**功能点1：异步加载页头和页尾**/
$('#header').load('header.php',function(){
  $('#welcome').html('欢迎回来：'+sessionStorage['loginName']);
});
$('#footer').load('footer.php');

$('#orderNum').html(sessionStorage['orderNum']);