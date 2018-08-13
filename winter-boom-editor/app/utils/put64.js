
const baseQiniuUrl = "http://upload.qiniu.com/putb64/-1";
const baseImageUrl = "http://editor.static.cceato.com/";
let example = "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"
let uptoken = null;
let base64Reg = /data:(\w+\/\w+);base64,(\S*)/;

let put64 = function (article = "") {
  if (!uptoken) {
    $.ajax({
      url: "/images/uptoken",
      type: "get",
      async: false,
      success: (resp) => {
        uptoken = resp
      }
    });
  }

  let imageWillBeSaveList = [];

  let $article = $(article.content);
  let imageList = $article.find('img');
  for (let i = 0; i < imageList.length; i++) {
    let $img = imageList.eq(i);
    let imageSrc = $img.attr('src');
    if (base64Reg.test(imageSrc)) {
      let regexResult = base64Reg.exec(imageSrc);
      let data = regexResult[2];
      let mimeType = regexResult[1];
      $.ajax({
        url: baseQiniuUrl,
        data: data,
        async: false,
        type: 'post',
        headers: {
          "Content-Type": "application/octet-stream",
          "Authorization": `UpToken ${uptoken}`
        },
        success: (resp) => {
          let newSrc = baseImageUrl + resp.key;
          $img.attr('src', newSrc)
          //TODO 名称和分类以及size目前写死
          imageWillBeSaveList.push({ name: "未命名", key: resp.key, size: -1, mimeType: mimeType, category: "paste" });
        }
      });
    }
  }
  if (imageWillBeSaveList.length > 0) {
    $.post("/images/save", { images: imageWillBeSaveList }, (resp) => {
    });
    let result = $('<div></div>');
    result.append($article);
    article.content = result.html();
  }

}

export default put64;