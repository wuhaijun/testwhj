import { LOGIN } from '../constants'
import { combineReducers } from 'redux'

function login(state = [], action) {
  switch (action.type) {
    case LOGIN: return action.data;
    default: return state;
  }
}

export default combineReducers({
  login
});
