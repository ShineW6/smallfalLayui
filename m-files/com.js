var remoteUrl = "http://test.inten.me/shibufangcao/";

//换行处理
function fixWrap(str) {
    str = str.replace(/\r\n/g, "<br/>")
    str = str.replace(/\n/g, "<br/>");
    console.log(str);
    return str;
}
//是否正整数
function isInteger(number) {
    return number > 0 && String(number).split('.')[1] == undefined
}
//是否是数字
function isNumber(number) {
    return typeof number === 'number'
}
//数据为空
function nvl(obj, result) {
    result = result != null ? result : "";
    return obj != null ? obj : result;
}


//建立一個可存取到該file的url
function getObjectURL(file) {
    var url = null;
    if (window.createObjectURL != undefined) { // basic
        url = window.createObjectURL(file);
    } else if (window.URL != undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
}
//是否是电脑设备
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
//模态框居中
function centerModals() {
    $('.modal').each(function (i) {
        var $clone = $(this).clone().css('display', 'block').appendTo('body');
        var top = Math.round(($clone.height() - $clone.find('.modal-content').height()) / 2);
        top = top > 0 ? top : 0;
        $clone.remove();
        $(this).find('.modal-content').css("margin-top", top);
    });
}
//调用远程接口
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
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        success: function (data) {
            // 请求发送成功后执行的函数,data是返回的数据。cbParameter是传递给回调函数的参数
            if (cbParameter == null || cbParameter == "") {
                doCallback(eval(callbackFun), [data]);
            } else {
                doCallback(eval(callbackFun), [data, cbParameter]);
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
//格式化项目状态样式类
function getStatusClassName(status, isJoin) {
    if (status == "3") {
        if (isJoin == true)
            return "";
        return "enabled";
    } else {
        return "";
    }
}
//格式化项目状态名称
function formatStatus(status, isJoin) {
    if (status == "1") {
        return "编辑中";
    } else if (status == "2") {
        if (isJoin == true)
            return "已报名";
        return "报名中";
    } else if (status == "3") {
        return "报名结束";
    } else if (status == "4") {
        return "已取消";
    } else {
        return "报名结束";
    }
}
//当前消息提示ID
var msgId = 0;
//显示消息提示
function showMsg(txt, type, notHide) {
    msgId++;
    var msg = "<div id='msg-" + msgId + "' class='" + type + "Msg' onclick='hideThisMsg(this)'><div class='msg-body'><span>" + txt + "</span></div></div>";
    $(document.body).append(msg);

    var left = (window.innerWidth - $("#msg-" + msgId + " .msg-body").width()) / 2;
    var top = (window.innerHeight - $("#msg-" + msgId + " .msg-body").height()) / 2;
    $("#msg-" + msgId + " .msg-body").css("left", left + "px");
    $("#msg-" + msgId + " .msg-body").css("top", top + "px");
    if (!notHide)
        hideMsg("#msg-" + msgId);
}
//隐藏消息提示
function hideMsg(id) {
    setTimeout(function () {
        $(id).fadeOut(500);
    }, 1500);
}
//点击屏幕马上隐藏消息提示
function hideThisMsg(e) {
    $(e).fadeOut(100);
}
//初始化
$(document).ready(function () {
    //自适应手机屏幕
    initFont();
    //模态框居中
    $('.modal').on('show.bs.modal', centerModals);

    var request = getRequest();
    var userName = request["userName"] == null ? "" : request["userName"];
    var password = request["password"] == null ? "" : request["password"];

    if (userName == "" || password == "") {
        //验证登录信息      
        postRemote("student/studentServlet.do?flag=getResumeInfo", "", checkLoginCallback);
    } else {
        postRemote("user/loginRegisterServlet.do?flag=login3_0_1", { userName: userName, password: password }, loginCallback);
    }

    if (isWeiXin() == false) {
        $(".wexinBar").css("display", "none");
        $(".weixinPadding").css("margin-top", "0");
        $(".weixinVoteList").css("margin-top", "0.7rem");
        $(".weixinVoteSearchBox").css("top", "0");
    } else {
        $(".notWexin").css("display", "none");
    }

});
//根据屏幕大小设置根大小
function initFont() {
    var html = document.querySelector('html');
    var rem = (html.offsetWidth > 640 ? 640 : html.offsetWidth) / 3.75;
    html.style.fontSize = rem + "px";
    $("body").show();
}
//窗口大小而变化
$(window).resize(function () {
    //窗口大小改变时，模态框居中
    centerModals();
    //自适应手机屏幕
    initFont();
});

//验证登录信息回调函数
function checkLoginCallback(result) {
    if (result.return == true) {
        if (result.userId != null)
            setCookie("userId", nvl(result.userId));
    } else {
        //未登录就删除登录cookie
        delCookie("isEdit");
        delCookie("userId");
        delCookie("name");
        delCookie("avatar");

        //未登录，页面必须登录时就显示登录框
        if (mustLogin == true) {
            login();
            return;
        }
    }
    //页面加载初始化函数
    pageInit();
}

//当前页面是否必须登录才能操作
var mustLogin = false;
//登录框）
function login() {
    $('#loginModal').modal({ backdrop: 'static', keyboard: false });
    $("#loginModal").modal('show');
}
//登录
function doLogin() {
    $(".loginBtn").html("登录中...");
    $(".loginBtn").attr("disabled", true);
    postRemote($("#loginForm").attr('action'), $("#loginForm").serialize(), loginCallback);
}
//登录回调函数
function loginCallback(result) {
    $(".loginBtn").attr("disabled", false);
    $(".loginBtn").html("登录");

    if (result.stateCode == "1") {
        showMsg("账户不存在！", "error");
    } else if (result.stateCode == "2") {
        showMsg("密码错误！", "error");
    } else if (result.stateCode == "3") {
        showMsg("账户冻结！", "error");
    } else {
        //记住密码
        if ($("#rememberPassword").is(":checked")) {
            setCookie("userName", $("#userName").val());
            setCookie("password", $("#password").val());
        }
        $("#loginModal").modal('hide');
        //没有认证，没有取消认证就显示认证窗口
        if (getCookie("isReg") == null && result.isReg != true) {
            $("#regModal").modal("show");
        }
        setCookie("isEdit", result.isEdit);
        setCookie("userId", nvl(result.userId));
        setCookie("name", nvl(result.name, ""));
        setCookie("avatar", nvl(result.avatar));
        setCookie("userType", nvl(result.userType));
    }
    //加载页面初始化函数
    pageInit();
}

//显示退出登录确认框
function quit() {
    $("#setModal").modal("hide");
    $("#quitModal").modal('show');
}
//退出
function doQuit() {
    $(".quitBtn").html("退出中...");
    $(".quitBtn").attr("disabled", true);
    postRemote($("#quitForm").attr('action'), $("#quitForm").serialize(), quitCallback);
}
//退出登录回调函数
function quitCallback(result) {
    if (result.return == true) {
        window.location.href = "index.html";
    }
}
//未登录显示登录框
function displayLogin() {
    if (getCookie("userId") == null) {
        login();
        return false;
    } else
        return true;
}


//修改密码显示框
function alertPassword() {
    $("#setModal").modal("hide");
    $("#alertPasswordModal").modal('show');
}
//修改密码
function doAlertPassword() {
    if ($("#oldPassword").val() == "") {
        showMsg("旧密码不能为空！", "error");
        return;
    }
    if ($("#newPassword").val() == "") {
        showMsg("新密码不能为空！", "error");
        return;
    }
    if ($("#newPassword").val() != $("#repeatPassword").val()) {
        showMsg("两次密码不相同！", "error");
        return;
    }

    $(".alertPasswordBtn").html("修改中...");
    $(".alertPasswordBtn").attr("disabled", true);
    postRemote($("#alertPasswordForm").attr('action'), $("#alertPasswordForm").serialize(), alertPasswordCallback);
}
//修改密码回调函数
function alertPasswordCallback(result) {
    $(".alertPasswordBtn").attr("disabled", false);
    $(".alertPasswordBtn").html("确定");
    if (result.stateCode == "1") {
        showMsg("未登录！", "error");
    } else if (result.stateCode == "2") {
        showMsg("密码不能为空！", "error");
    } else if (result.stateCode == "3") {
        showMsg("密码错误！", "error");
    } else if (result.stateCode == "4") {
        showMsg("密码格式错误！", "error");
    } else if (result.stateCode == "0") {
        showMsg("密码修改成功，请牢记您的新密码！", "success");
        $("#alertPasswordForm")[0].reset();
        $("#alertPasswordModal").modal('hide');
    }
}


//注册框显示
function register() {
    $("#registerModal").modal('show');
    $("#registerForm")[0].reset();
}
//注册
function doRegister() {
    var userName = $("#registerForm #regUserName").val().trim();
    var password = $("#registerForm #regPassword").val().trim();
    var repeatPassword = $("#registerForm #regRepeatPassword").val().trim();
    var code = $("#registerForm #regCode").val().trim();

    if (userName == "") {
        showMsg("手机号码不能为空！", "error");
        $("#registerForm #regUserName").focus();
        return;
    }
    if (userName.length != 11 || isInteger(userName) == false) {
        showMsg("手机号码格式错误！", "error");
        $("#registerForm #regUserName").focus();
        return;
    }
    if (password == "") {
        showMsg("密码不能为空！", "error");
        $("#registerForm #regPassword").focus();
        return;
    }
    if (password != repeatPassword) {
        showMsg("两次密码不相同！", "error");
        $("#registerForm #regRepeatPassword").focus();
        return;
    }
    if (code == "") {
        showMsg("验证码不能为空！", "error");
        $("#registerForm #regCode").focus();
        return;
    }
    if (code.length != 6 || isInteger(code) == false) {
        showMsg("验证码必须是6位数字！", "error");
        $("#registerForm #regCode").focus();
        return;
    }
    $(".registerBtn").html("注册中...");
    $(".registerBtn").attr("disabled", true);
    postRemote($("#registerForm").attr('action'), {
        userName: userName,
        password: password,
        code: code
    }, registerCallback);
}
//注册回调函数
function registerCallback(result) {
    $(".registerBtn").attr("disabled", false);
    $(".registerBtn").html("注册");
    if (result.stateCode == "1") {
        showMsg("验证码失效！", "error");
    } else if (result.stateCode == "2") {
        showMsg("验证码错误！", "error");
    } else if (result.stateCode == "3") {
        showMsg("账户错误！", "error");
    } else if (result.stateCode == "4") {
        showMsg("密码格式不正确！", "error");
    } else if (result.stateCode == "5") {
        showMsg("注册失败！", "error");
    } else {
        showMsg("注册成功！", "success");
    }
}



//重置密码
function resetPwd() {
    $("#resetPasswordModal").modal('show');
    $("#resetPasswordForm")[0].reset();
}
//获取短信验证码（忘记密码）
var validCodeForPwd = true;
$(".validateBtnForPwd").click(function () {
    var userName = $("#resetPasswordForm #resetUserName").val().trim();
    if (userName == "") {
        showMsg("手机号码不能为空！", "error");
        $("#resetPasswordForm #resetUserName").focus();
        return;
    }
    if (userName.length != 11 || isInteger(userName) == false) {
        showMsg("手机号码格式错误！", "error");
        $("#resetPasswordForm #resetUserName").focus();
        return;
    }

    var time = 60;
    var code = $(this);
    if (validCodeForPwd) {
        validCodeForPwd = false;
        code.attr("disabled", true);
        var t = setInterval(function () {
            time--;
            code.html(time + "秒");
            if (time == 0) {
                clearInterval(t);
                code.html("重新获取");
                validCodeForPwd = true;
                code.attr("disabled", false);
            }
        }, 1000);

        postRemote("student/loginRegisterServlet.do?flag=getSecurityCode", {
            phoneNo: userName,
            type: 2
        }, function (result) {

            if (result.stateCode == "-1") {
                showMsg("服务器出现错误，请稍候再试！", "error");
            } else if (result.stateCode == "-3") {
                showMsg("该账户不存在！", "error");
            } else if (result.stateCode == "2") {
                showMsg("获取验证码成功,请注意查收!", "success");
            }
        });
    }
});

function doResetPassword() {
    var userName = $("#resetPasswordForm #resetUserName").val().trim();
    var password = $("#resetPasswordForm #resetPassword").val().trim();
    var phoneCode = $("#resetPasswordForm #resetCode").val().trim();

    if (userName == "") {
        showMsg("手机号码不能为空！", "error");
        $("#resetPasswordForm #resetUserName").focus();
        return;
    }
    if (userName.length != 11 || isInteger(userName) == false) {
        showMsg("手机号码格式错误！", "error");
        $("#resetPasswordForm #resetUserName").focus();
        return;
    }
    if (password == "") {
        showMsg("密码不能为空！", "error");
        $("#resetPasswordForm #resetPassword").focus();
        return;
    }
    if (phoneCode == "") {
        showMsg("验证码不能为空！", "error");
        $("#resetPasswordForm #resetCode").focus();
        return;
    }
    if (phoneCode.length != 6 || isInteger(phoneCode) == false) {
        showMsg("验证码必须是6位数字！", "error");
        $("#resetPasswordForm #resetCode").focus();
        return;
    }
    $(".resetPwdBtn").html("注册中...");
    $(".resetPwdBtn").attr("disabled", true);

    postRemote($("#resetPasswordForm").attr('action'), {
        userName: userName,
        password: password,
        phoneCode: phoneCode
    }, resetPasswordCallback);
}
//重置密码回调函数
function resetPasswordCallback(result) {
    $(".resetPwdBtn").attr("disabled", false);
    $(".resetPwdBtn").html("注册");
    if (result.stateCode == "1") {
        showMsg("验证码失效！", "error");
    } else if (result.stateCode == "2") {
        showMsg("验证码错误！", "error");
    } else if (result.stateCode == "3") {
        showMsg("账户错误！", "error");
    } else if (result.stateCode == "4") {
        showMsg("密码格式不正确！", "error");
    } else if (result.stateCode == "-1") {
        showMsg("重置失败！", "error");
    } else if (result.stateCode == "0") {
        showMsg("重置成功！", "success");
        $("#resetPasswordModal").modal('hide');
    }
}

function delQueStr(url, ref) //删除参数值
{
    var str = "";

    if (url.indexOf('?') != -1)
        str = url.substr(url.indexOf('?') + 1);
    else
        return url;
    var arr = "";
    var returnurl = "";
    var setparam = "";
    if (str.indexOf('&') != -1) {
        arr = str.split('&');
        for (i in arr) {
            if (arr[i].split('=')[0] != ref) {
                returnurl = returnurl + arr[i].split('=')[0] + "=" + arr[i].split('=')[1] + "&";
            }
        }
        return url.substr(0, url.indexOf('?')) + "?" + returnurl.substr(0, returnurl.length - 1);
    }
    else {
        arr = str.split('=');
        if (arr[0] == ref)
            return url.substr(0, url.indexOf('?'));
        else
            return url;
    }
}



//微信端登录
function loginFromWechat(callFunction) {
    postRemote("user/thirdlyServlet.do?flag=login3_0_1", { accessToken: getCookie("accessToken"), openid: getCookie("openid") }, loginFromWechatCallback, callFunction);
}
//微信授权后用openid登录
function loginFromWechatCallback(result, callFunction) {
    if (result.userId)
        setCookie("userId", result.userId);

    if (callFunction != null)//初始化登录
    {
        if (typeof callFunction === "function") {
            callFunction();
        }
        return;
    }

    if (result.stateCode == 1) {
        showMsg("无效授权", "error");
        return;
    } else {
        if (result.isBind == false) {
            //新用户,绑定手机，填写资料
            window.location.href = "bindphone.html?redirectUrl=" + redirectUrl;
        } else if (result.isBind = true && result.isEdit == false) {
            //未填写资料，进入完善资料界面
            window.location.href = "updatepersoninfo.html?redirectUrl=" + redirectUrl;
        } else {
            //已经绑定并资料齐全，直接显示用户的资料
            window.location.href = "personinfo.html?redirectUrl=" + redirectUrl;
        }
    }
}
//微信分享
function weixinShareConfig(weixinTitle, weixinDesc, weixinImg) {
    /***用户点击分享到微信圈后加载接口接口*******/
    var url = window.location.href.split('#')[0];
    //url = url.replace(/&/g, '%26');
    //alert("url:" + url);

    $.getJSON(wechatRemoteUrl + "wechat.ashx?callback=?", { action: "getTicket", shareUrl: url }, function (jsondata) {
        var data = jsondata;
        //alert(data.errcode);
        wx.config({
            debug: false,
            appId: appId,
            timestamp: data.timestamp,
            nonceStr: data.noncestr,
            signature: data.signature,
            jsApiList: [
                'checkJsApi',
                'onMenuShareTimeline',
                'hideOptionMenu',
                'onMenuShareAppMessage'
            ]
        });

        wx.ready(function () {
            //wx.hideOptionMenu();/***隐藏分享菜单****/
            wx.checkJsApi({
                jsApiList: [
                  'getLocation',
                  'onMenuShareTimeline',
                  'onMenuShareAppMessage'
                ],
                success: function (res) {
                    //alert(res.errMsg);
                }
            });

            wx.onMenuShareAppMessage({
                title: weixinTitle,
                desc: weixinDesc,
                link: url,
                imgUrl: weixinImg,
                trigger: function (res) {
                    //alert('用户点击发送给朋友');
                },
                success: function (res) {
                    // alert('分享了～～');

                },
                cancel: function (res) {
                    //alert('已取消');
                },
                fail: function (res) {
                    alert(res.errMsg);
                }
            });

            // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
            wx.onMenuShareTimeline({
                title: weixinTitle,
                desc: weixinDesc,
                link: url,
                imgUrl: weixinImg,
                trigger: function (res) {
                    //alert('用户点击分享到朋友圈');
                },
                success: function (res) {
                    // alert('分享了～～');

                },
                cancel: function (res) {
                    //alert('已取消');
                },
                fail: function (res) {
                    alert(res.errMsg);
                }
            });

            wx.error(function (res) {
                alert(res.errMsg);
            });
        });

    });
}