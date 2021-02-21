import React from 'react';
import {
    Button, Card, CardBody, CardImg, CardText,
} from 'reactstrap';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {useHistory} from 'react-router';
import {LikedHeart, NotLikedHeart} from '../../icons';
import {PostViewModel, ListPostsViewModel} from '../../../models/posts';
import {utcToLocal} from '../../../utils/dateTimeHelper';

export const Post = React.memo(function Post({
    dataSource,
    likeHandler,
}) {
    const history = useHistory();

    const _likeHandler = likeHandler ?? (() => {
        console.log(dataSource.id);
    });

    return (
        <Card>
            <CardBody>
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
