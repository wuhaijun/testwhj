'use strict';

let maskLayer = $(
`<div class="sync-layer">
    <div class="load-effect">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
    </div>
</div>`);
let temp;
function showGlobalLoading() {
    temp = maskLayer.clone().appendTo(document.body);
}

function hideGlobalLoading() {
    if(temp) {
        temp.hide().remove();
        temp = null;
    }
}

module.exports = {
    showGlobalLoading,
    hideGlobalLoading
};
