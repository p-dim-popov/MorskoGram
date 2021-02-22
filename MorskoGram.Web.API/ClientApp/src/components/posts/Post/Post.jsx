import React, {useState, useEffect} from 'react';
import {
    Button, Card, CardBody, CardImg, CardText, Row, Col,
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
import {deleteAsync} from '../../../utils/fetcher';
import {restManager} from '../../../utils/restManager';

export const Post = React.memo(function Post({
    dataSource,
    likeHandler,
}) {
    const history = useHistory();
    const [isDeleting, setIsDeleting] = useState(false);

    const _likeHandler = likeHandler ?? (() => {
        console.log(dataSource.id);
    });

    useEffect(() => {
        if (isDeleting) {
            deleteAsync()(`${POSTS}/${dataSource.id}`)
                .then(() => history.push(`/profile/${dataSource.creatorEmail}`))
                .catch(restManager)
                .then(() => setIsDeleting(false));
        }
    }, [isDeleting]);

    return (
        <Card>
            <CardBody>
                <Row>
                    <Col>
                        <Button color="primary">
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
                <CardImg onDoubleClick={_likeHandler} src={dataSource.imageLink}/>
                <CardText>
                    <b>
                        <Link to={`/profiles/${dataSource.creatorEmail}`}>
                            {dataSource.creatorEmail}
                        </Link>
                    </b>
                </CardText>
                <CardText>
                    {utcToLocal(dataSource.createdOn)}
                </CardText>
                <CardText>{dataSource.caption}</CardText>
                <Button onClick={_likeHandler}>
                    <NotLikedHeart/>
                    <LikedHeart/>
                </Button>
                {' '}
                <Button onClick={() => history.push(`/posts/${dataSource.id}`)}>
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
    likeHandler: PropTypes.func,
};

Post.defaultProps = {
    likeHandler: null,
};
