import React, { Component, PropTypes } from 'react';

const DIV_STYLE = {
    position: "relative"
};

const I_STYLE = {
    position: "absolute",
    right: "15px",
    top: "13px"
};

export default class  extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    onChange(e) {
        let v = e.target.value;
        if(this.props.onChange) {
            this.props.onChange(v);
        }
        this.setState({keyword: v});
    }

    clearKeyword() {
        this.refs.i.value = '';
        this.setState({keyword: null});
        if(this.props.onChange) {
            this.props.onChange(null);
        }
    }

    render() {
       return (
           <div style={DIV_STYLE}>
               {
                   this.state.keyword ?
                   <i className="fa fa-times"
                      style={I_STYLE}
                      onClick={this.clearKeyword.bind(this)} />
                       :
                   <i className="fa fa-search" style={I_STYLE}/>
               }
               <input className="form-control boom-search-input" type="text"
                      onChange={this.onChange.bind(this)} placeholder="搜索关键字"/>
           </div>
       );
    }

}
