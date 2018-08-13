'use strict';

import React from 'react';
import LazyLoad from 'react-lazy-load';

export default class StyleList extends React.Component {

    render() {
        let length = this.props.length;
        let styles = this.props.styles;
        let i = 0;
        let comps = styles.map(style => {
            return (
                <div className={"row styles " + (style._id ? '' : 'none-border')} key={style._id}>
                    <LazyLoad>
                        <div>
                            <div className="col-md-10">
                                <div className="style-html" onDoubleClick={this.props.onDoubleClickStyle(style)} dangerouslySetInnerHTML={{ __html: style.html }} ></div>
                            </div>
                            {
                                style._id &&
                                <div className="col-md-2 operator">
                                    {
                                        style.status != -1 &&
                                        <a href="javascript:;" onClick={this.props.onDoubleClickStyle(style)}>
                                            <i className="fa fa-pencil-square-o fa-1x" />
                                        </a>
                                    }
                                    {
                                        style.status != -1 &&
                                        <a href="javascript:;"
                                            onClick={this.props.onUpdateStatus({ _id: style._id, status: -1 }, '确定删除该样式?')}>
                                            <i className="fa fa-trash-o fa-1x" />
                                        </a>
                                    }
                                    {
                                        style.status == 0 &&
                                        <a href="javascript:;" onClick={this.props.onUpdateStatus({ _id: style._id, status: 1 }, '确定发布该样式?')}>
                                            <i className="fa fa-cloud-upload fa-1x" />
                                        </a>
                                    }
                                    {
                                        style.status == 1 &&
                                        <a href="javascript:;" onClick={this.props.onUpdateStatus({ _id: style._id, status: 0 }, '确定下架该样式?')}>
                                            <i className="fa fa-level-down fa-1x" />
                                        </a>
                                    }
                                    {
                                        style.status == -1 &&
                                        <a href="javascript:;" onClick={this.props.onUpdateStatus({ _id: style._id, status: 0 }, '确定移出回收站?')}>
                                            <i className="fa fa-undo fa-1x" />
                                        </a>
                                    }
                                    <span>{style.updateTime && new Date(style.updateTime).toLocaleDateString()}</span>
                                </div>
                            }
                        </div>

                    </LazyLoad>

                </div>
            );
        });
        return (
            <div className="style-list col-md-5">
                <div className="row operator">
                    <div className="col-md-12">
                        <div style={{ float: 'left' }}>{length}</div>
                        <a href="javascript:;" onClick={this.props.onClickNew}>
                            <i className="fa fa-plus fa-2x" />
                        </a>
                        <a href="javascript:;" onClick={this.props.onPublishAll}>
                            <i className="fa fa-cloud-upload fa-2x" />
                        </a>
                    </div>
                </div>
                <hr />

                {comps}
            </div>
        );
    }
}