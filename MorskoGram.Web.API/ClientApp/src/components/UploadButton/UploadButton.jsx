import React from 'react';
import {Button} from 'reactstrap';
import PropTypes from 'prop-types';

export const UploadButton = React.memo(function UploadButton({
    onUpload,
}) { // Create a reference to the hidden file input element
    const inputRef = React.useRef(null);

    const handleClick = () => {
        inputRef.current.click();
    };

    const onChange = (event) => {
        onUpload(event.target.files[0]);
    };
    return (
        <>
            <Button onClick={handleClick}>
                Upload a file
            </Button>
            <input
                type="file"
                ref={inputRef}
                onChange={onChange}
                style={{display: 'none'}}
            />
        </>
    );
});

UploadButton.propTypes = {
    onUpload: PropTypes.func.isRequired,
};
