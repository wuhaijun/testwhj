import React, { PropTypes, Component } from 'react';

import  { Tag, Tags }  from 'react-components';
import Layout from './Layout.jsx';
import DP from './DP.jsx';

export default class TagDemo extends Component {

    render() {
        return (
            <Layout title="标签">
                <DP title="8. 蜂窝标签组:">
                    <Tags>
                        <Tag type="honeycomb" name="绿茶" />
                        <Tag type="honeycomb" name="红茶" />
                        <Tag type="honeycomb" name="Coco" />
                    </Tags>
                </DP>

                <DP title="1. 普通标签:">
                    <Tag name="绿茶" />
                    <Tag name="红茶" />
                    <Tag name="Coco" />
                </DP>

                <DP title="2. 带onclick标签:">
                    <Tag name="CCE" onClick= { name => {  alert(name) } } />
                </DP>

                <DP title="3. 标签组:">
                    <Tags>
                        <Tag type="common" name="绿茶" />
                        <Tag type="common" name="红茶" />
                        <Tag type="common" name="Coco" />
                    </Tags>
                </DP>

                <DP title="4. arrow 标签:">
                    <Tag name="红茶" type="arrow" />
                </DP>

                <DP title="5. arrow 标签组:">
                    <Tags>
                        <Tag type="arrow" name="绿茶" />
                        <Tag type="arrow" name="红茶" />
                        <Tag type="arrow" name="Coco" />
                    </Tags>
                </DP>

                <DP title="6. honeycomb 标签:">
                    <Tag name="红茶" type="honeycomb" />
                </DP>

                <DP title="7. honeycomb 标签组:">
                    <Tags>
                        <Tag type="honeycomb" name="绿茶" />
                        <Tag type="honeycomb" name="红茶" />
                        <Tag type="honeycomb" name="Coco" />
                    </Tags>
                </DP>
                <DP title="8. 混合标签组:">
                    <Tags>
                        <Tag type="common" name="绿茶" />
                        <Tag type="arrow" name="红茶" />
                        <Tag type="honeycomb" name="Coco" />
                    </Tags>
                </DP>
            </Layout>
        );
    }
}