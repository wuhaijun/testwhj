'use strict';

import React, { Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import Icon from '../common/Icon.jsx';
import {event, CATEGORYS, ACTIONS} from '../../../common/TrackUtils';

export default class Menu extends Component {

    render() {
        const { to, icon, name, type, children, hasSub ,guideStyle} = this.props;
        return (
            <li title={ name } style={guideStyle}>
                <Link to={ to } activeClassName="active">
                    <span>
                        <Icon icon={ icon } type={ type }/>
                        <span className='menu-text'>{ name }</span>
                    </span>
                    {
                        hasSub &&
                        <i onClick={
                            e => event(CATEGORYS.BUTTONS, ACTIONS.MENU_FOLD)
                        } className="fa fa-angle-right expand" />
                    }
                </Link>
                { children }
            </li>
        )
    }
}

Menu.propTypes = {
    to: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.string,
    type: PropTypes.string
};