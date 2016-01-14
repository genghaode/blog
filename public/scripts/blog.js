$(function(){
	//导航选中处理
	$('.navWrap').find('.td').on('click', function(){
		if(!$(this).hasClass('active')){
			$(this).addClass('active').siblings('.active').removeClass('active');
			if($(this).hasClass('searchBtn')){
				$('.searchWrap').show();
			}else {
				$('.searchWrap').hide();
			}
		}
	});

	//表单验证
	$('.reg,.login').find('.form').on('submit', function(){
		var flag = false;
		var str1 = validateEmail(this.email);
		if(str1){
			flag = true;
		}
		var str2 = validatePwd(this.password);
		if(str2){
			flag = true;
		}
		if(flag){
			if(str1){
				$('#emailMsg').html(str1).addClass('error');
			}
			if(str2){
				$('#passwordMsg').html(str2).addClass('error');
			}
			return false;
		}
		$('.error').removeClass('error');

	});
	$('#email').on('input', function(){
		var str1 = validateEmail(this);
		if(str1){
			$('#emailMsg').html(str1).addClass('error');
		}else {
			$(this).removeClass('error');
			$('#emailMsg').html('邮箱完成验证！').removeClass('error');
		}
	});
	$('#password').on('input', function(){
		var str1 = validatePwd(this);
		if(str1){
			$('#passwordMsg').html(str1).addClass('error');
		}else {
			$(this).removeClass('error');
			$('#passwordMsg').html('密码完成验证！').removeClass('error');
		}
	});
	//发布内容验证
	$('.post').find('.form').on('submit', function(){
		var flag = false;
		var str1 = validateTitle(this.title);
		if(str1){
			flag = true;
		}
		var str2 = validateContent(this.content);
		if(str2){
			flag = true;
		}
		if(flag){
			if(str1){
				$('#titleMsg').html(str1).addClass('error');
			}
			if(str2){
				$('#contentMsg').html(str2).addClass('error');
			}
			return false;
		}
		$('.error').removeClass('error');
	});
	$('#title').on('input', function(){
		var str1 = validateTitle(this);
		if(str1){
			$('#titleMsg').html(str1).addClass('error');
		}else {
			$(this).removeClass('error');
			$('#titleMsg').html('标题完成验证！').removeClass('error');
		}
	});
	$('#content').on('input', function(){
		var str1 = validateContent(this);
		if(str1){
			$('#contentMsg').html(str1).addClass('error');
		}else {
			$(this).removeClass('error');
			$('#contentMsg').html('内容完成验证！').removeClass('error');
		}
	});
	//验证标题
	function validateTitle(self){
		if(self.value == ''){
			$('#title').addClass('error');
			return '请输入标题！';
			return true;
		}
		$('#title').removeClass('error');
		return false;
	}
	//验证内容
	function validateContent(self){
		if(self.value == ''){
			$('#content').addClass('error');
			return '请输入内容！';
			return true;
		}
		$('#content').removeClass('error');
		return false;
	}
	//验证邮箱
	function validateEmail(self){
		var re = /^[a-zA-Z][a-zA-Z0-9_]{5,17}@[0-9a-zA-Z]{2,4}\.[a-z]{2,4}$/ig;
		if(self.value == ''){
			$('#email').addClass('error');
			return '请输入您的邮箱！';
			return true;
		}else if(!re.test(self.value)) {
			$('#email').addClass('error');
			return '输入的邮箱格式不正确，请重新输入！';
		}
		$('#email').removeClass('error');
		return false;
	}
	//验证密码
	function validatePwd(self){
		var re = /^[0-9a-zA-Z_]{6,12}$/ig;
		if(self.value == ''){
			$('#password').addClass('error');
			return '请输入您的密码！';
		}else if(!re.test(self.value)) {
			$('#password').addClass('error');
			return '您输入的密码格式不正确，请重新输入！';
		}
		$('#password').removeClass('error');
		return false;
	}
	var scrollFlag = false;
	$(window).on('scroll', function(){
		
		if($(window).scrollTop()+$(window).height() > $('#item').find('.itemWrap:last-child').offset().top) {
			if(scrollFlag){
				return false;
			}
			scrollFlag = true;
			$.ajax({
				url:,
				type: 'get',
				data: {'': ''},
				dataType: 'json',
				success: function(data){
					scrollFlag = false;
				}
			})
		}
	});
	
});