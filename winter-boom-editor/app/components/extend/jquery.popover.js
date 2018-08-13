import './jquery.popover.css';
//@TODO 这个已经没用了？
(function($) {
    'use strict';
     $.fn.extend({
         popConfirm: function (message, placement= 'top' ) {
             return this.each(function (){
                 let arrayActions = [];
                 let $this = $(this);

                 if (jQuery._data(this, "events") && jQuery._data(this, "events").click) {
                     for (let i = 0; i < jQuery._data(this, "events").click.length; i = i + 1) {
                         arrayActions.push(jQuery._data(this, "events").click[i].handler);
                     }
                     $this.unbind("click");
                 }

                 if ($this.attr('onclick')) {
                     let code = $this.attr('onclick');
                     arrayActions.push(function () {
                         eval(code);
                     });
                     $this.prop("onclick", null);
                 }

                 if (!$this.data('remote') && $this.attr('href')) {
                     arrayActions.push(function () {
                         window.location.href = $this.attr('href');
                     });
                 }

                 if ($this.attr('type') && $this.attr('type') === 'submit') {
                     let form = $this.parents('form:first');
                     arrayActions.push(function () {
                         if(typeof $this.attr('name') !== "undefined") {
                             $('<input type="hidden">').attr('name', $this.attr('name')).attr('value', $this.attr('value')).appendTo(form);
                         }
                         form.submit();
                     });
                 }
                 
                 __popover__($this, arrayActions, {
                     placement: placement,
                     title: message,
                     trigger: 'manual',
                     html: true
                 });
             });
         }
     });

    function __popover__($target, arrayActions, options) {
        let last = null;
        let activeClassName = 'popover-active';

        options.content = `
            <div class="popover-confirm-operator">
                 <span class="btn popover-confirm-operator-cancel">取消</span>
                 <span class="btn popover-confirm-operator-confirm">确定</span>
            </div>`;

        let $this = $target;
        $this.popover(options);

        $this.bind('click', function(e){
            e.preventDefault();
            e.stopPropagation();

            if (last && last !== $this) {
                last.popover('hide').removeClass(activeClassName);
            }
            last = $this;

            $('.' + activeClassName).not($this).popover('hide').removeClass(activeClassName);
            $this.popover('show').addClass(activeClassName);
        });

        $this.on('shown.bs.popover', () => {
            let $popover = $this.next('.popover');

            $popover.find('.popover-confirm-operator-confirm').click((e) => {
                e.preventDefault();
                e.stopPropagation();
                for (let i = 0; i < arrayActions.length; i = i + 1) {
                    arrayActions[i].apply($this);
                }
                $this.popover('hide').removeClass(activeClassName);
            });

            $popover.find('.popover-confirm-operator-cancel').click((e) => {
                e.preventDefault();
                e.stopPropagation();
                $this.popover('hide').removeClass(activeClassName);
            });

            $(document).on('click', function () {
                if (last) {
                    last.popover('hide').removeClass(activeClassName);
                }
            });
        });
    }
})(jQuery);
