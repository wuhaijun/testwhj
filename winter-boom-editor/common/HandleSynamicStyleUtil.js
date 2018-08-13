const TEXT_PREFIX = 'text-';
const ANIMATE_PREFIX = 'animate-';

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

export default {
    "dynamic-style-2": {
        /**
         *
         * @param svgTemplate
         * @returns {*|jQuery|HTMLElement}
         *
         * param:
         *  <section class="synamic-style">
         *      <svg></svg>
         *  </section>
         *
         *  returns:
         *  <section class="synamic-style synamic-style-editor" data-type="dynamic-style-2">
         *      <section></section>
         *  </section>
         *
         */
        toEditorHtml: function (svgTemplate) {
            let $svgTemplate = $(svgTemplate);
            let $svgs = $svgTemplate.children('svg');
            /* kelly */
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
                /* kelly */
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

        /**
         *
         * @param sectionTemplate
         * @returns {*|jQuery|HTMLElement}
         *
         *  param:
         *  <section class="synamic-style synamic-style-editor" data-type="dynamic-style-2">
         *      <section></section>
         *  </section>
         *
         * returns:
         * <section class="synamic-style">
         *      <svg></svg>
         *  </section>
         *
         *
         */
        toSvg: function (sectionTemplate) {
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
                    let originColor = $p.attr('text-fill');
                    let text = $p.text();

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

        }
    },
    "dynamic-style-3": {
        /**
         *
         * @param svgTemplate
         * @returns {*|jQuery|HTMLElement}
         *
         * param:
         *  <section class="synamic-style">
         *      <svg></svg>
         *  </section>
         *
         *  returns:
         *  <section class="synamic-style synamic-style-editor" data-type="dynamic-style-3">
         *      <section></section>
         *  </section>
         *
         */
        toEditorHtml: function (svgTemplate) {
            let $svgTemplate = $(svgTemplate);
            let $svgs = $svgTemplate.children('svg');
            let $center = $svgTemplate.children('center');
            let $rect = $svgs.children('rect');

            $svgs.css({'display':'none'});
            $center.before($(`<h5 style='color:#ccc;'>覆盖颜色选择：<span style='display: inline-block;width:10px;height:10px;border-radius:50%;background-color:${ $rect.attr('fill') }'></span></h5>`));
            $svgTemplate.addClass("synamic-style-editor");

            return $svgTemplate;
        },

        /**
         *
         * @param sectionTemplate
         * @returns {*|jQuery|HTMLElement}
         *
         *  param:
         *  <section class="synamic-style synamic-style-editor" data-type="dynamic-style-3">
         *      <section></section>
         *  </section>
         *
         * returns:
         * <section class="synamic-style">
         *      <svg></svg>
         *  </section>
         *
         *
         */
        toSvg: function (sectionTemplate) {
            let $sectionTemplate = $(sectionTemplate);
            let $svgs = $sectionTemplate.children('svg');
            let $h5 = $sectionTemplate.children('h5');
            let $span = $h5.children('span');

            let $rects = $svgs.find('rect');
            [].forEach.call($rects, function (rect) {
                let $rect = $(rect);
                $rect.attr("fill",$span.css("backgroundColor"));
            })

            $svgs.css({'display':'inline-block'});
            $h5.remove();
            return $sectionTemplate;
        }
    },
}