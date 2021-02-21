import React from 'react';
import {
    Button, Card, CardBody, CardSubtitle, CardText, CardTitle,
} from 'reactstrap';
import PropTypes from 'prop-types';
import {utcToLocal} from '../../../utils/dateTimeHelper';
import {CommentViewModel} from '../../../models/comments';

export const Comment = React.memo(function Comment({
    dataSource,
}) {
    return (
        <Card className="my-3">
            <CardBody>
                <CardTitle tag="h6">{dataSource.creatorEmail}</CardTitle>
                <CardSubtitle tag="h6" className="mb-2 text-muted">
                    at
                    {' '}
                    {utcToLocal(dataSource.createdOn)}
                </CardSubtitle>
                <CardText>{dataSource.content}</CardText>
            </CardBody>
        </Card>
    );
});

Comment.propTypes = {
    dataSource: PropTypes.oneOfType([
        PropTypes.instanceOf(CommentViewModel),
    ]).isRequired,
};
