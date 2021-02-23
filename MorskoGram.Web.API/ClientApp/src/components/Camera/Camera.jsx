import React, {useRef, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Webcam from 'react-webcam';
import {Button} from 'reactstrap';
import {CameraIcon, ApproveIcon, AgainIcon} from '../icons';
import style from './style.module.css';

export const Camera = React.memo(({
    onApprove,
    onBack,
}) => {
    const cameraRef = useRef(null);
    const [photo, setPhoto] = useState(null);

    const onClickTake = () => {
        setPhoto(cameraRef.current?.getScreenshot());
    };

    useEffect(() => {
        if (cameraRef.current?.video) {
            if (photo) {
                cameraRef.current.video.pause();
            } else {
                cameraRef.current.video.play();
            }
        }
    }, [photo, cameraRef]);

    return (
        <div className={style.kiosk}>
            <div className={style.container}>
                <Button color="secondary" onClick={onBack}>Back</Button>
                <Webcam
                    ref={cameraRef}
                    audio={false}
                    mirrored
                    screenshotQuality={1}
                    screenshotFormat="image/jpeg"
                />
                {photo
                    ? (
                        <div className={style.bottomButtons}>
                            <Button color="danger" onClick={() => setPhoto(null)}>
                                <AgainIcon/>
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
