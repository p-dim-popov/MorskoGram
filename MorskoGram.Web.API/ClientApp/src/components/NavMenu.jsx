import React, {Component} from 'react';
import {
    Collapse, Container, Navbar, NavbarBrand, NavbarToggler,
} from 'reactstrap';
import {Link} from 'react-router-dom';
import LoginMenu from './api-authorization/LoginMenu';
import {SYSTEM_NAME} from '../constants/global';
import {Logo} from './icons';

export default class NavMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            collapsed: true,
        };
    }

    toggleNavbar = () => {
        const {collapsed} = this.state;
        this.setState({
            collapsed: !collapsed,
        });
    };

    render() {
        const {collapsed} = this.state;
        return (
            <header>
                <Navbar
                    className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3"
                    color="primary"
                    light
                >
                    <Container>
                        <NavbarBrand tag={Link} to="/">
                            <Logo size={28}/>
                            {' '}
                            {SYSTEM_NAME}
                        </NavbarBrand>
                        <NavbarToggler onClick={this.toggleNavbar} className="mr-2"/>
                        <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!collapsed} navbar>
                            <ul className="navbar-nav flex-grow">
                                <LoginMenu/>
                            </ul>
                        </Collapse>
                    </Container>
                </Navbar>
            </header>
        );
    }
}

NavMenu.displayName = NavMenu.name;
