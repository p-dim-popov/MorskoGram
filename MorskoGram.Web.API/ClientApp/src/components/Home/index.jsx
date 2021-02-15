import React from 'react';
import {
  Button, Col, Container, Row,
} from 'reactstrap';
import { SYSTEM_NAME } from '../../constants/global';
import { LOGIN_URL, REGISTER_URL } from '../../constants/authentication';
import style from './index.module.css';

const Home = React.memo(() => (
  <Container>
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
  </Container>
));

Home.displayName = Home.name;
export default Home;
