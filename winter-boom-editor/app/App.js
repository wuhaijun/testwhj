'use strict';
import Component from './components/Component';
import Main from './components/Main';
import Center from './components/center/Center';
import Router from './Router';

export default class extends Component {
    constructor(props) {
        super(props);
        window.router = new Router({
            routes: {
                '/editor':() => {
                    this.__loadEditorPage__.apply(this);
                },
                '/styles': () => {
                    this.__loadStylesPage__.apply(this);
                }
            }
        });
        window.router.start();
    }

    __loadStylesPage__() {
        this.html('');

        this.center = new Center({ });
        this.append(this.center);
    }

    __loadEditorPage__() {
        this.html('');

        this.main = new Main({ });
        this.append(this.main);
    }

    render() {
       return $(`<div id="app"></div>`);
    }
}