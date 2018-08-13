'use strict';

export default class  {
    popover($target, props) {

        let default_props = {
            trigger: 'click',
            html: true,
            placement: "bottom",
            title: "A popover title",
            content: "A popover content"
        };

        props = Object.assign({}, default_props, props);
        let ok = props.ok || function() {};
        let cancel = props.cancel || function() {};
        let shown = props.shown || function() {};
        let hidden = props.hidden || function() {};

        props.content = `
            <div class="edit-popover-warp">
                <div class="popover-inner">
                    <div class="edit-popover-content">
                          ${ props.content }
                    </div>
                    <div class="popover-bar">
                         <a href="javascript:;" class="btn btn-primary js-commitb-btn">确定</a>
                         <a href="javascript:;" class="btn btn-default js-canncel-btn">取消</a>
                    </div>
                </div>
            </div>`;

        let $this = $target;
        $this.on('click',function(e){
            e.preventDefault();
            e.stopPropagation();
        }).popover(props);

        let $popover;
        $this.on('shown.bs.popover', () => {
            $popover = $this.next('.popover');

            // callback shown
            shown($popover);

            $popover.find('.popover-bar .js-commitb-btn').click((e) => {
                e.preventDefault();
                e.stopPropagation();
                ok($popover, () => {
                    $this.popover('hide');
                    $this.click();
                });
            });

            $popover.find('.popover-bar .js-canncel-btn').click((e) => {
                e.preventDefault();
                e.stopPropagation();
                $this.popover('hide');
                $this.click();

                // callback cancel
                cancel($popover);
            });
        });

        $this.on('hiden.bs.popover', () => {
            // callback shown
            hidden($popover);
        });
    };
}