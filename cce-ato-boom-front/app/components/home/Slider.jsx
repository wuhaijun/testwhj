'use strict';
import React, { Component, PropTypes } from 'react';
import { withRouter, browserHistory, Link } from 'react-router';
import { Slider as _Slider_, Sliders } from 'react-components-cce';

export default class Slider extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let { sliders } = this.props;
        const SliderComps = sliders.map((slider,index) => {
            return(
                <_Slider_ key={ index } image= { slider.cover }
                                        onClick={ () => { browserHistory.push ('/home/slider/' + slider.pid )} }>
                    <div >
                        <Link to={ "/home/slider/" + slider.pid }>
                            <h3 >
                                { slider.title }
                            </h3>
                        </Link>
                        <div >
                            { slider.desc }
                        </div>
                    </div>
                </_Slider_>
            );
        });

        return (
            <div className="row home-slider">
                {
                    sliders && sliders.length  != 0 &&
                    <Sliders slider={{arrows:{}}} id="slider_1">
                        { SliderComps }
                    </Sliders>
                }
            </div>
        )
    }
}

Slider.propTypes = {
    sliders: PropTypes.array
};