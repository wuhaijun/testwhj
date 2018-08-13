'use strict';

import React from 'react';
import TemplateModal from './TemplateModal.jsx';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clickStyleId:'' ,
            currentIndex:0
        };
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown);
    }
    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    clickStyle = (style,index) => {
        return () => {
            this.setState({ clickStyleId: style._id});
            this.setState({ currentIndex: index});
        }
    };

    /**
     * 数组交换位置
     * @param arr
     * @param index1
     * @param index2
     * @returns {*}
     */
    swapItems = (arr, index1, index2) => {
        arr[index1] = arr.splice(index2, 1, arr[index1])[0];
        return arr;
    };

    /***
     * 监听按压事件
     * @param event
     */
    handleKeyDown = (event) => {
        if(event.keyCode == 38){
            this.keyUpMove();
        }
        if(event.keyCode == 40){
            this.keyDownMove();
        }
    };


    /***
     * 按压向上移动键盘按钮
     */
    keyUpMove = () => {
        if(this.state.currentIndex == 0) {
            return;
        }
        let newArrUp = this.swapItems(this.props.currents, this.state.currentIndex, this.state.currentIndex - 1);
        this.setState({ currents: newArrUp });
        this.setState({ currentIndex: this.state.currentIndex-1});
    };

    /***
     * 按压向下移动键盘按钮
     */
    keyDownMove = () => {
        if(this.state.currentIndex == this.props.currents.length -1) {
            return;
        }
        let newArrDown = this.swapItems(this.props.currents, this.state.currentIndex, this.state.currentIndex + 1);
        this.setState({ currents: newArrDown });
        this.setState({ currentIndex: this.state.currentIndex+1});
    };

   
    render () {
        let { types, currents ,templateTypes } = this.props;
        let styles = currents.map((style,index) =>{
           return (
                <div className={'template-style ' + (style._id == this.state.clickStyleId ? 'active':'') }  key={ style._id }  onClick={ this.clickStyle(style,index) }   onDoubleClick={ this.props.onRemoveStyle(style) }>
                    <div dangerouslySetInnerHTML={{ __html: style.html }} ></div>
                </div>  
            )
        } );
        return (
            <div className="style-editor col-md-5">
                <div className="row editor">
                    <div id="editor_style" className="col-md-12">
                        {styles}
                    </div>
                </div>
                <div className="row saver">
                    <div className="col-md-12">
                        <div>
                            <a href="javascript:;" data-toggle="modal" data-target="#previewModal">
                                <i className="fa fa-check-circle-o fa-4x"/>
                            </a>
                            <TemplateModal
                                   currents={ currents }
                                   templateTypes={templateTypes}
                                   types={ types }
                                   onClear={ this.props.onClear }
                                   />

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}