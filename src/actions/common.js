import Taro from '@tarojs/taro'
import { COMMON_NODES, COMMON_TEXT } from '../constants'
import request from '../utils/request'
import contentHandler from '../utils/contentHandler'

export function generatorNodes(type, text, target) {
    return async function (dispatch) {
        let nodes
        if (!text) {
            return nodes = [];
        } else {
            nodes = contentHandler.handle(type)(text, target);
        }
        return dispatch({
            type: COMMON_NODES,
            nodes: nodes
        })
    }
}

export function changeText(textContent) {
    return async function (dispatch) {
        return dispatch({
            type: COMMON_TEXT,
            textContent: textContent
        })
    }
}



