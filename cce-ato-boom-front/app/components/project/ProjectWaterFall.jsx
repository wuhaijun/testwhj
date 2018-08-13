'use strict';

import React, {Component, PropTypes} from 'react';
import _ from 'lodash';

import WaterFallSimpleProject from '../../components/channel/WaterFallSimpleProject.jsx';

export default class ProjectWaterFall extends Component {

    constructor(props) {
        super(props);
        this.colWidth = 210;
    }

    componentDidMount() {
        this.water();
    }

    componentDidUpdate() {
        this.water();
    }

    water() {
        let contentList = $(this.refs.contentList);
        let width = contentList.width();

        if(width < 300) {
            return;
        }

        let colWidth = this.colWidth, colCount = parseInt(width / colWidth), heightArray;

        //@TODO 可以尝试只对增量内容进行处理
        heightArray = new Array(colCount).fill(0);

        function get() {
            let index = 0, value = heightArray[0];
            for(let i = 1;i < heightArray.length;i++) {
                let v = heightArray[i];
                if(value > v) {
                    index = i;
                    value = v;
                }
            }

            let top = value + 'px';
            let left = colWidth * index + 'px';

            return {index, value, top, left};
        }

        function set(index, height) {
            heightArray[index] = heightArray[index] + height + 6;
        }

        let colList = contentList.find('div.project-col');
        colList.css({
            width: colWidth + 'px',
            position: 'absolute'
        });
        colList.each(function () {
            let $t = $(this);
            let r = get();
            $t.css({
                top: r.top,
                left: r.left
            });

            set(r.index, $t.height());
        });

        contentList.css({height: _.max(heightArray) + 20 + 'px'});
    }

    render() {
        const { projects, location} = this.props;
        let projectList = [];

        for(let project of projects) {
            //@TODO 临时修复 当其他页面有coverImg为空的project时，本页面报错，造成崩溃的问题。 需要彻底解决：1 react异常处理，避免崩溃 2 channel切换时上一个channel的projects依然保留，会造成一定问题
            if(project.type != 'studio') {
                continue;
            }
            let projectProps = {
                project: project,
                width: this.colWidth,
                path: (location.pathname + location.search)
            };
            projectList.push(<WaterFallSimpleProject key={project._id} {...projectProps}/>);
        }

        return (<div ref="contentList" className="content-list" style={{position: 'relative'}}>{projectList}</div>);
    }

}

ProjectWaterFall.propTypes = {
    projects: PropTypes.array,
    location: PropTypes.object.isRequired
};
