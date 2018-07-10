//压缩图片
function selectFileImage(fileObj, imgId) {
    var file = fileObj.files['0'];
    //图片方向角 added by lzk
    var Orientation = null;

    if (file) {
        console.log("fiximg start...");
        // var rFilter = /^(image\/jpeg|image\/png)$/i; // 检查图片格式
        //if (!rFilter.test(file.type)) {
        //alert("请选择jpeg、png格式的图片")
        //showMyTips("请选择jpeg、png格式的图片", false);
        //   return;
        //}
        // var URL = URL || webkitURL;
        //获取照片方向角属性，用户旋转控制
        EXIF.getData(file, function () {
            // alert(EXIF.pretty(this));
            EXIF.getAllTags(this);
            //alert(EXIF.getTag(this, 'Orientation')); 
            Orientation = EXIF.getTag(this, 'Orientation');
            //return;
        });

        var oReader = new FileReader();
        oReader.onload = function (e) {
            //var blob = URL.createObjectURL(file);
            //_compress(blob, file, basePath);
            var image = new Image();
            image.src = e.target.result;
            image.onload = function () {
                var expectWidth = this.naturalWidth;
                var expectHeight = this.naturalHeight;

                if (this.naturalWidth > this.naturalHeight && this.naturalWidth > 800) {
                    expectWidth = 800;
                    expectHeight = expectWidth * this.naturalHeight / this.naturalWidth;
                } else if (this.naturalHeight > this.naturalWidth && this.naturalHeight > 1200) {
                    expectHeight = 1200;
                    expectWidth = expectHeight * this.naturalWidth / this.naturalHeight;
                }
                //alert(expectWidth+','+expectHeight);
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");
                canvas.width = expectWidth;
                canvas.height = expectHeight;
                ctx.drawImage(this, 0, 0, expectWidth, expectHeight);
                //alert(canvas.width+','+canvas.height);

                var base64 = null;
                var mpImg = new MegaPixImage(image);
                mpImg.render(canvas, {
                    maxWidth: 800,
                    maxHeight: 1200,
                    quality: 0.8,
                    orientation: Orientation
                });
                base64 = canvas.toDataURL("image/jpeg", 0.8);
                $(imgId).attr("src", base64);
                //生成缩略图
                if ($(imgId.replace(".real", ".thumb")).length > 0) {
                    createThumbImage(base64, imgId.replace(".real", ".thumb"));
                }
                var loadImg = false;
                if ($("#cutImgBox").length > 0) {
                    $("#pictureBox img").load(function () {
                        var w = $("#pictureBox img").width() > $("#pictureBox img").height() ? $("#pictureBox img").height() : $("#pictureBox img").width();
                        $("#cutImgBox").width(w - 4);
                        $("#cutImgBox").height(w - 4);
                        $("#cutImgBox").css("left", $('#pictureBox img').position().left + "px");
                        $("#cutImgBox").css("top", $('#pictureBox img').position().top + "px");
                       
                        if (loadImg == false) {
                            $("#cutImgBox").css("display", "block");
                            loadImg = true;
                        }
                    });
                }
            };
        };
        oReader.readAsDataURL(file);
    }
}

function createThumbImage(data, imgId) {
    var image = new Image();
    image.src = data;
    image.onload = function () {
        var expectWidth = this.naturalWidth;
        var expectHeight = this.naturalHeight;

        if (this.naturalWidth > this.naturalHeight && this.naturalWidth > 400) {
            expectWidth = 400;
            expectHeight = expectWidth * this.naturalHeight / this.naturalWidth;
        } else if (this.naturalHeight > this.naturalWidth && this.naturalHeight > 600) {
            expectHeight = 600;
            expectWidth = expectHeight * this.naturalWidth / this.naturalHeight;
        }
        //alert(expectWidth+','+expectHeight);
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        canvas.width = expectWidth;
        canvas.height = expectHeight;
        ctx.drawImage(this, 0, 0, expectWidth, expectHeight);
        //alert(canvas.width+','+canvas.height);

        var base64 = canvas.toDataURL("image/jpeg", 0.5);
        $(imgId).attr("src", base64);
    };
}

