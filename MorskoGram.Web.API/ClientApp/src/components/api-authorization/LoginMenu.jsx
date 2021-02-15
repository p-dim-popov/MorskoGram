import React, { Component, Fragment } from 'react';
import { NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import authService from './AuthorizeService';
import { ApplicationPaths } from './ApiAuthorizationConstants';

export default class LoginMenu extends Component {
  static authenticatedView(userName, profilePath, logoutPath) {
    return (
      <>
        <NavItem>
          <NavLink tag={Link} className="text-dark" to={profilePath}>
            Hello
            {userName}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} className="text-dark" to={logoutPath}>Logout</NavLink>
        </NavItem>
      </>
    );
  }

  static anonymousView(registerPath, loginPath) {
    return (
      <>
        <NavItem>
          <NavLink tag={Link} className="text-dark" to={registerPath}>Register</NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} className="text-dark" to={loginPath}>Login</NavLink>
        </NavItem>
      </>
    );
  }

  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      userName: null,
    };
  }

  componentDidMount() {
    this._subscription = authService.subscribe(() => this.populateState());
    this.populateState();
  }

  componentWillUnmount() {
    authService.unsubscribe(this._subscription);
  }

  async populateState() {
    const [isAuthenticated, user] = await Promise.all([
      authService.isAuthenticated(),
      authService.getUser(),
    ]);
    this.setState({
      isAuthenticated,
      userName: user && user.name,
    });
  }

  render() {
    const { isAuthenticated, userName } = this.state;
    if (!isAuthenticated) {
      const registerPath = `${ApplicationPaths.Register}`;
      const loginPath = `${ApplicationPaths.Login}`;
      return LoginMenu.anonymousView(registerPath, loginPath);
    }
    const profilePath = `${ApplicationPaths.Profile}`;
    const logoutPath = { pathname: `${ApplicationPaths.LogOut}`, state: { local: true } };
    return LoginMenu.authenticatedView(userName, profilePath, logoutPath);
  }
}
