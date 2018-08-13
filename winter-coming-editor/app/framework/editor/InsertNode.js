import range from '../../utils/range';
import dom from '../../utils/dom';

import _ from 'lodash';

export default function (editorDom, editable, lastSection, $node) {

    let section = $('<section class="winter-section"></section>')
        .css({'margin-bottom': '5px'})
        .append($node);

    if (dom.isEmpty(editable[0]) || dom.emptyPara === editable.html()) {
        editable.empty();
        lastSection = undefined;
    }

    if (lastSection) {
        section.insertAfter(lastSection);
    } else {
        editable.append(section);
    }

    let textNode = _.find(section.find('*').contents(), c => {
        if (c.nodeType && c.nodeType === 3 && _.trim(c.textContent).length > 0) {
            return c;
        }
    });

    if (textNode) {
        let r = range.create(textNode, 0, textNode, 0);
        r.select();
        editable.focus();
    }

    return section;
}