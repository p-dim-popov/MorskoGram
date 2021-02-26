import React from 'react';
import {useParams} from 'react-router';
import {Jumbotron} from 'reactstrap';
import {FeedPage} from '../../../posts/pages';

export const UserPage = React.memo(function UserPage() {
    const {id: userId} = useParams();

    return (
        <>
            <Jumbotron>
                User here
            </Jumbotron>
            <FeedPage userId={userId}/>
        </>
    );
});
