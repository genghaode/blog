$(function(){
	//导航选中处理
	$(".navWrap").find(".td").on("click", function(){
		if(!$(this).hasClass("active")){
			$(this).addClass("active").siblings(".active").removeClass("active");
			if($(this).hasClass("searchBtn")){
				$(".searchWrap").show();
			}else {
				$(".searchWrap").hide();
			}
		}
	});
});