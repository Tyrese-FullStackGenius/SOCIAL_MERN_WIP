import { createStore, combineReducers, applyMiddleware } from 'redux';
import appReducer from './reducers/app';
import profileReducer from './reducers/profile';
import discoverReducer from './reducers/discover';
import thunk from 'redux-thunk';

const reducers = combineReducers({
	app: appReducer,
	profile: profileReducer,
	discover: discoverReducer
});

const store = createStore(reducers, applyMiddleware(thunk));

export default store;