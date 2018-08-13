import React, { Component, PropTypes } from 'react';

class ImgButton extends Component {

    handleSelectedInterest = interest => {
        return () => {
            this.props.handleSelectedInterest(interest);
        };
    };

    render() {
        const { img, interest, selected } = this.props;
        let classValue = selected ? "btn guide-img-btn-selected" : "btn guide-img-btn";
        return (
            <div className="guide-interest-container">
                <a className={classValue} href="#" role="button" onClick={ this.handleSelectedInterest(interest) }>
                    <img className="guide-img" src={ `/static/icons/${ interest.name }.png` } />
                    <label>{ interest.name }</label>
                </a>
            </div>
        );
    }
}

export default ImgButton;

ImgButton.PropTypes = {
    interest: PropTypes.object,
    img: PropTypes.string
}