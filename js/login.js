var remoteUrl = "http://test.inten.me/shibufangcao/";

//登录成功跳转函数
function moveToMainPage(data){
	    var dataObj = JSON.parse(JSON.stringify(data));
	    if(dataObj.stateCode==0){
	    	   window.location.href = "index.html";
	    }else if(dataObj.stateCode==1){
					    	layer.open({
							  title: '登录失败', 
							  content: '账户不存在' //这里content是一个普通的String
							});
	    }else if(dataObj.stateCode==2){
					    	layer.open({
							  title: '登录失败', 
							  content: '密码错误' //这里content是一个普通的String
							});
	    }
}


function postRemote(posturl, formdata, callbackFun, cbParameter) {
    $.ajaxSetup({
        async: true
    });
    posturl = remoteUrl + posturl;
     $.ajax({
        type: "POST", // 请求方式
        url: posturl, // 请求url地址
        data: formdata,
        dataType: "json", // 数据返回类型
        success: function (data) {
            // 请求发送成功后执行的函数,data是返回的数据。cbParameter是传递给回调函数的参数
            if (cbParameter == null || cbParameter == "") {
                doCallback(callbackFun, [data]);
            } else {
                doCallback(callbackFun, [data, cbParameter]);
            }
        },
        timeout: 10000, // 超时设置,如果10秒内请求无响应,则执行error定义的方法
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //alert(XMLHttpRequest.status);
            //alert(XMLHttpRequest.readyState);
            //alert(textStatus);
        },
        async: true,
        traditional: true
    });
}


//调用回调函数    
function doCallback(fn, args) {
    fn.apply(this, args);
}