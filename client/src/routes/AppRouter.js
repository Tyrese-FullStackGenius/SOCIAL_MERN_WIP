import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Home from '../pages/home';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import Error from '../pages/Error';
import Navbar from '../components/Navbar';

class AppRouter extends Component {
	constructor(props){
		super(props);
	}

	render(){
		return (
			<BrowserRouter>
				<Navbar />
				<Switch>
					<Route path="/" component={Home} exact />
					<Route path="/Settings" component={Settings} />
					<Route path="/u/:id" component={Profile} />		
					<Route component={Error} />
				</Switch>
			</BrowserRouter>
		)
	}
}

export default AppRouter;