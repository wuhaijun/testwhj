'use strict';
import { isFunction } from '../../common/TypeUtils';


export default class {
    constructor(pageSize, total, callback, context) {
        this.pageSize = pageSize || 20;
        this.pageNum = 1;
        this.total = total;
        this.totalPage = Math.ceil(this.total / this.pageSize);
        this.callback = callback || function() {};
        this.context = context;
    }

    render() {
        let $comp = $(`
        <div class="editor-pagination">
            <button class="prev-page">上一页</button>
            <button class="next-page">下一页</button>
        </div>`);

        let __this__ = this;
        $comp.find('.prev-page').click(function() {
            if (__this__.pageNum == 1) return;

            __this__.pageNum -= 1;
            __this__.callback.apply(__this__.context, [__this__.pageSize, __this__.pageNum]);
        });

        $comp.find('.next-page').click(function() {
            if (__this__.pageNum == __this__.totalPage) return;

            __this__.pageNum += 1;
            __this__.callback.apply(__this__.context, [__this__.pageSize, __this__.pageNum]);
        });

        return $comp;
    }
}