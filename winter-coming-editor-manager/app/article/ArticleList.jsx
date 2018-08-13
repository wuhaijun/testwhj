'use strict';

import React from 'react';
import ArticleModal from './ArticleModal.jsx';
import LazyLoad from 'react-lazy-load';


export default class ArticleList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            content: ''
        };
    }

    getArticleHtml = (id) => {
        return () => {
            $.get('/article/details/'+id, json => {
                 this.setState({ content: json.content });
            });
        }
    };

    render() {
        let comps = this.props.articleList.map((list,index) => {
                return(
                    <div key={ list._id }>
                        <LazyLoad>
                            <li key={ list._id } onClick={this.getArticleHtml( list._id )}>
                                <a href="javascript:;" data-toggle="modal" data-target="#previewModal">
                                    <div><img src={ list.cover } alt=""/></div>
                                    <div>id: { list._id }</div>
                                    <div>account: { list.account }</div>
                                    <div>作者: { list.author } </div>
                                    <div>文章标题: { list.title } </div>
                                    <div>文章简介: { list.digest } </div>
                                    <div>这是第 { index+1 } 篇文章</div>
                                    <div>时间: { list.dateCreated && new Date(list.dateCreated).toLocaleDateString() }</div>
                                </a>
                                <ArticleModal
                                    content={ this.state.content }
                                />

                            </li>
                        </LazyLoad>
                    </div>
                )
        });

        return (
            <div className="container-fluid">
                <div className="row col-md-12">
                    <ul className="article-list">
                        { comps }
                    </ul>

                </div>
            </div>
        );
    }
}