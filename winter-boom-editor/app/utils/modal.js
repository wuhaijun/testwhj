import _ from 'lodash';

let modal;
let dialog;
let content;
let body;

function show() {
    modal.show();
    body.addClass('modal-open');
}

function close() {
    modal.hide();
    body.removeClass('modal-open');
    content.empty();
}

function open(dom, width = '60%') {
    if(!modal) {
        body = $('body');
        modal = $(modalHtml);
        body.append(modal);
        dialog = modal.find('div.modal-dialog');
        content = dialog.find('div.modal-content');

        modal.click(e => {
            if(e.target == e.currentTarget) {
                close();
            }
        });
    }
    dialog.css('width', width);
    dom.appendTo(content);
    show();
};

function openSimple(title, dom, buttons) {
    let $dialog = $('<div></div>');
    $dialog.append(
        $(`<div></div>`).css({

        }).append(
            $(`<h3>${title}</h3>`).css({
                'margin': '0 20px',
                'font-size': '17px',
                'font-weight': 'normal',
                'line-height': '52px',
                'color': '#222',
            })
        )
    );
    let body = $(`<div></div>`);
    $dialog.append(body.append(dom));
    if(buttons) {
        let footer = $(`<div></div>`);
        _.each(buttons, b => {
            footer.append(
                $(`<button>${b.name}</button>`).css({
                    'display': 'inline-block',
                    'height': '30px',
                    'min-width': '104px',
                    'color': '#fff',
                    'font-height': '30px',
                    'font-size': '14px',
                    'text-align': 'center',
                    'padding': '0 22px',
                    'border': '1px solid #44b549',
                    'border-radius': '3px',
                    'background-color': b.color,
                }).click(b.click)
            ).css({
                'text-align': 'center',
                'padding': '16px 0',
                'background-color': '#f4f5f9'
            });
        });
        $dialog.append(footer);
    }
    open($dialog);
}

const modalHtml =
`<div id="winter-editor-modal" class="modal">
    <div class="modal-dialog">
        <div class="modal-content">
        </div>
    </div>
</div>`;

export default {open, openSimple, close};
