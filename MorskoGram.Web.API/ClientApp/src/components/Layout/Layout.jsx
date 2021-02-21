import React from 'react';
import {Container} from 'reactstrap';
import NavMenu from '../NavMenu';

import style from './style.module.css';

export const Layout = React.memo(function Layout({
    children,
}) {
    return (
        <>
            <NavMenu/>
            <div className={style.container}>
                <Container>
                    {children}
                </Container>
            </div>
        </>
    );
});
