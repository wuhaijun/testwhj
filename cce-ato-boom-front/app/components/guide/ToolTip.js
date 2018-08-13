import React, { Component } from 'react';
import { handleStep } from '../../actions/guide.js';
import { connect } from 'react-redux';

class ToolTip extends Component {

    constructor(props) {
        super(props);

        this.allStyle = {
            position: 'fixed',
            left: '203px',
            top: '300px',
            width: '406px',
            padding: '35px',
            fontSize: '14px',
            backgroundColor: 'white',
            boxShadow: '1px 1px 5px #696969'
        }

        this.state = {
            parentStyle: this.allStyle
        }

        this.onCloseBtnClick = this.onCloseBtnClick.bind(this);
    }


    onCloseBtnClick() {
        const hide = {
            display: 'none'
        }
        this.props.onStep(4);
        this.setState({ parentStyle: hide });
    }


    render() {
        return (
            <div style={this.state.parentStyle}>
                <div className="tool-tip-header">
                    <img className="guide-img tool-tip-img" src="/static/icons/提示.png" />
                    <button onClick={this.onCloseBtnClick} type="button" className="btn btn-link tool-tip-close-btn"><i className="fa fa-times" aria-hidden="true"></i></button>

                </div>
                <p style={{ marginBottom: '30px' }}>点击<strong>“我的订阅”</strong>可以看到所有订阅账号的最新文章。</p>
                <p>展开<strong>“我的订阅”</strong>，点击<strong>“编辑分类”</strong>，可以修改分组名称。拖动账号，还可以移动分组。</p>

            </div>
        );
    }
}


const mapDispatchToProps = {
    onStep: handleStep
};

export default connect(
    null,
    mapDispatchToProps
)(ToolTip);