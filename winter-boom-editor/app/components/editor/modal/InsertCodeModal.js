'use strict';

import Component from './../../Component';

export default class extends Component {
    constructor(props) {
        super(props);
        this.text = "";
        this.rendered();
    }

    __optimizeCode__ = function ($code) {
        $code.find('span[class^="hljs-"]').each(function () {
            $(this).replaceWith(this.childNodes);
        })
    };

    __setCodeCss__ = function ($pre, style) {
        var css = style == 'dark' ? {
            ".hljs": "display: block; overflow-x: auto; padding: 0.5em; background: #002b36; color: #839496;",
            ".hljs-comment, .hljs-quote ": "color: #586e75;",
            ".hljs-keyword, .hljs-selector-tag, .hljs-addition": "color: #859900;",
            ".hljs-number, .hljs-string, .hljs-meta .hljs-meta-string, .hljs-literal, .hljs-doctag, .hljs-regexp": "color: #2aa198;",
            ".hljs-title, .hljs-section, .hljs-name, .hljs-selector-id, .hljs-selector-class": "color: #268bd2;",
            ".hljs-attribute, .hljs-attr, .hljs-variable, .hljs-template-variable, .hljs-class .hljs-title, .hljs-type": "color: #b58900;",
            ".hljs-symbol, .hljs-bullet, .hljs-subst, .hljs-meta, .hljs-meta .hljs-keyword, .hljs-selector-attr, .hljs-selector-pseudo, .hljs-link": "color: #cb4b16;",
            ".hljs-built_in, .hljs-deletion": "color: #dc322f;",
            ".hljs-formula": "background: #073642;",
            ".hljs-emphasis": "font-style: italic;",
            ".hljs-strong": "font-weight: bold;"
        } : {
                ".hljs": "display:block;overflow-x:auto;padding:0.5em;color:#333;background:#f8f8f8;",
                ".hljs-comment,.hljs-quote": "color:#998;font-style:italic;",
                ".hljs-keyword,.hljs-selector-tag,.hljs-subst": "color:#333;font-weight:bold;",
                ".hljs-number,.hljs-literal,.hljs-variable,.hljs-template-variable,.hljs-tag.hljs-attr": "color:#008080;",
                ".hljs-string,.hljs-doctag": "color:#d14;",
                ".hljs-title,.hljs-section,.hljs-selector-id": "color:#900;font-weight:bold;",
                ".hljs-subst": "font-weight:normal;",
                ".hljs-type,.hljs-class.hljs-title": "color:#458;font-weight:bold;",
                ".hljs-tag,.hljs-name,.hljs-attribute": "color:#000080;font-weight:normal;",
                ".hljs-regexp,.hljs-link": "color:#009926;",
                ".hljs-symbol,.hljs-bullet": "color:#990073;",
                ".hljs-built_in,.hljs-builtin-name": "color:#0086b3;",
                ".hljs-meta": "color:#999;font-weight:bold;",
                ".hljs-deletion": "background:#fdd;",
                ".hljs-addition": "background:#dfd;",
                ".hljs-emphasis": "font-style:italic;",
                ".hljs-strong": "font-weight:bold;"
            };

        for (var key in css) {
            if (css.hasOwnProperty(key)) {
                var value = css[key];
                var keys = key.split(',');
                keys.forEach(function (k) {
                    $pre.find(k).each(function () {
                        this.style.cssText = value;
                    })
                });
            }
        }
    };

    rendered = () => {
        this.__init__();
        this.find('#beginClickSync').on('click', () => {
            let node = $('<section class="winter-section-inner"></section>').html(this.find('#workspace pre code'))[0];
            this.parent.editor.context.invoke('editor.insertNode', node);
        });
    };

    __init__ = () => {
        this.find('#workspace').append(`
        <textarea style="width: 100%;"></textarea>
            预览
        <pre class="winter-section-code"></pre>
        `)

        var $code = $('<code tabindex="0" class="java hljs"></code>');
        $code.html(`<p></p>`);

        // 语言选择下拉列表
        var $languageSelector = $(`
      <section class="language-selector" style="display: inline-block;">
        <select name="language">
          <option value="apache">Apache</option>
          <option value="bash">Bash</option>
          <option value="coffeescript">CoffeeScript</option>
          <option value="cpp">C++</option>
          <option value="cs">C#</option>
          <option value="css">CSS</option>
          <option value="diff">Diff</option>
          <option value="http">HTTP</option>
          <option value="ini">Ini</option>
          <option value="java" selected>Java</option>
          <option value="javascript">JavaScript</option>
          <option value="json">JSON</option>
          <option value="makefile">Makefile</option>
          <option value="markdown">Markdown</option>
          <option value="nginx">Nginx</option>
          <option value="objectivec">Objective-C</option>
          <option value="perl">Perl</option>
          <option value="php">PHP</option>
          <option value="python">Python</option>
          <option value="ruby">Ruby</option>
          <option value="shell">Shell Session</option>
          <option value="sql">SQL</option>
          <option value="xml">HTML, XML</option>
        </select>
      </section>`);

        // 样式选择下拉列表
        var $styleSelector = $(`
      <section class="style-selector" style="display: inline-block;">
        <select name="css">
          <option value="dark" selected>dark</option>
          <option value="light">light</option>
        </select>
      </section>`);

        $languageSelector.find('select').on('change', function () {
            $(this).parents('.winter-section-code').trigger('editor.code.render');
        });

        $styleSelector.find('select').on('change', function () {
            $(this).parents('.winter-section-code').trigger('editor.code.render');
        });

        var $pre = this.find('pre');
        var $this = this;
        $pre.css({
            position: "relative",
            padding: '2px',
            display: "none"
        });
        $pre.append($languageSelector);
        $pre.append($styleSelector);
        $pre.append($code);

        $pre.on('editor.code.render', function () {
            var language = $languageSelector.find('select').val();
            var style = $styleSelector.find('select').val();

            $code.removeClass().addClass(language).addClass('hljs');

            $this.__optimizeCode__($code);
            hljs.highlightBlock($code[0]);
            $this.__setCodeCss__($pre, style);
        });
        $pre.trigger('editor.code.render');

        var $textarea = this.find('textarea');
        $textarea.on('input propertychange', function () {
            $this.text = $(this).val();
            if ($this.text.length > 0) {
                $pre.css("display", "block");
            } else {
                $pre.css("display", "none");
            }
            $this.find('pre code p').html($this.text);
            $this.find('pre').trigger('editor.code.render');
        });
    }

    __clean__ = () => {
        this.find('#workspace').empty();
        this.__init__();
    }

    render() {
        return $(`
            <div>
                <div id="workspace">
                </div>
                <div class="btn-area" style="height:70px">
                        <button id="beginClickSync">确认</button>
                        <button id="cancelClickSync" class="close" data-dismiss="modal" aria-label="Close">取消</button>
                </div>
            </div>
        `);
    }
}
