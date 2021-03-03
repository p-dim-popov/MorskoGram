import React, {useState, useEffect} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {Col, Container, Row} from 'reactstrap';
import PropTypes from 'prop-types';
import {getAsync} from '../../../../utils/fetcher';
import {POSTS} from '../../../../constants/endpoints';
import {Post} from '../../Post';
import {PostViewModel} from '../../../../models/posts';
import {restManager} from '../../../../utils/restManager';

const POSTS_PER_FETCH = 5;

export const FeedPage = React.memo(function FeedPage({
    userId,
}) {
    const [hasMorePosts, setHasMorePosts] = useState(true);
    const [posts, setPosts] = useState([]);

    const fetchPosts = (isDifferentUser) => getAsync(Array.of(PostViewModel))(`${POSTS}/user`, {
        id: userId,
        count: POSTS_PER_FETCH,
        referenceDate: posts.length
            ? [...posts].pop().createdOn
            : new Date().toISOString(),
    })
        .then((data = []) => {
            if (data && data instanceof Array) {
                setHasMorePosts(!!data.length);
                const newPosts = isDifferentUser
                    ? data
                    : [...posts, ...data];
                setPosts(newPosts);
            }
        })
        .catch(restManager);

    useEffect(() => {
        fetchPosts(true);
    }, [userId]);

    return (
        <Container>
            <Row>
                <Col>
                    <InfiniteScroll
                        dataLength={posts.length}
                        next={fetchPosts}
                        hasMore={hasMorePosts}
                        loader={<h4>Loading...</h4>}
                    >
                        {posts.map((post) => (
                            <Post
                                key={post.id}
                                dataSource={post}
                                setDataSource={(newPost) => setPosts(posts
                                    .map((oldPost) => (oldPost.id === post.id ? newPost : oldPost)))}
                                isInList
                            />
                        ))}
                    </InfiniteScroll>
                </Col>
            </Row>
        </Container>
    );
});

FeedPage.propTypes = {
    userId: PropTypes.string,
};

FeedPage.defaultProps = {
    userId: null,
};
