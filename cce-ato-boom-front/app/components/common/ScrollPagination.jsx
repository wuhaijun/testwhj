'use strict';
import React, {Component, PropTypes} from 'react';
import $ from 'jquery';

export default class ScrollPagination extends Component {

    constructor(props) {
        super(props);
        this.state = {page: 0}
    }

    nextPage() {
        this.props.onNextPage(this.state.page + 1);
        this.setState({page: this.state.page + 1});
    }

    componentDidMount() {
        let collectionDiv = $(this.refs.pagination);
        let $w = $(window);
        this.$w = $w;
        $w.scroll(() => {
            let hasNext = this.props.hasNext();
            let needNext = (collectionDiv.offset().top + collectionDiv.height()) < ($w.scrollTop() + $w.height());
            if (needNext && hasNext) {
                this.nextPage();
            }
        });
        //this.nextPage();
    }

    componentWillUnmount() {
        this.$w.unbind('scroll');
    }

    render() {
        return (
            <div ref='pagination'>
                { this.props.children }
                {
                    this.props.hasNext() &&
                    <a className="btn btn-default btn-lg btn-block" onClick={this.nextPage.bind(this)}>
                        <i className="icon-control-play"></i>&nbsp;<span>加载更多</span>
                    </a>
                }
            </div>
        );

    }
}

ScrollPagination.propTypes = {
    onNextPage: PropTypes.func.isRequired,
    hasNext: PropTypes.func.isRequired
};