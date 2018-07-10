var remoteUrl = "http://test.inten.me/shibufangcao/";
var ipUrl = "http://test.inten.me/";

layui.use('element', function(){
  var element = layui.element();
});

function nvl(obj, result) {
    result = result != null ? result : "";
    return obj != null ? obj : result;
}

//写cookies 
function setCookie(name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}
//读取cookies 
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}
//删除cookies 
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null) 
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

//获取URL参数
function getRequest() {
    var url = decodeURI(location.search); //获取url中?后的字符串    decondeURI解码url
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
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

function isLoginCallBack(data){
	 var dataObj = JSON.parse(JSON.stringify(data));dataObj.notLogin
	  if(dataObj.notLogin){
	    	   window.location.href = "login.html";
	    }
}

//判断是否登录
window.onload = function isLogin(){
	 var postData = {
	 	 start : 1,
	 	 length : 1
	 }
	 postRemote("platform/competitionServlet.do?flag=getCompeList3_0_1", postData, isLoginCallBack);
};

	//判断浏览器是否为IE， IE10以前
		function isIE(){
		if (window.navigator.userAgent.indexOf("MSIE")>=1) 
		return true; 
		else 
		return false; 
		}
		
		//判断浏览器是否为IE，IE10以上
		function isIE2() { //ie?
		 if (!!window.ActiveXObject || "ActiveXObject" in window)
		  return true;
		  else
		  return false;
		 }
		
		function isChore(){
			if(window.navigator.userAgent.indexOf("Chrome")!=-1)
			return true;
			else
			return false;
		}
		
		 function timeOut(data){
                 var list = JSON.parse(JSON.stringify(data));
                 if(list.notLogin){
      	           alert("对不起，因为您长时间未操作，服务器已远程断开您的服务，请重新登录帐号");
					window.open("login.html","_top");
				}
		}
//下载引用 ,非IE浏览器使用
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(4(e){"S W";4 r(e,t,n){3 r=4(){n.1a(e,9)};5(e.z){e.z(t,r,6)}g{e.U("V"+t,r)}7 r}4 i(e,t){3 n=9.D>2?1g.J.K.k(9,1):[];3 r;E(3 s=0;s<n.D;s++){r=n[s];E(3 o 19 r){5(b r[o]==="1b"){e[o]=i({},r[o])}g 5(o!=v&&r.1c(o)&&b r[o]!=="1f"){e[o]=r[o]}}}7 e}4 s(t,n){3 r=G.1h("1j://1k.1n.1o/H/I","a");r.1q=t;r.L=M.N(n);3 i=G.O("P");i.Q("R",d,d,e,0,0,0,0,0,6,6,6,6,0,v);r.T(i)}4 o(e,t,n){3 r;t=t||"F";5(m.q){r=8 q}g{r=8 X("Y.Z")}r.10(t,e,d);r.11="12";r.13=4(){5(r.14==r.15){5(n)n.k(r,r.16)}};r.17();7 r}3 t={w:"",x:"",y:"F",j:4(){},A:4(){}};3 n=4(e){4 h(e){3 t=e.1d;3 r=e.1e;3 i=r/t;3 s=(8 B).C();3 o=(s-l)/1i;3 u=r-c;3 a=u/o;c=r;l=s;e.1l=i;e.1m=a;n.j.k(f,e)}4 p(e){3 t=n.A();5(b t==="1p"&&!t)7 t;s(a,e)}3 n=i({},t,e);3 u=n.w;3 a=n.x;3 f=o(u,n.y,p);3 l=(8 B).C();3 c=0;r(f,"j",h)};e.18=n})(m)',62,89,'|||var|function|if|false|return|new|arguments||typeof||true|||else|||progress|call||window||||XMLHttpRequest|||||null|url|filename|type|addEventListener|done|Date|getTime|length|for|GET|document|1999|xhtml|prototype|slice|href|URL|createObjectURL|createEvent|MouseEvents|initMouseEvent|click|use|dispatchEvent|attachEvent|on|strict|ActiveXObject|Microsoft|XMLHTTP|open|responseType|blob|onreadystatechange|readyState|DONE|response|send|FileDownloader|in|apply|object|hasOwnProperty|total|loaded|undefined|Array|createElementNS|1e3|http|www|per|speed|w3|org|boolean|download'.split('|'),0,{}));  
