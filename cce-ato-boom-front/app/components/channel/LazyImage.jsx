'use strict';
import React, { Component, PropTypes} from 'react';
import FileUrlUtil from '../../../common/FileUrlUtil';

export default class LazyImage extends Component {

    componentDidMount() {
        //@TODO 解决懒加载图片在详情页失效问题，先这么干吧。
        let img = $(this.refs.coverImg);
        let options = {
            error: () => {
                img.attr('src', this.props.url.defaultUrl)
            }
        };
        let scrollable = img.closest('.scrollable');
        if(scrollable.length) {
            options.container = scrollable;
        }
        img.lazyload(options);
    }

    render() {
        const {url, width, height} = this.props;

        let style = {};
        width && (style['width'] = width + 'px');
        height && (style['height'] = height + 'px');

        return (
            <img ref='coverImg'
                 src='http://boom.static.cceato.com/1px.gif?imageMogr2/thumbnail/22x15!'
                 data-original={ url.url }
                 className="card-img-top img-responsive"
                 style={style}/>
        );
    }
}

LazyImage.propTypes = {
    url: PropTypes.object.isRequired
};