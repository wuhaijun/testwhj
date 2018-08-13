'use strict';

import React from 'react';

export default class TemplateModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tag:'',
            templateTags: [],
            templateName:'',
            choosedTemplateType: '' ,
            newTemplateType:'',
            templateTypes: this.props.templateTypes
        };
    }

    /***
     * 监听按压事件
     * @param event
     */
    keyDownTags (event)  {
        if(event.keyCode == 13){
             this.addTags(event);
        }
    };


    keyUpAddType (event) {
        if(event.keyCode == 13){
            let typeValue = event.target.value;
            let index = this.props.templateTypes.indexOf(typeValue);
            if(index == -1 && typeValue.trim().length>0){
                this.setState({ templateTypes: [typeValue,...this.state.templateTypes] });
                this.setState({ newTemplateType:'' });
            }
        }
    };


    /**
     * 选择模版分类
     * @param type
     * @returns {Function}
     */
    chooseTemplateType = ( type ) => {
        return () => {
                this.setState({ choosedTemplateType: type });
        }
    };

    /***
     * 添加模版标签
     * @param event
     * @returns {Function}
     */

    addTags = (event) => {
        let tagValue = event.target.value;
        let index = this.state.templateTags.indexOf(tagValue);
        if(index == -1){
            this.setState({ templateTags: [tagValue,...this.state.templateTags] });
            this.setState({ tag:'' });
        }
    };

    /***
     * input显示新分类
     * @param event
     */
    newTypeChange = (event) => {
        this.setState({newTemplateType: event.target.value});
    };

    /***
     * 标签
     * @param event
     */
    tagChange = (event) => {
        this.setState({tag: event.target.value});
    };

    /***
     * 模版名称
     * @param event
     */
    showTemplateName = (event) => {
        this.setState({templateName: event.target.value});
    };

    /**
     * 删除当前标签
     * @param tag
     * @returns {Function}
     */
    deleteTag = (tag) => {
        return () => {
            let index = this.state.templateTags.indexOf(tag);
            if(index != -1){
                this.state.templateTags.splice(index, 1);
                this.setState({ templateTags: this.state.templateTags })
            }
        }
    };

    /**
     * 保存模版
     * @returns {XML}
     */
    onSaveTemplate = () => {
        let params = {
            styleIds: this.props.currents.map(it => it._id),
            types: this.state.choosedTemplateType,
            name: this.state.templateName,
            tags: this.state.templateTags
        } ;

        if(!params.types){
            alert("没选模版分类");
            return;
        }

        $.post('/api/template/add',params, json => {
            if (json.status) {
                alert("插入模版成功");
                this.props.onClear();
            }else{
                alert("插入模版失败");
            }
        });
    };


    render() {

        let { types, currents } = this.props;
        let templateTypeAll =this.props.templateTypes.concat(this.state.templateTypes);
        let singleTypes = new Set();
        templateTypeAll.forEach((type) => {
                singleTypes.add(type);
        });
        templateTypeAll = Array.from(singleTypes);

        /***
         * 模版样式显示
         */
        let styles = currents.map((style,index) => {
            return (
                <div key={ style._id }>
                    <div dangerouslySetInnerHTML={{ __html: style.html }} ></div>
                </div>
            )
        });

        /***
         * 模版分类显示
         */
        let showTemplateTypes = templateTypeAll.map((type,index) => {
            return(
                <div className="template-type-choose" key={ index }>
                    <button onClick={this.chooseTemplateType(type)} className={'btn btn-default ' + (type == this.state.choosedTemplateType ? 'active' : '')} type="button">{ type }</button>
                </div>
            )
        });

        /**
         * 标签显示
         * @type {Array}
         */
        let showTags = this.state.templateTags.map((tag,index) => {
            return(
                <div className="template-type-choose" key={ index }>
                    <button onClick={this.deleteTag(tag)}  className="btn btn-default" type="button">{ tag }</button>
                </div>
            )
        });

        return (
            <div className="modal fade" id="previewModal" tabIndex="-1" role="dialog" aria-labelledby="previewModal" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h3>模版预览</h3>
                        </div>
                        <div className="modal-body">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-md-12">
                                        {styles}
                                    </div>
                                </div>
                                <hr />

                                <h3>添加-选择模版分类</h3>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <input type="text" value={ this.state.newTemplateType } onKeyUp={this.keyUpAddType.bind(this)} onChange={this.newTypeChange} className="form-control" id="addType" placeholder="添加模版分类,并按enter键" />
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        {showTemplateTypes}
                                    </div>
                                </div>
                                <hr />

                                <h3>输入模版名称</h3>
                                <div className="row">
                                    <div className="col-md-12">
                                            <div className="col-sm-12">
                                                <input type="text" value={ this.state.templateName} onChange={this.showTemplateName} className="form-control input-template-name"  placeholder="模版名称"/>
                                            </div>
                                    </div>
                                </div>
                                <hr />

                                <h3>添加模版标签</h3>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                                <input type="text" value={ this.state.tag } onKeyUp={this.keyDownTags.bind(this)} onChange={this.tagChange} className="form-control" id="addTags" placeholder="添加标签,并按enter键" />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            {showTags}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.onSaveTemplate}>保存</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};