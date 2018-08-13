import React,{ Component,PropTypes } from 'react';

export default class RotateCards extends Component {
    render() {
        let children = this.props.children;
        children = Object.prototype.toString.call(children) === "[object Array]" ? children : [ children ];
        console.log(children);
        let length = children.length;

        let mid = children[0];
        let i = Math.floor(((length - 1) / 2));
        let lefts = [];
        for (let j = 1; j <= i; j++) {
            lefts.push(children[j]);
        }
        let rights = [];
        for (let k = i+1; k <= length -1 ; k++) {
            rights.push(children[k]);
        }

        return (
            <div className="react-component-rotate-cards">
                <div className="left">
                    { lefts }
                </div>
                <div className="mid">
                    { mid }
                </div>
                <div className="right">
                    { rights }
                </div>
            </div>
        )
    }
}

