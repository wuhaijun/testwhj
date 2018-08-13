'use strict';

import React from 'react';
import ArticleList from './ArticleList.jsx';


export default class extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            articleList: [],
            pagination: {}
        };
    }

    componentDidMount() {
        $.get('/article/list', json => {
            this.setState({ articleList: json.list, pagination: json.pagination});
        });
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                        <h3 className="article-total">   总共有 { this.state.pagination.count } 篇文章</h3>
                        <ArticleList articleList={this.state.articleList}/>
                </div>
            </div>
        );
    }
}