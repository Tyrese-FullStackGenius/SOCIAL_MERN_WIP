import axios from 'axios';

export const TOGGLE_NAVBAR = 'TOGGLE_NAVBAR',
				SIGN_UP = 'SIGN_UP',
				SIGN_IN = 'SIGN_IN',
				RECONNECT = 'RECONNECT',
				LOGOUT = 'LOGOUT',
				SET_LOGIN_LOADING = 'SET_LOGIN_LOADING',
				SET_PROFILE_PICTURE = 'SET_PROFILE_PICTURE',
				RESET_LAST_CONNECTION = 'RESET_LAST_CONNECTION',
				SET_PROFILE_DESCRIPTION = 'SET_PROFILE_DESCRIPTION'


export const setLoginLoad = (value) => {
	return dispatch => dispatch({
		type: SET_LOGIN_LOADING,
		payload: {
			value
		}
	})
}

export const reconnect = (last_session) => {
	return dispatch => {
		dispatch(setLoginLoad(true));

		dispatch({
			type: RECONNECT,
			payload: {
				last_session
			}
		})
	}
}

export const resetLastConnection = () => {
	return dispatch => dispatch({
			type: RESET_LAST_CONNECTION
		});
}

export const logout = () => {
	return dispatch => {
		localStorage.removeItem('last_session');
		dispatch(setLoginLoad(true));
		dispatch({
			type: LOGOUT
		})
		window.location.href = "/";
	}
}

export const signUp = ({username, email, password}) => {
	return dispatch => {
		dispatch(setLoginLoad(true));

		axios.post('http://localhost:3000/auth/sign-up', { email, username, password })
			.then(res => {
				if(res.data.code == 200){					
					dispatch({
						type: SIGN_UP,
						payload: {
							...res.data.response
						}
					});
				}
			})
			.catch(e => {
				console.log(e)
				dispatch(setLoginLoad(false));
			});
	}
}

export const signIn = ({username, password}) => {
	return dispatch => {
		dispatch(setLoginLoad(true));

		axios.post('http://localhost:3000/auth/sign-in', { username, password })
			.then(res => {
				if(res.data.code == 200){
					dispatch({
							type: SIGN_IN,
							payload: {
								...res.data.response
							}
						});
				}
			})
			.catch(e => {
				console.log(e)
				dispatch(setLoginLoad(false));
			});
	}
}

export const setProfilePic = url => {
	return dispatch => {
		dispatch({
			type: SET_PROFILE_PICTURE,
			payload: {
				url
			}
		});

		dispatch(resetLastConnection());
	}
}

export const setDescription = description => {
	return dispatch => {
		dispatch({
			type: SET_PROFILE_DESCRIPTION,
			payload: {
				description
			}
		});

		dispatch(resetLastConnection())
	}
}

export const toggleNavbar = (value) => {
	return dispatch => dispatch({
		type: TOGGLE_NAVBAR,
		payload: {
			value
		}
	})
}