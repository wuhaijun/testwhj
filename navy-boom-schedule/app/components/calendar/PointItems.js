'use strict';
import Component from '../Component';
import PointItem from './PointItem';

export default class extends Component {

    constructor(props) {
        super(props);
        this.rendered();
    }

    rendered() {
        this.points.forEach(point => {
            this.append(new PointItem({
                wechat: this.wechat,
                point: point,
                date: this.date,
                pointItems: this
            }));
        });
    }

    render() {
        return $(`<div class="reserve-box"></div>`);
    }
}