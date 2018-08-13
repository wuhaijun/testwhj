'use strict';

import React from 'react';

export default class RowLogo extends React.Component {

    render() {
        return (
            <div className="row logo">
                <div className="col-sm-3">
                    <img src="http://boom-static.static.cceato.com/boom/imgs/login-logo-2.gif"/>
                    <br/>
                    <img src="http://boom-static.static.cceato.com/boom/imgs/login-title.png" width="100"/>
                </div>
            </div>
        );
    }
};