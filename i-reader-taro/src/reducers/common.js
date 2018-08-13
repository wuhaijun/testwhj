import { LOADING, COMMON_NODES, COMMON_TEXT } from '../constants'
import util from '../utils/util'

export function loading(state = false, action) {
    let data = action.data;
    switch (action.type) {
        case LOADING: return data;
        default: return state;
    }
}

export function nodes(state = [], action) {
    let nodes = action.nodes;
    switch (action.type) {
        case COMMON_NODES: return nodes;
        default: return state;
    }
}

export function textContent(state = "", action) {
    let textContent = action.textContent;
    switch (action.type) {
        case COMMON_TEXT: return textContent;
        default: return state;
    }
}
