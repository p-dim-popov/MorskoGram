import React, {useState, useEffect} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {Col, Container, Row} from 'reactstrap';
import PropTypes from 'prop-types';
import {getAsync} from '../../../../utils/fetcher';
import {POSTS} from '../../../../constants/endpoints';
import {Post} from '../../Post';
import {ListPostsViewModel} from '../../../../models/posts';
import {restManager} from '../../../../utils/restManager';

const POSTS_PER_FETCH = 2;

export const FeedPage = React.memo(function FeedPage({
    userId,
}) {
    const [hasMorePosts, setHasMorePosts] = useState(true);
    const [posts, setPosts] = useState([]);

    const fetchPosts = () => getAsync(Array.of(ListPostsViewModel))(POSTS, {
        userId,
        count: POSTS_PER_FETCH,
        referenceDate: encodeURIComponent(posts.length
            ? [...posts].pop().createdOn
            : new Date().toISOString()),
    })
        .then((data = []) => {
            if (data && data instanceof Array) {
                setHasMorePosts(!!data.length);
                const newPosts = [...posts, ...data];
                setPosts(newPosts);
            }
        })
        .catch(restManager);

    useEffect(() => {
        fetchPosts();
    }, []);

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
                            <Post key={post.id} dataSource={post}/>
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
