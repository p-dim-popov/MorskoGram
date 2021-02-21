import React, {useState, useEffect, useRef} from 'react';
import {useHistory} from 'react-router';
import {
    Button, Col, Container, Row, Input, FormGroup, Form, CardImg,
} from 'reactstrap';
import {Camera} from '../../../Camera';
import {postAsync} from '../../../../utils/fetcher';
import {POSTS} from '../../../../constants/endpoints';
import {CameraIcon, TrashIcon} from '../../../icons';

export const CreatePostPage = React.memo(function CreatePostPage() {
    const history = useHistory();
    const captionRef = useRef(null);

    const [isTakingPhoto, setIsTakingPhoto] = useState(false);
    const [photo, setPhoto] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        window.onbeforeunload = () => '';
        return () => {
            window.onbeforeunload = null;
        };
    }, []);

    useEffect(() => {
        if (isSubmitting) {
            const submitAsync = async () => {
                const photoBlobPromise = fetch(photo)
                    .then((res) => res.blob());
                const formData = new FormData();
                formData.append('caption', captionRef.current?.value || '');
                const photoBlob = await photoBlobPromise;
                formData.append('Image', photoBlob);
                const result = await postAsync()(POSTS, formData);
                if (result) {
                    history.push(`/posts/${result.id}`);
                }
            };

            submitAsync().catch(() => setIsSubmitting(false));
        }
    }, [isSubmitting]);

    const onSubmitPost = (event) => {
        event.persist();
        event.preventDefault();
        setIsSubmitting(true);
    };

    return (
        <Container>
            {isTakingPhoto && (
                <Camera
                    onApprove={(photoSrc) => {
                        setPhoto(photoSrc);
                        setIsTakingPhoto(false);
                    }}
                    onBack={() => setIsTakingPhoto(false)}
                />
            )}
            <Row>
                <Col/>
                <Col xs="auto">
                    {photo
                        ? (
                            <>
                                <Row>
                                    <Col/>
                                    <Col xs="auto">
                                        <Button color="danger" onClick={() => setPhoto('')}>
                                            <TrashIcon/>
                                        </Button>
                                    </Col>
                                </Row>
                                <Form onSubmit={onSubmitPost}>
                                    <CardImg bottom width="100%" src={photo} alt="Photo to upload"/>
                                    <FormGroup>
                                        <Input
                                            type="textarea"
                                            name="caption"
                                            placeholder="Write a caption"
                                            innerRef={captionRef}
                                        />
                                    </FormGroup>
                                    <Button color="primary" disabled={isSubmitting}>Publish</Button>
                                </Form>
                            </>
                        )
                        : (
                            <h5>
                                <Button onClick={() => setIsTakingPhoto(true)}>
                                    Take
                                    {' '}
                                    <CameraIcon/>
                                </Button>
                                {' '}
                                or
                                {' '}
                                <Button>Upload</Button>
                                {' '}
                                a photo
                            </h5>
                        )}

                </Col>
                <Col/>
            </Row>
        </Container>
    );
});
