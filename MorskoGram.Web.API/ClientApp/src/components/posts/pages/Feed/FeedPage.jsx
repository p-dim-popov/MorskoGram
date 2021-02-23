import React, {useState, useEffect} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {getAsync} from '../../../../utils/fetcher';
import {POSTS} from '../../../../constants/endpoints';
import {Post} from '../../Post';
import {ListPostsViewModel} from '../../../../models/posts';
import {restManager} from '../../../../utils/restManager';

const POSTS_PER_FETCH = 2;

export const FeedPage = React.memo(function FeedPage() {
    const [hasMorePosts, setHasMorePosts] = useState(true);
    const [posts, setPosts] = useState([]);

    const fetchPosts = () => getAsync(Array.of(ListPostsViewModel))(`${POSTS}?`
        + `count=${POSTS_PER_FETCH}`
        + `&referenceDate=${encodeURIComponent(posts.length
            ? [...posts].pop().createdOn
            : new Date().toISOString())}`)
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
    );
});
