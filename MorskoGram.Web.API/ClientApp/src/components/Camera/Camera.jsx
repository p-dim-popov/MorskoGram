import React, {useRef, useState, useCallback} from 'react';
import PropTypes from 'prop-types';
import Webcam from 'react-webcam';
import {
    Button, CardImg,
} from 'reactstrap';
import {CameraIcon, ApproveIcon, BackIcon} from '../icons';
import style from './style.module.css';

export const Camera = React.memo(({
    onApprove,
    onBack,
}) => {
    const cameraRef = useRef(null);
    const [photo, setPhoto] = useState(null);

    const onClickTake = useCallback(
        () => setPhoto(cameraRef.current?.getScreenshot()), [cameraRef, setPhoto],
    );

    return (
        <div className={style.kiosk}>
            <div className={style.container}>
                <Button color="secondary" onClick={onBack}>Back</Button>
                {photo
                    ? <CardImg className={style.img} src={photo} alt="Taken photo"/>
                    : (
                        <Webcam
                            ref={cameraRef}
                            audio={false}
                            mirrored
                            screenshotQuality={1}
                            screenshotFormat="image/jpeg"
                        />
                    )}
                {photo
                    ? (
                        <div className={style.bottomButtons}>
                            <Button color="danger" onClick={() => setPhoto(null)}>
                                <BackIcon/>
                            </Button>
                            <Button color="primary" onClick={() => onApprove(photo)}>
                                <ApproveIcon/>
                            </Button>
                        </div>
                    )
                    : <Button onClick={onClickTake}><CameraIcon/></Button>}
            </div>
        </div>
    );
});

Camera.propTypes = {
    onApprove: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
};
