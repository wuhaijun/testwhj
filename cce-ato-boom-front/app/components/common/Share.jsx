import React, { Component } from 'react';
import { connect } from 'react-redux';
import { savePreviewPage } from '../../actions/common.js';
import { browserHistory } from 'react-router';
import * as projectTypes from '../../constants/ProjectTypes';


class Share extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let desc = (this.props.project.desc ? this.props.project.desc.slice(0, 40).replace(/\r/, '').replace(/\n/, '').replace(/\r\n/, '').replace(/\r\n\r\n/, '').replace("\"", '') + '...' : "");
        let pic = this.props.project.coverImg ? this.props.project.coverImg.fileName : '';
        let location = document.location;
        let url = location.origin + '/preview?projectId=' + location.pathname.split('/').slice(-1) + "&originUrl=" + encodeURIComponent(location.href);
        let jiaThisConfig = `var jiathis_config={
            url:"${url}",
            summary:"${desc}",
            title:"${this.supplyTitle()}",
            pic:"http://boom.static.cceato.com/${pic}"
        }`;
        if (!document.getElementById('jiathis-config')) {
            let scriptConfig = document.createElement('script');
            scriptConfig.setAttribute('id', 'jiathis-config');
            scriptConfig.text = jiaThisConfig;
            document.getElementsByTagName("head")[0].appendChild(scriptConfig);
        }
        if (!document.getElementById("jiathis")) {
            let scriptFile = document.createElement('script');
            scriptFile.setAttribute("id", "jiathis");
            scriptFile.setAttribute("src", 'http://v3.jiathis.com/code/jia.js');
            document.getElementsByTagName("head")[0].appendChild(scriptFile);
        }
    }


    supplyTitle = () => {
        const { project } = this.props;
        switch (project.type) {
            case projectTypes.INSTAGRAM:
            case projectTypes.TWITTER:
            case projectTypes.FACEBOOK:
                return project.origin && project.origin.name + ' # ' + project.desc;
        }
        return project.title;
    }

    componentWillUnmount() {
        if ($('#jiathis-config')) $('#jiathis-config').remove();
        if ($("#jiathis")) $('#jiathis').remove();

        _.each($('.jiathis_style'), item => {
            if (item) item.remove();
        });
        _.each($("link[href*='jiathis']"), item => {
            if (item) item.remove();
        });
        _.each($('iframe'), item => {
            if (item) item.remove();
        })

    }

    saveHtml = () => {
        return () => {
            let url = browserHistory.getCurrentLocation().pathname;
            let html = $('html').html();
            // this.props.savePreviewPage(url, html);
        }
    }

    render() {
        return (
            <div className="jiathis_style"><span className="jiathis_txt">分享到：</span>
                <a className="jiathis_button_weixin"></a>
                <a className="jiathis_button_tsina"></a>
                <a className="jiathis_button_cqq"></a>
                <a className="jiathis_button_qzone"></a>
                <a className="jiathis_button_douban"></a>
            </div>
        );
    }
}

const mapState = state => ({
    previewPageStatus: state.preview
});

const mapDispatch = ({
    savePreviewPage: savePreviewPage,
});

export default connect(mapState, mapDispatch)(Share);       