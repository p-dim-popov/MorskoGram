import React, {useState, useEffect, useRef} from 'react';
import {
    Button, Card, CardBody, CardImg, CardText, Row, Col, Input,
} from 'reactstrap';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {useHistory} from 'react-router';
import {
    LikedHeart, NotLikedHeart, TrashIcon, EditIcon,
} from '../../icons';
import {PostViewModel, ListPostsViewModel} from '../../../models/posts';
import {utcToLocal} from '../../../utils/dateTimeHelper';
import {POSTS} from '../../../constants/endpoints';
import {deleteAsync, patchAsync} from '../../../utils/fetcher';
import {restManager} from '../../../utils/restManager';
import authService from '../../api-authorization/AuthorizeService';

export const Post = React.memo(function Post({
    dataSource,
    setDataSource,
}) {
    const history = useHistory();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const captionRef = useRef();
    const [user, setUser] = useState(null);

    const likeHandler = () => {
        console.log(dataSource.id);
    };

    useEffect(() => {
        authService.getUser().then(setUser);
    }, []);

    useEffect(() => {
        if (isDeleting) {
            deleteAsync(null)(`${POSTS}/${dataSource.id}`)
                .then(() => history.push(`/users/${dataSource.creatorEmail}`))
                .catch(restManager)
                .then(() => setIsDeleting(false));
        }
    }, [isDeleting]);

    useEffect(() => {
        if (isSaving) {
            patchAsync(PostViewModel)(`${POSTS}/${dataSource.id}`, {caption: captionRef.current?.value})
                .then((x) => {
                    setIsEditing(false);
                    setDataSource(x);
                })
                .catch(restManager)
                .then(() => setIsSaving(false));
        }
    }, [isSaving]);

    return (
        <Card>
            <CardBody>
                {dataSource instanceof PostViewModel && user?.name === dataSource.creatorEmail && (
                    <Row>
                        <Col>
                            <Button
                                onClick={() => setIsEditing(true)}
                                color="primary"
                                disabled={isDeleting}
                            >
                                <EditIcon/>
                            </Button>
                        </Col>
                        <Col/>
                        <Col xs="auto">
                            <Button
                                onClick={() => setIsDeleting(true)}
                                color="danger"
                                disabled={isDeleting}
                            >
                                <TrashIcon/>
                            </Button>
                        </Col>
                    </Row>
                )}
                <CardImg onDoubleClick={likeHandler} src={dataSource.imageLink}/>
                <CardText>
                    <b>
                        <Link to={`/users/${dataSource.creatorId}`}>
                            {dataSource.creatorEmail}
                        </Link>
                    </b>
                </CardText>
                <CardText>
                    {utcToLocal(dataSource.createdOn)}
                </CardText>
                {isEditing
                    ? (
                        <>
                            <Input innerRef={captionRef} type="textarea" defaultValue={dataSource.caption}/>
                            <Button
                                disabled={isSaving}
                                onClick={() => setIsSaving(true)}
                                color="primary"
                            >
                                Save
                            </Button>
                            <Button
                                onClick={() => setIsEditing(false)}
                                disabled={isSaving}
                                color="danger"
                            >
                                Cancel
                            </Button>
                        </>
                    )
                    : <CardText>{dataSource.caption}</CardText>}
                <Button onClick={likeHandler}>
                    <NotLikedHeart/>
                    <LikedHeart/>
                </Button>
                {' '}
                <Button
                    onClick={() => history.push(`/posts/${dataSource.id}`)}
                    disabled={dataSource instanceof PostViewModel}
                >
                    <span>
                        {`${dataSource.likesCount || dataSource.likes?.length || 0} likes`}
                    </span>
                    {' '}
                    <span>
                        {`${dataSource.commentsCount || dataSource.comments?.length || 0} comments`}
                    </span>
                </Button>
            </CardBody>
        </Card>
    );
});

Post.propTypes = {
    dataSource: PropTypes.oneOfType([
        PropTypes.instanceOf(PostViewModel),
        PropTypes.instanceOf(ListPostsViewModel),
    ]).isRequired,
    setDataSource: PropTypes.func,
};

Post.defaultProps = {
    setDataSource: (x) => x,
};
