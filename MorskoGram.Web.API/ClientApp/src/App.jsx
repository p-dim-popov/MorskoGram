import React from 'react';
import {Route} from 'react-router';
import {Layout} from './components/Layout';
import {Home} from './components/Home';
import {
    CreatePostPage, PostPage, FeedPage, SearchPage,
} from './components/posts/pages';
import {UserPage} from './components/users/pages';
import FetchData from './components/FetchData';
import Counter from './components/Counter';
import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import {ApplicationPaths} from './components/api-authorization/ApiAuthorizationConstants';

import 'bootswatch/dist/cerulean/bootstrap.min.css';
import './custom.css';

export default function App() {
    return (
        <Layout>
            <Route exact path="/" component={Home}/>
            <Route path="/counter" component={Counter}/>
            <AuthorizeRoute path="/fetch-data" component={FetchData}/>
            <AuthorizeRoute path="/posts/create" component={CreatePostPage}/>
            <AuthorizeRoute path="/feed" component={FeedPage}/>
            <Route
                path="/posts/:id([0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12})"
                component={PostPage}
            />
            <Route path="/users/:id" component={UserPage}/>
            <Route path="/search" component={SearchPage}/>
            <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes}/>
        </Layout>
    );
}

App.displayName = App.name;
