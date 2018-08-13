'use strict';

import React from 'react';
import StyleNav from './StyleNav.jsx';
import StyleList from './StyleList.jsx';
import StyleEditor from './StyleEditor.jsx';


export default class extends React.Component {

    constructor(props) {
        super(props);
        this.state = { styles: [], types: [], current: this.__initCurrent__(), currents: [] };
    }

    componentDidMount() {
        $.get('/api/types', json => {
            this.setState({ types: json.result });
        });

        $.get('/api/styles', json => {
            this.setState({ styles: json.result });
        });
    }

    handleClickType = type => {
        $.get('/api/style/type/' + type, json => {
            this.setState({ styles: json.result });
        });
        $(".style-list").scrollTop(0);
    };

    handleClickStatus = status => {
        $.get('/api/style/status/' + status, json => {
            this.setState({ styles: json.result });
        });
    };

    handlePublishAll = () => {
        if (window.confirm('确定发布所有未发布的样式?')) {
            $.post('/api/style/publishAll', json => {
                if (json.status) {
                    window.location.href = '/';
                }
            });
        }
    };

    handleUpdateStatus = (style, message) => {
        return () => {
            if (!message || window.confirm(message)) {
                if (!style._id && style.status == -1) {
                    this.__deleteNewStyle__();
                } else {
                    $.post('/api/style/update/' + style._id, { status: style.status }, json => {
                        if (json.status) {
                            this.__deleteStyle__(style._id);
                        }
                    });
                }
            }
        };
    };

    handleDoubleClickStyle = style => {
        let current = this.state.current;
        let currents = this.state.currents;
        return () => {
            if (!style._id || style.status == -1) return;
            let active = $('.active-template.template_box');
            currents.push(style);
            this.setState({ current: style, currents: currents });
        };
    };

    handleSave = () => {
        let current = this.state.current;
        if (!current || !current.html || !current.html.trim()) return;

        let _id = current._id;
        let url = _id ? '/api/style/update/' + _id : '/api/style/add';

        $.post(url, current, json => {
            if (json.status) {
                if (!_id) {
                    this.__deleteNewStyle__();
                    this.setState({ styles: [json.style, ...this.state.styles] })
                } else {
                    this.setState({ current: this.__initCurrent__() });
                }
            }
        });
    };

    handleChange = value => {
        // remove added new current
        if (!value && !this.state.current._id) {
            this.__deleteNewStyle__();

        } else {
            // add a new current
            let index = this.state.styles.findIndex(style => !style._id);
            if (!this.state.current._id && index == -1) {
                this.__addNewStyle__(value);
            }
            // update current
            else {
                this.setState({ current: Object.assign(this.state.current, { html: value }) });
            }
        }
    };

    handleChooseType = (type) => {
        this.setState({ current: Object.assign(this.state.current, { types: [type] }) });
    };

    handleClickNew = () => {
        let index = this.state.styles.findIndex(style => !style._id);
        if (index == -1) {
            this.__addNewStyle__();
        }
    };

    __addNewStyle__ = content => {
        let current = this.__initCurrent__(content);
        this.setState({ current: current });
        this.setState({ styles: [current, ...this.state.styles] });
    };

    __deleteNewStyle__ = () => {
        let index = this.state.styles.findIndex(style => !style._id);
        if (index != -1) {
            let styles = [...this.state.styles];
            styles.splice(index, 1);
            this.setState({ styles: styles, current: this.__initCurrent__() });
        }
    };

    __deleteStyle__ = _id => {
        let index = this.state.styles.findIndex(style => style._id == _id);
        if (index != -1) {
            let styles = [...this.state.styles];
            styles.splice(index, 1);
            this.setState({ styles: styles });
        }
    };

    __initCurrent__ = html => {
        return { types: [], html: html || '' };
    };

    removeStyle = i => {
        this.state.currents.splice(i, 1);
        let currents = this.state.currents;
        this.setState({ currents })
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <StyleNav types={this.state.types}
                        onClickStatus={this.handleClickStatus}
                        onClickType={this.handleClickType} />

                    <StyleList styles={this.state.styles}
                               onDoubleClickStyle={this.handleDoubleClickStyle}
                               onUpdateStatus={this.handleUpdateStatus}
                               onPublishAll={this.handlePublishAll}
                               onClickNew={this.handleClickNew}
                               length={this.state.styles.length} />

                    <StyleEditor current={this.state.current}
                                 removeStyle={this.removeStyle}
                                 types={this.state.types}
                                 currents={this.state.currents}
                                 onSave={this.handleSave}
                                 onChange={this.handleChange}
                                 onChooseType={this.handleChooseType} />
                </div>
            </div>
        );
    }
}