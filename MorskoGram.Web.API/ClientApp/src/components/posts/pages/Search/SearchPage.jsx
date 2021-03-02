import React, {useRef, useState, useEffect} from 'react';
import {
    Button, Col, Container, Form, Input, Label, Row,
} from 'reactstrap';
import {useHistory, useLocation} from 'react-router';
import SmartPagination from 'react-js-pagination';
import {Post} from '../../Post';
import {getAsync} from '../../../../utils/fetcher';
import {SearchDto} from '../../../../models/posts';
import {POSTS} from '../../../../constants/endpoints';
import {restManager} from '../../../../utils/restManager';
import {SearchIcon} from '../../../icons';

const getSearchUrl = (tags, page, itemsPerPage) => '/search?'
        + `tags=${tags}`
        + `&page=${page}`
        + `&itemsPerPage=${itemsPerPage}`;

export const SearchPage = React.memo(function SearchPage() {
    const history = useHistory();
    const query = new URLSearchParams(useLocation().search);
    const [tags, page, itemsPerPage] = [
        query.get('tags') || '', +query.get('page') || 1, +query.get('itemsPerPage') || 2,
    ];
    const [posts, setPosts] = useState();
    const [availableCount, setAvailableCount] = useState(0);

    const inputRef = useRef(null);
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.value = tags;
        }
    }, [inputRef.current, tags]);

    const fetchPostsAndUpdateQuery = () => {
        getAsync(SearchDto)(`${POSTS}/search`, {
            tags, page, count: itemsPerPage,
        })
            .then((x) => {
                setPosts(x.list);
                setAvailableCount(x.availableCount);
            })
            .catch(restManager);
    };

    useEffect(() => {
        if (tags) {
            fetchPostsAndUpdateQuery();
        } else {
            setPosts([]);
        }
    }, [tags, page, itemsPerPage]);

    const onPageChange = (selectedPage) => {
        history.push(getSearchUrl(tags, selectedPage, itemsPerPage));
    };

    const onSearch = (event) => {
        event.persist();
        event.preventDefault();
        history.push(getSearchUrl(inputRef.current?.value || '', 1, itemsPerPage));
    };

    return (
        <>
            <Form onSubmit={onSearch}>
                <Row form>
                    <Col/>
                    <Col xs="auto">
                        <Input innerRef={inputRef} name="search" placeholder="Enter tags..."/>
                    </Col>
                    <Col xs="auto">
                        <Button color="primary">
                            <SearchIcon/>
                            {' '}
                            Search
                        </Button>
                    </Col>
                    <Col/>
                </Row>
            </Form>
            <Row>
                <Container>
                    {posts?.map((post) => (
                        <Row key={post.id}>
                            <Col>
                                <Post
                                    dataSource={post}
                                    setDataSource={(newPost) => setPosts(posts
                                        .map((oldPost) => (oldPost.id === post.id ? newPost : oldPost)))}
                                    isInList
                                />
                            </Col>
                        </Row>
                    ))}
                </Container>
            </Row>
            {tags && (posts?.length
                ? (
                    <Row>
                        <SmartPagination
                            activePage={page}
                            itemsCountPerPage={itemsPerPage}
                            totalItemsCount={availableCount}
                            pageRangeDisplayed={5}
                            onChange={onPageChange}
                            itemClass="page-item"
                            linkClass="page-link"
                        />
                    </Row>
                )
                : (
                    <Row>
                        <Col/>
                        <Col xs="auto">
                            <h6>No results</h6>
                        </Col>
                        <Col/>
                    </Row>
                ))}
        </>
    );
});
