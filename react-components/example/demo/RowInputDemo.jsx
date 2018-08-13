import React, { PropTypes, Component } from 'react';

import  { RowInput }  from 'react-components';
import Layout from './Layout.jsx';
import { escape, translate } from 'html-escape-translate';

export default class RowInputDemo extends Component {
    render() {
        return (
            <Layout title="输入框">
                <p>
                    <span>1. 默认输入框:</span>
                    <div className="bs-example" data-example-id="simple-pre">
                        <RowInput name="n1" />
                        <pre> { '<RowInput name="n1" />' } </pre>
                    </div>
                </p>

                <p>
                    <span>2. 设置输入框的ref属性。通过this.props.refs获取输入框的值:</span>
                    <div className="bs-example" data-example-id="simple-pre">
                        <RowInput name="n2" ref="n2" placeholder="设置输入框的ref属性" />
                        <button type="button" onClick={ ()=> { alert(this.refs.n2.val) } }>获取值</button>
                        <pre>
                            { '<RowInput name="n2" ref="n2" placeholder="设置输入框的ref属性" />' }
                            <br />
                            { '<button type="button" onClick=\{ ()=> { alert(this.refs.n2.val) } \}>获取值</button>' }
                        </pre>
                    </div>
                </p>

                <p>
                    <span>
                        3. 添加label, 并设置labelClassName和inputClassName, 默认为bootstrap的预定义类:<br/>
                        labelClassName: "col-xs-3 col-sm-3 col-md-2 col-lg-1"<br />
                        inputClassName: "col-xs-8 col-sm-8 col-md-6 col-lg-4"<br />
                        可以添加labelClassName和inputClassName覆盖默认类的同名属性值。
                    </span>
                    <div className="bs-example" data-example-id="simple-pre">
                        <RowInput name="n3" label="姓名:" inputClassName="col-sm-6" />
                        <pre>
                            { '<RowInput name="n3" label="姓名:" inputClassName="col-sm-6" />' }
                        </pre>
                    </div>
                </p>

                <p>
                    <span>4. isRequired 必填字段</span>
                    <div className="bs-example" data-example-id="simple-pre">
                        <RowInput name="n4" isRequired placeholder="必填字段"/>
                        <pre>
                            { '<RowInput name="n4" isRequired placeholder="必填字段"/>' }
                        </pre>
                    </div>
                </p>
                <p>
                    <span>5. isRequired 必填字段, 并且格式必须是email</span>
                    <div className="bs-example" data-example-id="simple-pre">
                        <RowInput name="n5" isRequired isEmail placeholder="必填字段, 并且格式必须是email"/>
                        <pre>
                            { '<RowInput name="n5" isRequired isEmail placeholder="必填字段, 并且格式必须是email"/>' }
                        </pre>
                    </div>
                </p>
                <p>
                    <span>6. 非必填字段, 但是如果有值,格式必须是password</span>
                    <div className="bs-example" data-example-id="simple-pre">
                        <RowInput name="n6" type="password" isPassword />
                        <pre>
                            { '<RowInput name="n6" type="password" isPassword />' }
                        </pre>
                    </div>
                </p>
                <p>
                    <span>7. 字段值必须equals指定的值</span>
                    <div className="bs-example" data-example-id="simple-pre">
                        <RowInput name="n7" isEquals="1234" validateMsg="值必须等于1234" />
                        <pre>
                            { '<RowInput name="n7" isEquals="1234" validateMsg="值必须等于1234" />' }
                        </pre>
                    </div>
                </p>
                <p>
                    <span>8. 自定义验证错误的消息</span>
                    <div className="bs-example" data-example-id="simple-pre">
                        <RowInput name="n8" isRequired isUrl validateMsg="这并不是一个url" />
                        <pre>
                            { '<RowInput name="n8" isRequired isUrl validateMsg="这并不是一个url" />' }
                        </pre>
                    </div>
                </p>
                <p>
                    <span>9. 自定义验证正则表达式</span>
                    <div className="bs-example" data-example-id="simple-pre">
                        <RowInput name="n9" isRequired validateRegex="^\d+$" validateMsg="不满足正则表达式'^\d+$'" />
                        <pre>
                            { '<RowInput name="n9" isRequired validateRegex="^\d+$" validateMsg="不满足正则表达式\'^\d+$\'" />' }
                        </pre>
                    </div>
                </p>
                <p>
                    <span>10. 忽略input的onbulr事件执行校验检查</span>
                    <div className="bs-example" data-example-id="simple-pre">
                        <RowInput name="n10" isRequired isEmail ignoreValidate />
                        <pre>
                            { '<RowInput name="n10" isRequired isEmail ignoreValidate />' }
                        </pre>
                    </div>
                </p>
                <p>
                    <span>11. 绑定input的onChange事件,onBlur事件。</span>
                    <div className="bs-example" data-example-id="simple-pre">
                        <RowInput name="n11" isRequired onBlur={ e => { alert(e.target.value) } } onChange={ e => { console.log(e.target.value) } }/>
                        <pre>
                            { '<RowInput name="n11" isRequired onBlur=\{ e => \{ alert(e.target.value) \} \} onChange=\{ e => \{ console.log(e.target.value) \} \}/>' }
                        </pre>
                    </div>
                </p>
            </Layout>
        );
    }
}