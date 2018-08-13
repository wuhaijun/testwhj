import modal from '../../utils/modal';
import upload from '../../utils/upload';
import ImageSelectList from '../../utils/ImageSelectList';

export default function (module) {

    function buildFromContentBtn(coverImg) {
        let fromContentBtn = $('<a>从正文选择</a>');
        let content = $('<div></div>').css({padding: '30px 42px'});
        content.append($('<p>请从正文使用过的图片中选择封面</p>').append(
            $('<span>尺寸小于200*200的图片已被自动过滤</span>').css({
                color: '#8d8d8d',
                'padding-left': '10px'
            })
        ).css({
            'font-size': '14px',
            'line-height': '14px'
        }));

        let imgListDiv = $('<div></div>').appendTo(content);

        fromContentBtn.click(e => {

            let imageSelectList = ImageSelectList(module.editable.find('img'));
            imgListDiv.empty();
            imgListDiv.append(imageSelectList.dom);

            modal.openSimple('选择封面', content, [
                {color: '#44b549', name: '确定', click: e => {
                    let result = imageSelectList.getSelected();
                    if(result) {
                        coverImg.attr('src', result.src);
                    }
                    modal.close();
                }}
            ]);
        });
        return fromContentBtn;
    }

    function buildUploadBtn(coverImage) {
        let btn = $('<a>本地上传</a>');
        let u = upload({
            name: 'image',
            url: () => ('/upload/image/'),
            change: () => confirm('确认上传新图片？'),
            success: result => {
                let json = JSON.parse(result);
                coverImage.attr('src', 'http://editor.static.cceato.com/' + json.key);
            }
        });
        btn.click(e => {
            u.click();
        });
        return btn;
    }

    let wrapper = $('<div></div>').css({
        width: '100%',
        padding: '20px 0 30px 20px',
        'margin-top': '30px'
    });

    let coverEidtor =
$(`<div class="cover-editor">
    <label>封面</label>
    <span class="text-muted">大图片建议尺寸：900像素 * 500像素 且小于2M</span>
</div>`);

    let img = $('<img src="" width="188" height="120"/>').css({
        'margin-top': '15px'
    });

    let buttonGroup = $(`<div style="margin-bottom: 15px;"></div>`);

    let fromContentBtn = buildFromContentBtn(img);
    let uploadBtn = buildUploadBtn(img);

    buttonGroup
        .append(fromContentBtn)
        .append(uploadBtn)
        .find('a').css({
            'color': '#222',
            'background-color': '#fff',
            'border': '1px solid #e7e7eb',
            'border-radius': '3px',
            'cursor': 'pointer',
            'height': '30px',
            'line-height': '30px',
            'padding-left': '22px',
            'padding-right': '22px',
            'margin-right': '22px',
            'display': 'inline-block'
        });

    coverEidtor
        .append(buttonGroup)
        .append(img)
        .append('<br/><br/><span class="text-muted">此图片将插入正文顶部</span>');

    let digestEditor =
$(`<div class="digest-editor" style="margin-top: 15px;">
    <div>
        <label>摘要</label>
        <span class="text-muted">选填，如果不填写会默认抓取正文前54个字</span>
    </div>
</div>`);

    let textarea = $('<textarea></textarea>').css({width: '100%', resize: 'none', height: '100%', border: '0 none'});
    digestEditor
        .append(
            $('<div></div>').css({width: '85%', height: '100px', border: '1px solid #e7e7eb'})
            .append(textarea)
        );

    wrapper
        .append(coverEidtor)
        .append(digestEditor);

    return {
        dom: wrapper,
        img: img,
        textarea: textarea
    }
};

