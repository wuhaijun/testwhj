'use strict';

import React from 'react';

export default class StyleNav extends React.Component {

    handleClickType = _id => {
        return () => {
            this.props.onClickType(_id);
        };
    };

    handleClickStatus = status => {
        return () => {
            this.props.onClickStatus(status);
        };
    };

    render () {
        let comps = this.props.types.map(nv => {
            return (
                <li key={ nv.name }>
                    <a href="javascript:;" onClick={ this.handleClickType(nv.name) }>
                        <span>{ nv.name }</span>
                    </a>
                    {
                        nv.children &&
                        <ul className="sub-menu">
                            {
                                nv.children.map(c => {
                                    return (
                                        <li key={ c }>
                                            <a href="javascript:;" onClick={ this.handleClickType(c) }>
                                                <span>{ c }</span>
                                            </a>
                                        </li>
                                    );
                                })
                            }
                        </ul>
                    }
                </li>
            );
        });

        return (
            <div className="style-type col-md-1">
                <nav role="navigation">
                    <ul className="nav">
                        <li>
                            <a href="javascript:;" onClick={ this.handleClickType() }>
                                <i className="fa fa-database fa-1x"/>
                                <span>全部</span>
                            </a>
                        </li>
                        <li>
                            <a href="javascript:;" onClick={ this.handleClickStatus(1) }>
                                <i className="fa fa-cloud-upload fa-1x"/>
                                <span>已发布</span>
                            </a>
                        </li>
                        <li>
                            <a href="javascript:;" onClick={ this.handleClickStatus(0) }>
                                <i className="fa fa-pencil-square-o fa-1x"/>
                                <span>未发布</span>
                            </a>
                        </li>
                        <li>
                            <a href="javascript:;" onClick={ this.handleClickStatus(-1) }>
                                <i className="fa fa-trash-o fa-1x"/>
                                <span>回收站</span>
                            </a>
                        </li>
                        { comps }
                    </ul>
                </nav>
            </div>
        );
    }
}