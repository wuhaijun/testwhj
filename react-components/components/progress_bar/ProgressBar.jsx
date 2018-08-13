'use strict';

import React, { PropTypes, Component } from 'react';
import './progress-bar.less';

export default class ProgressBar extends Component {

    componentDidMount() {
        let { stepWidth, initColor, passedColor } = this.props;
        let $this = $(this.refs._this_);
        if (stepWidth) {
            $this.find('ul > li > i').css('width', stepWidth);
        }
    }

    render () {
        const { steps, current } = this.props;

        let className = i => (i < current) ? 'passed': (i === current) ? 'active' : '';
        let stepsComps = [];
        steps.forEach((step, index) => {
            stepsComps.push (
                <li className={ className(index + 1) } key={ step }>
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
            <div ref="_this_" className="progress-bar-container">
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
    stepWidth: PropTypes.string,
    passedColor: PropTypes.string,
    initColor: PropTypes.string,
    current: PropTypes.number.isRequired
};
