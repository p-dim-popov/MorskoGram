import React, {useState, useEffect} from 'react';
import {
    Button, Col, Container, Popover, PopoverBody, PopoverHeader, Row,
} from 'reactstrap';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {FollowViewModel, FollowTypes} from '../../../models/follows';
import {CloseCircle} from '../../icons';
import style from './style.module.css';

export const FollowsPopover = React.memo(function FollowsPopover({
    title,
    dataSource,
    type,
}) {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    /**
     * @param {FollowViewModel} fvm
     * @returns {{id: string, email: string}|FollowViewModel}
     */
    const selectBase = (fvm) => {
        switch (type) {
        case FollowTypes.followed:
            return { id: fvm.followerId, email: fvm.followerEmail };
        case FollowTypes.follower:
            return { id: fvm.followedId, email: fvm.followedEmail };
        default: return fvm;
        }
    };

    useEffect(() => {
        setIsPopoverOpen(false);
    }, [dataSource]);

    const targetId = `follow__type__${type}__button`;
    return (
        <>
            <Button id={targetId}>
                {title}
                {': '}
                {dataSource.length}
            </Button>
            <Popover
                placement="bottom"
                isOpen={isPopoverOpen}
                target={targetId}
                toggle={() => setIsPopoverOpen(!isPopoverOpen)}
            >
                <PopoverHeader>
                    <Container>
                        <Row>
                            <Col xs="auto">
                                {title}
                            </Col>
                            <Col/>
                            <Col xs="auto">
                                <CloseCircle
                                    className={style.closeButton}
                                    onClick={() => setIsPopoverOpen(false)}
                                />
                            </Col>
                        </Row>
                    </Container>
                </PopoverHeader>
                <PopoverBody>
                    <div>
                        {dataSource.map((x) => {
                            const follow = selectBase(x);
                            return (<Link key={follow.id} to={`/users/${follow.id}`}>{follow.email}</Link>);
                        })}
                    </div>
                </PopoverBody>
            </Popover>
        </>
    );
});

FollowsPopover.propTypes = {
    title: PropTypes.string.isRequired,
    dataSource: PropTypes.arrayOf(PropTypes.instanceOf(FollowViewModel)).isRequired,
    type: PropTypes.oneOf(Object.values(FollowTypes)).isRequired,
};
