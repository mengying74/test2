/**功能点1：对每个用户输入进行验证**/
$('#uname').focus(function(){
  this.nextElementSibling.innerHTML = '用户名长度在6到9位之间';
  this.nextElementSibling.className='msg-default';
});
$('#uname').blur(function(){
  console.log(this.validity);
  if (this.validity.valueMissing) {
    this.nextElementSibling.innerHTML = '用户名不能为空';
    this.nextElementSibling.className = 'msg-error';
    this.setCustomValidity('用户名不能为空');
  }else if(this.validity.tooShort){
    this.nextElementSibling.innerHTML = '用户名不能少于6位';
    this.nextElementSibling.className='msg-error';
    this.setCustomValidity('用户名不能少于6位');
  }else{
    this.nextElementSibling.innerHTML='用户名格式正确';
    this.nextElementSibling.className='msg-success';
    this.setCustomValidity('');
  }
});
$('#upwd').focus(function(){
  this.nextElementSibling.innerHTML='密码长度在6到12位之间';
  this.nextElementSibling.className='msg-default';
});
$('#upwd').blur(function(){
  console.log(this.validity);
  if(this.validity.valueMissing){
    this.nextElementSibling.innerHTML='密码不能为空';
    this.nextElementSibling.className='msg-error';
    this.setCustomValidity('密码不能为空');
  }else if(this.validity.tooShort){
    this.nextElementSibling.innerHTML = '密码不能少于6位';
    this.nextElementSibling.className='msg-error';
    this.setCustomValidity('用户名不能少于6位');
  }else{
    this.nextElementSibling.innerHTML='密码格式正确';
    this.nextElementSibling.className='msg-success';
    this.setCustomValidity('');
  }
});
$('#email').focus(function(){
  this.nextElementSibling.innerHTML='请输入合法的邮箱地址';
  this.nextElementSibling.className='msg-default';
});
$('#email').blur(function(){
  console.log(this.validity);
  if(this.validity.valueMissing){
    this.nextElementSibling.innerHTML='邮箱不能为空';
    this.nextElementSibling.className='msg-error';
    this.setCustomValidity('邮箱不能为空');
  }else if(this.validity.typeMismatch){
    this.nextElementSibling.innerHTML='邮箱格式不正确';
    this.nextElementSibling.className='msg-error';
    this.setCustomValidity('邮箱格式不正确');
  }else{
    this.nextElementSibling.innerHTML='邮箱格式正确';
    this.nextElementSibling.className='msg-success';
    this.setCustomValidity('');
  }
});
$('#homepage').focus(function(){
  this.nextElementSibling.innerHTML='请输入合法的主页地址';
  this.nextElementSibling.className='msg-default';
});
$('#homepage').blur(function(){
  console.log(this.validity);
  if(this.validity.valueMissing){
    this.nextElementSibling.innerHTML='主页可以不填写';
    this.nextElementSibling.className='msg-success';
  }else if(this.validity.typeMismatch){
    this.nextElementSibling.innerHTML='主页格式不正确';
    this.nextElementSibling.className='msg-error';
  }else{
    this.nextElementSibling.innerHTML='主页格式正确';
    this.nextElementSibling.className='msg-success';
    this.setCustomValidity('');
  }
});
$('#age').blur(function(){
  console.log(this.validity);
  if(this.validity.valueMissing){
    this.nextElementSibling.innerHTML='年龄不能为空';
    this.nextElementSibling.className='msg-error';
  }else if(this.validity.rangeOverflow){
    this.nextElementSibling.innerHTML='年龄范围超过120';
    this.nextElementSibling.className='msg-error';
  }else{
    this.nextElementSibling.innerHTML='年龄格式正确';
    this.nextElementSibling.className='msg-success';
    this.setCustomValidity('');
  }
});
$('#age').focus(function(){
  this.nextElementSibling.innerHTML='年龄小与120';
  this.nextElementSibling.className='msg-default';
});

/**功能点2：实现异步的提交注册信息**/
$('#bt-register').click(function(){
  //表单序列化，获得所有的用户输入
  var data = $('#form-register').serialize();
  //表单序列化的结果：'uname=xxx&upwd=xxx&age=xxx'

  //异步提交请求数据
  $.ajax({
    type: 'POST',
    url: 'data/5_user_add.php',
    data: data,
    success: function(result){
      console.log('开始处理服务器端返回的注册结果');
      //console.log(result);
      if(result.msg=='succ'){
        alert('注册成功！');
        location.href='productlist.html';
      }else {
        alert('注册失败！')
      }
    }
  });
});

/**功能点3：H5新特性——webstorage实现项目数据的存储**/
$('#bt-register').click(function(){
  sessionStorage.setItem('uname',uname.value);
  sessionStorage.setItem('upwd',upwd.value);
});