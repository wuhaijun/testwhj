'use strict';

const TEXT_PREFIX = 'text-';
const ANIMATE_PREFIX = 'animate-';
const ANIMATETRANSFORM_PREFIX = 'animateTransform-';
const RECT_PREFIX = 'rect-'
/**
 * Copy all attributes from $source to $target, and add prefix to name
 * @param $source
 * @param $target
 * @param prefix
 */
function copyAttr($source, $target, prefix = '') {
    forEachAttributes($source, (name, value) => {
        $target.attr(prefix + name, value);
    });
}

/**
 * for each all attributes of $source that start with prefix
 * @param $source
 * @param prefix
 * @param callback
 */
function forEachAttributes($source, callback, prefix = '') {
    [].forEach.call($source, function (source) {
        $.each(source.attributes, function () {
            if (!prefix || this.name.startsWith(prefix)) {
                callback(this.name.replace(prefix, ''), this.value);
            }
        });
    });
}

const Layer1 = {
    build: function ($t) {
        let $svgs = $t.children('svg');
        let $h5 = $t.children('h5');
        let $span = $h5.children('span');

        let $rects = $svgs.find('rect');
        [].forEach.call($rects, function (rect) {
            let $rect = $(rect);
            $rect.attr("fill",$span.css("backgroundColor"));
        })

        $svgs.css({'display':'inline-block'});
        $h5.remove();
        return $t;
    },
    edit: function ($t) {
        let $svgs = $t.children('svg');
        let $center = $t.children('center');
        let $rect = $svgs.children('rect');

        $svgs.css({'display':'none'});
        $center.before($(`<h5 style='color:#ccc;'>覆盖颜色选择：<span style='display: inline-block;width:10px;height:10px;border-radius:50%;background-color:${ $rect.attr('fill') }'></span></h5>`));

        return $t;
    }
};


const Layer2 = {
    build: function (sectionTemplate) {
        let $sectionTemplate = $(sectionTemplate);
        let $secs = $sectionTemplate.children('section');
        let $p2 = $sectionTemplate.children('p');

        $sectionTemplate.css("overflow","hidden");
        let $svgs = [].map.call($secs, function (sec) {
            let $sec = $(sec);
            let $svg = $(`<svg></svg>`);
            copyAttr($sec, $svg);

            let $ps = $sec.find('p');

            let textTArr = [];
            let fromArr = [];
            let toArr = [];

            [].forEach.call($ps, function (p, index) {
                let $p = $(p);
                let AnimateTo = $p.attr("animate-to");
                toArr.push(+AnimateTo)                
            })

            let newToArr = toArr.reverse();
            newToArr.forEach((item, index) => {
                if (index === 0) return;
                newToArr[index] = newToArr[index - 1] - 30;
            })

            toArr = newToArr.reverse();
            [].forEach.call($ps, function (p, index) {
                let $p = $(p);
                let $text = $('<text></text>');
                let $animate = $('<animate></animate>');
                let $animateName = $p.attr("animate-attributename");

                if($animateName == "y"){
                    $p.attr("animate-to", toArr[index]);          
                    let TextyY = 0;
                    let AnimateFrom = 0;

                    if(index > 0) {
                        TextyY = $p.prev().attr("text-y") - 0 + 30;
                        AnimateFrom = $p.prev().attr("animate-from") - 0 + 30;
                        $p.attr("text-y", +TextyY );                    
                        $p.attr("animate-from", +AnimateFrom );  
                    }
                }

                forEachAttributes($p, (name, value) => {
                    $text.attr(name, value);
                }, TEXT_PREFIX);

                forEachAttributes($p, (name, value) => {
                    $animate.attr(name, value);
                }, ANIMATE_PREFIX);


                let $children = $p.children('*');
                let originColor = $p.css('color');
                let text = $p.text();
                $text.attr('fill',originColor);
                if ($children.length == 0) {
                    $text.text(text);
                } else {
                    [].forEach.call($children, function (child) {
                        let $child = $(child);
                        let color = $child.is('font') ? $child.attr('color') : $child.is('span') ? $child.css('color') : originColor;
                        $text.append($(`<tspan fill="${ color }">${ $child.text() }</tspan>`));
                    });
                }
               
                $text.append($animate);
                $svg.append($text);
            });
            

            return $svg;
        });

        $sectionTemplate.html('');
        
        if($p2) {
            $sectionTemplate.append($p2);
        }else {

        }

        $svgs.forEach(function ($svg) {
            var serializer = new XMLSerializer();
            var svgStr = serializer.serializeToString($svg[0]);
            $sectionTemplate.append(svgStr);
        });
        
        return $sectionTemplate;

    },
    edit: function (svgTemplate) {
        let $svgTemplate = $(svgTemplate);
        let $svgs = $svgTemplate.children('svg');
        let $p1 = $svgTemplate.children('p');

        let $sections = [].map.call($svgs, function (svg) {
            let $svg = $(svg);
            let $section = $(`<section></section>`);
            copyAttr($svg, $section);
            $section.css("overflow","auto");
            $svgTemplate.css("overflow","auto");

            let $texts = $svg.find('text');
            [].forEach.call($texts, function (text) {
                let $text = $(text);
                let $p = $('<p></p>');
                let $animate = $text.children('animate');

                copyAttr($text, $p, TEXT_PREFIX);
                copyAttr($animate, $p, ANIMATE_PREFIX);

                $p.css('color', $text.attr('fill'));
                $p.css('font-size', $text.attr('font-size'));

                let content = $text.text();
                let $tspans = $text.children('tspan');
                if ($tspans.length == 0) {
                    $p.text(content);
                } else {
                    [].forEach.call($tspans, function (tspan) {
                        let $tspan = $(tspan);
                        $p.append($(`<span style="color: ${ $tspan.attr('fill') }">${ $tspan.text() }</span>`));
                    });
                }
                $section.append($p);
            });
            return $section;
        });

        $svgTemplate.html('');
        $sections.forEach(function ($section) {
            if($p1){
                $svgTemplate.append($p1);
                $svgTemplate.append($section);
            }else {
                $svgTemplate.append($section);
            }
            
        });
        $svgTemplate.addClass("synamic-style-editor");

        return $svgTemplate;
    },
};

