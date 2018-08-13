import React, { Component } from 'react';
import { connect } from 'react-redux';
import ModalContent1 from './ModalContent1.js';
import ModalContent2 from './ModalContent2.js';
import { stepReset, handleStep, accountList, save } from '../../actions/guide.js';

class Modal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedJob: {},
            selectedInterests: [],
            selectedFeeds: []
        };
    }

    componentDidMount() {
        if (this.props.show) {
            let myModal = $(this.refs.myModal);
            myModal.modal({ backdrop: 'static', keyboard: false });
        }
    }

    handleSelectedJob = job => {
        this.handleSelectedInterests(job.categories);
        this.setState({ selectedJob: job });
    };

    handleSelectedInterest = interest => {
        let index = this.state.selectedInterests.findIndex(it => it._id == interest._id);
        if (index == -1) {
            this.setState({ selectedInterests: [interest, ...this.state.selectedInterests] });
        } else {
            let newSelectedInterests = [...this.state.selectedInterests];
            newSelectedInterests.splice(index, 1);
            this.setState({ selectedInterests: newSelectedInterests });
        }
    };

    handleSelectedInterests = (interests = []) => {
        this.setState({ selectedInterests: interests });
    };

    handleSelectedFeed = feed => {
        let index = this.state.selectedFeeds.findIndex(it => it._id == feed._id);
        if (index == -1) {
            this.setState({ selectedFeeds: [feed, ...this.state.selectedFeeds] });
        } else {
            let newSelectedFeeds = [...this.state.selectedFeeds];
            newSelectedFeeds.splice(index, 1);
            this.setState({ selectedFeeds: newSelectedFeeds });
        }
    };

    handleSubmit = isSkip => {
        const { selectedJob, selectedInterests, selectedFeeds } = this.state;
        if (isSkip) {
            this.props.save(selectedJob._id, selectedInterests.map(it => it._id));
        } else {
            this.props.save(selectedJob._id, selectedInterests.map(it => it._id), selectedFeeds.map(it => { return { _id: it._id, name: it.name, type: it.type } }));
        }

        let myModal = $(this.refs.myModal);
        myModal.modal('hide');
    };

    render() {
        let step = this.props.step;
        let show = this.props.show;
        return (
            <div>
                {
                    show ? <div ref="myModal" className="modal fade bd-example-modal-lg" tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-lg guide-modal">
                            <div className="modal-content guide-content">
                                {
                                    step == 0 ?
                                        <ModalContent1
                                            selectedJob={this.state.selectedJob}
                                            selectedInterests={this.state.selectedInterests}
                                            onSelectedJob={this.handleSelectedJob}
                                            onSelectedInterest={this.handleSelectedInterest} /> :

                                        <ModalContent2
                                            selectedInterests={this.state.selectedInterests}
                                            selectedFeeds={this.state.selectedFeeds}
                                            onSubmit={this.handleSubmit}
                                            onSelectedFeed={this.handleSelectedFeed} />
                                }
                            </div>
                        </div>
                    </div> : null
                }
            </div>
        );
    }
}

const mapState = (state, ownProps) => ({
    step: state.guide.step,
    account: state.account
});

const mapDispatch = {
    save: save
};

export default connect(mapState, mapDispatch)(Modal)