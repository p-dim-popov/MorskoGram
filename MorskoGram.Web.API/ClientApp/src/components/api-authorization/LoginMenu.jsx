import React, {Component} from 'react';
import {
    DropdownItem, DropdownMenu, DropdownToggle, NavItem, NavLink, UncontrolledDropdown,
} from 'reactstrap';
import {Link} from 'react-router-dom';
import authService from './AuthorizeService';
import {ApplicationPaths} from './ApiAuthorizationConstants';
import {PlusCircle, AccountCircle} from '../icons';

export default class LoginMenu extends Component {
    static authenticatedView(id, profilePath, logoutPath) {
        return (
            <>
                <NavItem>
                    <NavLink tag={Link} to="/posts/create">
                        <PlusCircle size={28} className="text-dark"/>
                    </NavLink>
                </NavItem>
                <NavItem>
                    <UncontrolledDropdown nav inNavbar>
                        <DropdownToggle nav caret>
                            <AccountCircle size={28} className="text-dark"/>
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem>
                                <NavLink tag={Link} className="text-dark" to={`/users/${id}`}>
                                    View profile
                                </NavLink>
                            </DropdownItem>
                            <DropdownItem>
                                <NavLink tag={Link} className="text-dark" to={profilePath}>
                                    Manage profile
                                </NavLink>
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
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
            id: null,
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
        window.x = user;
        this.setState({
            isAuthenticated,
            id: user?.sub,
        });
    }

    render() {
        const {
            isAuthenticated,
            id,
        } = this.state;
        if (!isAuthenticated) {
            const registerPath = `${ApplicationPaths.Register}`;
            const loginPath = `${ApplicationPaths.Login}`;
            return LoginMenu.anonymousView(registerPath, loginPath);
        }
        const profilePath = `${ApplicationPaths.Profile}`;
        const logoutPath = {
            pathname: `${ApplicationPaths.LogOut}`,
            state: {local: true},
        };
        return LoginMenu.authenticatedView(id, profilePath, logoutPath);
    }
}
