import React, { Component } from 'react';
import { connect } from 'react-redux';

class Auth extends Component {
    constructor(props) {
        super(props);

        this.shouldDisplay = this.shouldDisplay.bind(this);
    }

    shouldDisplay() {
        const { whenLogged = true } = this.props;

        return whenLogged == this.props.session.isLogged;
    }

    render() {
        return (
            <>
                {this.shouldDisplay() && this.props.children}
            </>
        )
    }
}

const stateToProps = state => ({
    session: state.app.logged
});

export default connect(stateToProps)(Auth);