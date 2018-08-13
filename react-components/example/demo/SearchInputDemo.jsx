import React, { PropTypes, Component } from 'react';

import  { SearchInput }  from 'react-components';
import Layout from './Layout.jsx';
import DP from './DP.jsx';

export default class SearchInputDemo extends Component {

    render() {
        return (
            <Layout title="搜索框">
                <DP title="1. 普通搜索框:">
                    <SearchInput onSearch={ keyword => { alert(keyword) } } />
                </DP>

                <DP title="2. 可以监听onChange事件:">
                    <SearchInput placeholder="可以监听onChange事件"
                                 onSearch={ keyword => { alert(keyword) } }
                                 onChange={ keyword => { document.getElementById("msg").innerHTML = keyword; } } />
                </DP>
                <div id="msg" style={{ height: '30px',lineHeight:'30px',padding:'4px 22px' }}></div>
            </Layout>
        );
    }
}