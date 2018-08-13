import { combineReducers } from 'redux'
import { projectList, projectDetail, projectSearchList } from './project'
import { themeList, themeMapping } from './theme'
import { userInfo, userNotes, userCollects } from './user'
import {loading,nodes,textContent} from './common'

export default combineReducers({
  projectList, projectDetail, projectSearchList,
  themeList, themeMapping,
  userInfo, userNotes, userCollects,
  loading,nodes,textContent
})
