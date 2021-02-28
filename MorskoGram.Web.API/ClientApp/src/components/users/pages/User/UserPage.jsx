import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router';
import {
    Button, Col, Row,
} from 'reactstrap';
import {FeedPage} from '../../../posts/pages';
import {getAsync, postAsync} from '../../../../utils/fetcher';
import {UserViewModel} from '../../../../models/users';
import {USERS} from '../../../../constants/endpoints';
import {restManager} from '../../../../utils/restManager';
import {FollowsPopover} from '../../FollowsPopover';
import {FollowViewModel, FollowTypes} from '../../../../models/follows';
import authService from '../../../api-authorization/AuthorizeService';

import style from './style.module.css';

export const UserPage = React.memo(function UserPage() {
    const {id: userId} = useParams();
    const [user, setUser] = useState(new UserViewModel());
    const [loggedUser, setLoggedUser] = useState({});

    const getUserAsync = () => getAsync(UserViewModel)(`${USERS}/${userId}`)
        .then(setUser)
        .catch(restManager);

    useEffect(() => {
        getUserAsync();
    }, [userId]);

    useEffect(() => {
        authService.getUser()
            .then(setLoggedUser);
    }, []);

    const toggleFollow = () => {
        postAsync(null)(`${USERS}/follow/${userId}`)
            .then(getUserAsync);
    };

    return (
        <>
            <div className={style.headerRow}>
                <Row xs={1} sm={1} md={4}>
                    <Col>
                        <h5>
                            {user.email}
                        </h5>
                    </Col>
                    <Col>
                        <FollowsPopover
                            title="Followers"
                            dataSource={user.followers.map((x) => new FollowViewModel(x))}
                            type={FollowTypes.followed}
                        />
                    </Col>
                    <Col>
                        <FollowsPopover
                            title="Followings"
                            dataSource={user.followings.map((x) => new FollowViewModel(x))}
                            type={FollowTypes.follower}
                        />
                    </Col>
                    {loggedUser?.sub !== userId && (
                        <Col>
                            {user.followers.some((x) => x.followerId === loggedUser.sub)
                                ? (<Button onClick={toggleFollow} color="danger">Unfollow</Button>)
                                : (<Button onClick={toggleFollow} color="primary">Follow</Button>)}
                        </Col>
                    )}
                </Row>
            </div>
            <hr/>
            <FeedPage userId={userId}/>
        </>
    );
});
