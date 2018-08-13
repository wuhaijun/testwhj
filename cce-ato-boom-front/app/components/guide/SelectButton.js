import React, { Component, PropTypes } from 'react';

class SelectButton extends Component {

    handleJobSelected = job => {
        return () => {
            this.props.handleSelectedJob(job);
        };
    };

    render() {
        const { selected, job } = this.props;
        let classValue = selected ? 'btn guide-btn-selected' : 'btn guide-btn';
        return (
            <a className={ classValue } onClick={ this.handleJobSelected(job) } >{ job.name }</a>
        );
    }
}

SelectButton.PropTypes = {
    job: PropTypes.object
};

export default SelectButton;