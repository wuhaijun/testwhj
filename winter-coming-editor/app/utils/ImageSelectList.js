export default function (imgList, multi = false) {

    let ul = $('<ul></ul>').css({
        'overflow-y': 'auto',
        'list-style-type': 'none',
        padding: 0,
    });

    let selected;
    let lastIcon;

    imgList.each(function () {
        let img = this;
        let icon = $('<div></div>').css({
            width: '115px',
            height: '115px',
            background: 'rgba(0, 0, 0, 0.7) none repeat scroll 0 0',
            cursor: 'pointer',
            'text-align': 'center'
        }).hide().append(
            $('<i class="fa fa-check-square"></i>').css({
                'line-height': '115px',
                'font-size': '40px'
            })
        );
        ul.append(
            $('<li></li>').css({
                width: '115px',
                height: '115px',
                float: 'left',
                margin: '0 15px 15px 0',
                'background': `#fff url("${img.src}") no-repeat scroll center center / cover `
            }).append(icon)
            .hover(e => {
                !(img === selected) && icon.show();
            }, e => {
                !(img === selected) && icon.hide();
            }).click(e => {
                if(selected === img) return;
                selected = img;
                lastIcon && lastIcon.hide();
                lastIcon = icon;
            })
        );
    });

    return {
        dom: ul,
        getSelected: () => {
            return selected;
        }
    };
}