//对图片旋转处理 added by lzk
function rotateImg(img, direction, canvas) {
    //alert(img);
    //最小与最大旋转方向，图片旋转4次后回到原方向  
    var min_step = 0;
    var max_step = 3;
    //var img = document.getElementById(pid);  
    if (img == null) return;
    //img的高度和宽度不能在img元素隐藏后获取，否则会出错  
    /*var height = img.height;  
    var width = img.width;  */
    var height = canvas.height;
    var width = canvas.width;
    alert(width + ',' + height);
    //var step = img.getAttribute('step');  
    var step = 2;
    if (step == null) {
        step = min_step;
    }
    if (direction == 'right') {
        step++;
        //旋转到原位置，即超过最大值  
        step > max_step && (step = min_step);
    } else {
        step--;
        step < min_step && (step = max_step);
    }
    //img.setAttribute('step', step);  
    /*var canvas = document.getElementById('pic_' + pid);  
    if (canvas == null) {  
        img.style.display = 'none';  
        canvas = document.createElement('canvas');  
        canvas.setAttribute('id', 'pic_' + pid);  
        img.parentNode.appendChild(canvas);  
    }  */
    //旋转角度以弧度值为参数  
    var degree = step * 90 * Math.PI / 180;
    var ctx = canvas.getContext('2d');
    switch (step) {
        case 0:
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0);
            break;
        case 1:
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(degree);
            ctx.drawImage(img, 0, -height);
            break;
        case 2:
            canvas.width = width;
            canvas.height = height;
            ctx.rotate(degree);
            ctx.drawImage(img, -width, -height);
            break;
        case 3:
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(degree);
            ctx.drawImage(img, -width, 0);
            break;
    }
}

/**
* 将以base64的图片url数据转换为Blob
* @param urlData
* 用url方式表示的base64图片数据
*/
function convertBase64UrlToBlob(urlData) {
    var bytes = window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte
    //处理异常,将ascii码小于0的转换为大于0
    var ab = new ArrayBuffer(bytes.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
}
//上传时间
var uploadImgTotalTime = 0;
//需要上传的图片
var uploadImgArr = [];
//已经上传的图片地址
var uploadedImgArr = [];
//上传成功回调函数
var uploadCallbackFunction;
//上传图片，通用上传图片接口
function uploadImage() {
    if (uploadImgArr.length == 0) {
        if (uploadCallbackFunction) {
            uploadCallbackFunction.apply(this);
        }
        return;
    }

    var imageData = uploadImgArr[0];
    if (imageData) {
        var formData = new FormData();
        formData.append("picture", convertBase64UrlToBlob(imageData), "image.jpeg");

        $.ajax({
            url: remoteUrl + "student/projectServlet.do?flag=uploadPicture",
            data: formData,
            type: "POST",
            responseType: 'blob',
            dataType: "json",
            processData: false,         // 告诉jQuery不要去处理发送的数据
            contentType: false,        // 告诉jQuery不要去设置Content-Type请求头
            cache: false,
            success: function (result) {
                if (result.stateCode == 0) {
                    console.log(result.picUrl);
                    var imgName = result.picUrl.substr(result.picUrl.lastIndexOf("/") + 1);
                    //删除第一个图片
                    uploadImgArr.splice(0, 1);
                    //保持服务器图片地址到数组
                    uploadedImgArr.push(imgName);
                    //如果还有图片就继续上传
                    if (uploadImgArr.length > 0)
                        uploadImage();
                    else {
                        $("#pictureUploadModal .modal-body span").html(uploadImgTotalTime * uploadImgArr.length / (uploadImgArr.length + uploadedImgArr.length));
                        //alert("全部上传成功！");
                        if (uploadCallbackFunction) {
                            uploadCallbackFunction.apply(this);
                        }
                    }
                } else {
                    if (result.stateCode == -1) {
                        alert("上传图片失败！");
                    } else if (result.stateCode == -2) {
                        alert("文件过大！");
                    } else {
                        alert("上传图片失败！");
                    }
                    $("#pictureUploadModal").modal("hide");
                    $(".saveShowBtn").html("发送");
                    $(".saveShowBtn").attr("disabled", false);
                }
            }
        });
    }
}