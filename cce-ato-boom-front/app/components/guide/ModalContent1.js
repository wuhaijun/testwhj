import React, { Component } from 'react';
import { guideList, handleStep } from '../../actions/guide.js';
import { connect } from 'react-redux';
import SelectButton from './SelectButton.js';
import ImgButton from './ImgButton';

class ModalContent1 extends Component {

    componentDidMount() {
        this.props.onGuideList();
    }

    goNext = () => {
        this.props.onStep(1);
    };

    hasSelected = () => {
        return this.props.selectedJob._id && this.props.selectedInterests.length != 0;
    };

    isSelectedJob = job => {
        return this.props.selectedJob._id == job._id;
    };

    isSelectedInterest = interest => {
        return this.props.selectedInterests.findIndex(it => it._id == interest._id) != -1;
    };

    render() {
        const { options } = this.props;

        let submitBtn = <button onClick={this.goNext} type="button" className="btn btn-primary guide-option-btn">继续</button>;
        if (!this.hasSelected())
            submitBtn = <button onClick={this.goNext} disabled type="button" className="btn btn-primary guide-option-btn">继续</button>;

        return (
            <div>
                <h1 className="guide-title">选择你感兴趣的领域，脑洞会为你精选账号，开始订阅吧！</h1>
                <div className="guide-body">
                    <div className="guide-item">
                        <label className="col-sm-2 control-label guide-label">选择你所从事的职业</label>
                        <div className="col-sm-10" style={{ top: '-5px' }}>
                            {options.groups.map(item => {
                                return <SelectButton key={item._id} job={item} selected={this.isSelectedJob(item)} handleSelectedJob={this.props.onSelectedJob} />
                            })}
                        </div>
                    </div>
                    <div className="guide-item">
                        <label className="col-sm-2 control-label guide-label">选择你感兴趣的内容</label>
                        <div className="col-sm-12">
                            {options.categories.map(item => {
                                return <ImgButton key={item._id} interest={item} selected={this.isSelectedInterest(item)} handleSelectedInterest={this.props.onSelectedInterest} />
                            })}
                        </div>
                    </div>
                </div>
                <div className="guide-option">
                    {submitBtn}
                </div>
            </div>
        );
    }
}

const mapState = (state, ownProps) => ({
    options: state.guide.options
});

const mapDispatch = {
    onGuideList: guideList,
    onStep: handleStep
};

export default connect(mapState, mapDispatch)(ModalContent1);