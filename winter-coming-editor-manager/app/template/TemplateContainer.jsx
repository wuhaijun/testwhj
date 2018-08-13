'use strict';

import React from 'react';
import StyleNav from './../style/StyleNav.jsx';
import TemplateStyleList from './TemplateStyleList.jsx';
import TemplateStyleEditor from './TemplateStyleEditor.jsx';


export default class extends React.Component {

    constructor(props) {
        super(props);
        this.state = { styles: [], types: [], currents: [], templateTypes: [] };
    }

    componentDidMount() {
        $.get('/api/types', json => {
            this.setState({ types: json.result });
        });

        $.get('/api/styles', json => {
            this.setState({ styles: json.result });
        });

        $.get('/api/templateTypes', json => {
            this.setState({ templateTypes: json.results });
        });
    }

    handleClickType = type => {
        $.get('/api/style/type/' + type, json => {
            this.setState({ styles: json.result });
        });

        $(".style-list").scrollTop(0);
    };

    handleClickStatus = status => {
        $.get('/api/style/status/' + status, json => {
            this.setState({ styles: json.result });
        });
    };

    handleAddStyle = style => {
        return () => {
            let currents = this.state.currents;
            let index = this.state.currents.findIndex(it => it._id == style._id);
            if(index != -1) return;
            this.setState({ currents: [...currents, style] });
        };
    };

    handleRemoveStyle = style => {
        return () => {
            let index = this.state.currents.findIndex(it => it._id == style._id);
            if (index != -1) {
                let styles = [...this.state.currents];
                styles.splice(index, 1);
                this.setState({ currents: styles });
            }
        };
    };

    clear = () => {
        this.setState({ currents: [] });
    };


    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <StyleNav types={this.state.types}
                        onClickStatus={this.handleClickStatus}
                        onClickType={this.handleClickType} />

                    <TemplateStyleList styles={this.state.styles}
                                       onAddStyle={this.handleAddStyle}/>

                    <TemplateStyleEditor currents={this.state.currents}
                                         types={this.state.types}
                                         templateTypes={this.state.templateTypes}
                                         onClear={this.clear}
                                         onRemoveStyle={ this.handleRemoveStyle }/>
                </div>
            </div>
        );
    }
}