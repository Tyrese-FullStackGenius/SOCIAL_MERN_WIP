import React, { Component } from 'react';
import { toggleNavbar } from '../actions/app';
import {fetchProfile, newPost, fetchPosts, restartState, toggleSidenav} from '../actions/profile';
import BottomScrollListener from 'react-bottom-scroll-listener';
import { connect } from 'react-redux';
import Post from '../components/Post';
import Loading from '../components/Loading';
import { logout } from '../actions/app';
import Auth from '../components/Auth';
import '../styles/pages/Profile.scss';

class Profile extends Component {
	constructor(props){
		super(props);

		this.state = {
			youtubeInput: false
		};

		this.handleNewPost = this.handleNewPost.bind(this);
		this.fetchPosts = this.fetchPosts.bind(this);
		this.initializeProfile = this.initializeProfile.bind(this);
		this.toggleYoutubeInput = this.toggleYoutubeInput.bind(this);
	}

	componentDidMount() {
		this.initializeProfile();
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.props.location !== prevProps.location) {
			this.props.restartState();
			this.initializeProfile();
		}
	}

	componentWillUnmount(){
		this.props.restartState();
	}

	toggleYoutubeInput() {
		this.setState(prevState => ({
			youtubeInput: !prevState.youtubeInput
		}));
	}

	handleNewPost(e) {
		e.preventDefault();


		this.props.newPost({
			username: this.props.match.params.id,
			message: e.target.message.value,
			extra: {
				value: e.target.extra.value,
				extraType: 'youtube'
			}
		});

		e.target.message.value = '';
		e.target.extra.value = '';
	}

	fetchPosts() {
		const profileId = this.props.match.params.id;

		this.props.fetchPosts(profileId);
	}

	initializeProfile() {
		this.props.fetchProfile(this.props.match.params.id)
		this.fetchPosts();
	}

	render(){
		return (
			<div className="d-flex flex-column flex-md-row profile w-100">
				<div className={"d-flex sidenav flex-column " + (!this.props.profile.visibleSidenav ? 'sidenav--inactive' : '')}>
					<div className="sidenav__description">
						<img src={this.props.profile.profilePic}
							 className="img-fluid rounded-circle sidenav__avatar mx-auto d-block mt-5 mb-2"/>
						<p className="text-center text-white title mt-3">@{this.props.profile.username}</p>
						<p className="text-left text-white description px-5">{this.props.profile.description}</p>
						<div className="d-flex flex-column justify-content-between h-100">
							<div className="d-flex justify-content-between px-5">
								<div>
									<p className="text-white mb-0">450 Followers</p>
									<p className="text-white mb-0">235 Followings</p>
								</div>
								<div>
									<p className="text-white mb-0">723 Likes</p>
									<p className="text-white mb-0">532 Posts</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className={"sidenav__toggle border rounded-circle cursor-pointer " + (!this.props.profile.visibleSidenav ? 'sidenav__toggle--open' : '')} onClick={this.props.toggleSidenav}>
					<p className="my-0 py-0"><i className="fas fa-arrow-left"></i></p>
				</div>
				<BottomScrollListener onBottom={this.fetchPosts}>
					{scrollRef => (
						<div className="d-flex position-relative profile__body justify-content-center flex-wrap" ref={scrollRef}>
							<Auth>
								<div className="profile__body__textarea w-100 my-4">
								<div className="card border-0">
									<div className="card-body">
										<form onSubmit={this.handleNewPost}>
											<div className="form-group">
												<textarea
													id="message"
													name="message"
													className="form-control rounded-0 profile__body__textarea__input"
													rows="5"
													placeholder="What you thinking?">
												</textarea>
											</div>
											<div className="form-group">
												<input name="extra" id="extra" className={"form-control mt-2 " + (this.state.youtubeInput ? 'd-flex' : 'd-none')} placeholder="https://www.youtube.com/watch?v=dO368WjwyFs"/>
											</div>
											<div className="form-group">
												<button type="submit" className="btn btn-success rounded-pill float-right profile__body__textarea__button">POST</button>
												<button type="button" onClick={this.toggleYoutubeInput} className="btn btn-danger text-white rounded-pill float-right px-3 mx-2">
													<i className="fab fa-youtube"></i>
												</button>
											</div>
										</form>
									</div>
								</div>
							</div>
							</Auth>
							<div className="profile__body__posts w-100 mt-5">
								<div className="d-flex flex-column">
									{this.props.profile.posts.items.map((post, i) => <Post {...post} key={post.message + '_' + i}/>)}
									{this.props.profile.posts.loading && <div className="d-flex justify-content-center"><Loading classes="my-5"/></div>}
								</div>
							</div>
						</div>
					)}
				</BottomScrollListener>
			</div>
		)
	}
}

const stateToProps = state => ({
	logged: state.app.logged,
	ownsProfile: state.profile.ownProfile,
	profile: state.profile
});

const dispatchToProps = dispatch => ({
	toggleNavbar: value => dispatch(toggleNavbar(value)),
	toggleSidenav: () => dispatch(toggleSidenav()),
	fetchProfile: value => dispatch(fetchProfile(value)),
	newPost: value => dispatch(newPost(value)),
	fetchPosts: value => dispatch(fetchPosts(value)),
	restartState: () => dispatch(restartState()),
	logout: () => dispatch(logout())
})

export default connect(stateToProps, dispatchToProps)(Profile);
