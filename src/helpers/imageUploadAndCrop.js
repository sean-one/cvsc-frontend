import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import Cropper from 'react-easy-crop';
import getCroppedImg from './getCroppedImg';

const ImageUploadCropStyles = styled.div`
    .testWrapper {
        /* width: 100%; */
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        /* border: 0.1rem solid yellow; */
    }
    
    .testSection {
        width: 100%;
        position: relative;
        height: 35rem;
        border: 0.1rem solid blue;
    }
    
    .testControls {
        width: 100%;
        position: relative;
        z-index: 99;
        border: 0.1rem solid red;
    }

    /* .cropImageButton {
        border: 0.1rem solid var(--main-highlight-color);
        border-radius: 0.15rem;
        background-color: var(--main-color);
    } */
`;

const ImageUploadAndCrop = ({ aspect = 4 / 4, onImageCropped, registerInput }) => {
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const handleFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setImageSrc(reader.result);
            };
        }
    };

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const createCroppedImage = async () => {
        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);

            if (onImageCropped) {
                onImageCropped(croppedImage);
                setImageSrc(null);
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <ImageUploadCropStyles>
            <div className='testWrapper'>
                <input {...registerInput('avatar')} id='avatar' className='inputLabelInput' type="file" accept="image/*" onChange={handleFileChange} />
                {imageSrc && (
                    <div className='testSection'>
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={aspect}
                            cropShape='round'
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                        />
                        <div className='testControls'>
                            <label htmlFor="zoom">Zoom:</label>
                            <input
                                type="range"
                                id="zoom"
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                onChange={(e) => setZoom(e.target.valueAsNumber)}
                            />
                            <div onClick={createCroppedImage}>Crop Image</div>
                        </div>
                    </div>
                )}
            </div>
        </ImageUploadCropStyles>
    );
};

export default ImageUploadAndCrop;