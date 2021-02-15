import React from 'react';
import { Container } from 'reactstrap';
import NavMenu from './NavMenu';

const Layout = React.memo(({
  children,
}) => (
  <>
    <NavMenu />
    <Container>
      {children}
    </Container>
  </>
));

Layout.displayName = Layout.name;

export default Layout;