const Layer3 = {
    build: function ($t) {
        let $svgs = $t.children('svg');
        let $h5 = $t.children('h5');
        let $span = $h5.children('span');
        let $rects = $svgs.find('rect');
        [].forEach.call($rects, function (rect,index) {
            let $rect = $(rect);
            if(index % 2 != 0 ){
                $rect.attr("fill",$span[1].style.backgroundColor);  
            } else{
                $rect.attr("fill",$span[0].style.backgroundColor);
            }
        })

        $svgs.css({'display':'inline-block'});
        $h5.remove();
        return $t;
    },
    edit: function ($t) {
        let $svgs = $t.children('svg');
        let $center = $t.children('center');
        let $rect = $svgs.children('rect');
        $svgs.css({'display':'none'});
        $center.before($(`<h5 style='color:#ccc;'>覆盖颜色选择：<span style='display: inline-block;width:10px;height:10px;border-radius:50%;background-color:${ $rect[0].getAttribute('fill') }'></span><span style='display: inline-block;width:10px;height:10px;border-radius:50%;background-color:${ $rect[1].getAttribute('fill') };border:1px solid #ccc;'></span></h5>`));

        return $t;
    }
};

const Layer4 = {
    build: function ($t) {
        let div = $t.find('div');
        let svg = $t.find('svg');
        let textList = svg.find('text');
        let newTextList = div.find('p');
        for(let i=0;i<textList.length && i<newTextList.length;i++) {
            textList.eq(i).text(newTextList.eq(i).text());
            textList.eq(i).attr('fill',newTextList.eq(i).css('color'));
        }
        div.remove();
        svg.show();
        return $t;
    },
    edit: function ($t) {
        let svg = $t.find('svg');
        let editHtml = '';
        svg.find('text').each(function () {
            editHtml += `<p style="font-size: 12px;color:#000;">${$(this).text()}</p>`;
        });
        $(`<div><span style="font-size: 10px; color: #bbbbbb">上方文字为最终答案，下方每段为一遮层的内容。</span>
            <br/><span style="font-size: 10px; color: #bbbbbb">由下至上是显示顺序，修改并保存后生效。</span>
            ${editHtml}</div>`)
            .css({'margin-top': '25px'}).insertBefore(svg);
        svg.hide();
        return $t;
    }
};

module.exports = {
    'img-layer-hidden-1': Layer1,
    'img-layer-hidden-2': Layer2,
    'img-layer-hidden-3': Layer3,
    'img-layer-hidden-4': Layer4,
};