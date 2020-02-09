import {DISCOVER_USERS, SET_LOADING, RESTART_STATE} from '../actions/users';
const defaultState = {
  loading: false,
  items: []
}

export default (state = defaultState, action) => {
  switch(action.type) {
    case DISCOVER_USERS:
      return {
        ...state,
        items: action.payload.map(user => ({...user, profilePic: user.profilePic}))
      }
    case SET_LOADING:
			return {
				...state,
				loading: action.payload.loading
			}
		case RESTART_STATE:
			return defaultState;
    default:
      return state;
  }
}
