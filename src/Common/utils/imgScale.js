
const imgScale = (imgUrl, fileList) => {
    return new Promise(function (resolve, reject) {
        let img = new Image();
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        let base64 = null;
        img.src = imgUrl;

        img.onload = function () {
            // let s = util.getPhotoOrientation(fileList)
            // console.log(s);
            if ((fileList.size / 1024 / 1024) > 0) { //质量大于1m
                //缩放后图片的宽高
                // 500 k  800 x 500
                let rateW = img.naturalWidth / 400
                // let rateH = img.naturalHeight / 250
                let width, height
                width = img.naturalWidth / rateW;
                height = img.naturalHeight / rateW;
                canvas.width = width;
                canvas.height = height;
                /**
                 * 解决图片垂直问题 进行旋转
                 */
                if (img.naturalWidth < img.naturalHeight) {
                    canvas.height = width;
                    canvas.width = height;
                    ctx.rotate(-Math.PI / 2);
                    ctx.translate(-width, 0);
                }
                ctx.drawImage(this, 0, 0, width, height);

                base64 = canvas.toDataURL('image/jpeg', 0.8);
                resolve(base64);
            } else {
                var expectWidth = img.naturalWidth;
                var expectHeight = img.naturalHeight;
                if (img.naturalWidth > img.naturalHeight && img.naturalWidth > 800) {
                    expectWidth = 1200;
                    expectHeight = expectWidth * img.naturalHeight / img.naturalWidth;
                } else if (img.naturalHeight > img.naturalWidth && img.naturalHeight > 1200) {
                    expectHeight = 900;
                    expectWidth = expectHeight * img.naturalWidth / img.naturalHeight;
                }
                canvas.width = expectWidth;
                canvas.height = expectHeight;
                ctx.drawImage(img, 0, 0, expectWidth, expectHeight);
                base64 = canvas.toDataURL("image/jpeg", 0.4);
                resolve(base64);
            }
        }
    })
}
export default imgScale
