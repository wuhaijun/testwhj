import React, { PropTypes, Component } from 'react';

import  { ProgressBar }  from 'react-components';
import Layout from './Layout.jsx';
import DP from './DP.jsx';

export default class ProgressBarDemo extends Component {

    render() {
        let steps = ["step1", "step2", "step3", "step4"];
        return (
            <Layout title="流程进度条">
                <DP title="1. 默认流程进度条:">
                    <ProgressBar steps={ steps } current={ 3 } />
                </DP>

                <DP title="2. 指定每一步的长度:">
                    <ProgressBar stepWidth="100px" steps={ steps } current={ 2 } />
                </DP>
            </Layout>
        );
    }
}