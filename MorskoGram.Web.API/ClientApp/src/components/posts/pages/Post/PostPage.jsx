import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router';
import {
    Col, Row,
} from 'reactstrap';
import {getAsync} from '../../../../utils/fetcher';
import {POSTS} from '../../../../constants/endpoints';
import {Post} from '../../Post';
import {PostViewModel} from '../../../../models/posts';
import {Comment} from '../../Comment';
import {CommentViewModel} from '../../../../models/comments';

export const PostPage = React.memo(function PostPage() {
    const {id: postId} = useParams();
    const [post, setPost] = useState(null);
    useEffect(() => {
        getAsync(PostViewModel)(`${POSTS}/${postId}`)
            .then(setPost);
    }, [postId]);

    return !post
        ? <span>Loading...</span>
        : (
            <Row>
                <Col xs={12} sm={12} md={12} lg={8} xl={8}>
                    <Post dataSource={post} setDataSource={setPost}/>
                </Col>
                <Col xs={12} sm={12} md={12} lg={4} xl={4}>
                    {[
                        ...post.comments,
                        new CommentViewModel({
                            creatorEmail: 'Pesho',
                            content: 'Lorizzle dope dolor go to hizzle fo shizzle my nizzle, boom shackalack adipiscing ma nizzle. Nullizzle ass velizzle, fo shizzle gizzle, daahng dawg quizzle, own yo\' ghetto, go to hizzle.',
                        }),
                        new CommentViewModel({
                            creatorEmail: 'Joro',
                            content: 'Pellentesque fo shizzle mah nizzle fo rizzle, mah home g-dizzle tortor. Sed uhuh ... yih!. Yo mamma izzle boofron doggy hizzle tempizzle tempor.',
                        }),
                    ]
                        .map((x) => (<Comment key={x.id} dataSource={x}/>))}
                </Col>
            </Row>
        );
});
