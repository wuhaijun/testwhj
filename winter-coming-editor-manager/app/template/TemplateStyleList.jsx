'use strict';

import React from 'react';

export default class extends React.Component {

    
    render () {
        let styles = this.props.styles;
        let comps = styles.map(style => {
            return (
                <div className={ "row styles " + (style._id ? '': 'none-border') } key={ style._id }>
                    <div className="col-md-10">
                        <div className="style-html" onDoubleClick={ this.props.onAddStyle(style) }  dangerouslySetInnerHTML={{ __html: style.html }} ></div>
                    </div>
                    
                </div>
            );
        });

        return (
            <div className="style-list col-md-5">
                { comps }
            </div>
        );
    }
}