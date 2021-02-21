import React, {useEffect} from 'react';
import {
    Button, Col, Row,
} from 'reactstrap';
import {useHistory} from 'react-router';
import {SYSTEM_NAME} from '../../constants/global';
import {LOGIN_URL, REGISTER_URL} from '../../constants/authentication';
import style from './index.module.css';
import authService from '../api-authorization/AuthorizeService';

export const Home = React.memo(() => {
    const history = useHistory();
    useEffect(() => {
        authService.isAuthenticated()
            .then((result) => (result ? history.push('/feed') : false));
    }, []);

    return (
        <Row className={style.rowContainer}>
            <Col className={style.textColumn} md={6} sm={12} xs={12}>
                <h3>Welcome</h3>
                <h5>
                    {`${SYSTEM_NAME} `}
                    is a platform for sharing pictures of you and the sea
                </h5>
            </Col>
            <Col className={style.buttonsColumn}>
                <Button href={LOGIN_URL} variant="primary">Login</Button>
                <div>or</div>
                <Button href={REGISTER_URL} variant="primary">Register</Button>
            </Col>
        </Row>
    );
});

Home.displayName = Home.name;
