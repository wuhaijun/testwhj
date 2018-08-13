'use strict';

import React, { PropTypes, Component } from 'react';
import './progress-bar.css';

export default class ProgressBar extends Component {
    render () {
        const { steps, current } = this.props;

        let className = i => (i < current) ? 'passed': (i === current) ? 'active' : '';
        let stepsComps = [];
        steps.forEach((step, index) => {
            stepsComps.push (
                <li className={ className(index + 1) }>
                    <div>
                        <i>{ index + 1 }</i>
                        <p>{ step }</p>
                    </div>
                    {
                        (index != steps.length - 1 ) && <i />
                    }
                </li>
            );
        });

        return (
            <div className="progress-bar-container">
                {
                    stepsComps && stepsComps.length != 0 &&
                    <ul>
                        { stepsComps }
                    </ul>
                }
            </div>
        );
    }
}

ProgressBar.propTypes = {
    steps: PropTypes.array.isRequired,
    current: PropTypes.number.isRequired
};
