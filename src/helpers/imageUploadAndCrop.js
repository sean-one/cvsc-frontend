import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import Cropper from 'react-easy-crop';
import getCroppedImg from './getCroppedImg';

const ImageUploadCropStyles = styled.div`
    .testWrapper {
        position: relative;
        background-color: red;
    }
`;

const ImageUploadAndCrop = ({ aspect = 4 / 3, onImageCropped, registerInput }) => {
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
                    <div>
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={aspect}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                        />
                        <div>
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
                        </div>
                        <button onClick={() => createCroppedImage()}>Crop Image</button>
                    </div>
                )}
            </div>
        </ImageUploadCropStyles>
    );
};

export default ImageUploadAndCrop;