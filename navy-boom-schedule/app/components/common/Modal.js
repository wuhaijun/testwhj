'use strict';

export default class  {
    constructor(props) {
        this.$header = null;
        this.$body = null;
        this.$footer = null;
        this.$this = null;
        this.id = props.id;
    }

    open = options => {
        this.rendered();
        $('body').append(this.$this);
        this.$this.modal(options);

        this.$this.on('hidden.bs.modal', e => {
            this.$this.remove();
        });
    };

    close = () => {
        this.$this.modal('hide');
    };

    flush() {
        if (!this.$this) return;
        let $content = this.$this.find('.modal-content');
        $content.html('');
        this.__buildBody__($content);
    }

    rendered = () => {
        this.$this = this.render();
        let $content = this.$this.find('.modal-content');
        this.__buildBody__($content);

        this.$this.attr('id', this.id);
    };

    __buildBody__ = $content => {
        if (this.$header) {
            let $modal_header = $(`
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true" style="font-size: 32px">&times;</span>
                    </button>
                </div>
            `);
            $modal_header.append(this.$header);
            $content.append($modal_header);
        }
        this.$body && $content.append($(`<div class="modal-body"></div>`).append(this.$body));
        this.$footer && $content.append($(`<div class="modal-footer"></div>`).append(this.$footer));
    };

    render() {
        return $(`
            <div class="modal fade" tabindex="-1" role="dialog" aria-hidden="true" aria-labelledby="modalLabel">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">

                    </div>
                </div>
            </div>
        `)
    }
}