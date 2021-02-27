import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router';
import {Col, Row} from 'reactstrap';
import {FeedPage} from '../../../posts/pages';
import {getAsync} from '../../../../utils/fetcher';
import {UserViewModel} from '../../../../models/users';
import {USERS} from '../../../../constants/endpoints';
import {restManager} from '../../../../utils/restManager';
import {FollowsPopover} from '../../FollowsPopover';
import {FollowViewModel, FollowTypes} from '../../../../models/follows';

export const UserPage = React.memo(function UserPage() {
    const {id: userId} = useParams();
    const [user, setUser] = useState(new UserViewModel());
    useEffect(() => {
        getAsync(UserViewModel)(`${USERS}/${userId}`)
            .then(setUser)
            .catch(restManager);
    }, [userId]);

    return (
        <>
            <Row>
                <Col>{user.email}</Col>
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
            </Row>
            <FeedPage userId={userId}/>
        </>
    );
});
