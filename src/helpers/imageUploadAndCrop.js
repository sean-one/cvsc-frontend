import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import Cropper from 'react-easy-crop';
import getCroppedImg from './getCroppedImg';

const ImageUploadCropStyles = styled.div`
    .imageUploadWrapper {
        display: flex;
        flex-direction: column;
        position: relative;
    }
    
    .imageEditWrapper {
        width: auto;
        height: 55rem;
    }
    
    .cropperWrapper {
        margin-top: 6rem;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
    
    .cropperControls {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 99;
        gap: 1rem;
    }

    .cropperControls div {
        flex-grow: 1;
    }

    .zoomWrapper {
        font-size: var(--small-font);
    }

    .slider {
        -webkit-appearance: none;
        width: 100%;
        height: 0.6rem;
        border-radius: 0.5rem;
        background: var(--main-highlight-color);
        outline: none;
        opacity: 0.7;
        -webkit-transition: .2s;
        transition: opacity .2s;   
    }

    .slider:hover {
        opacity: 1;
    }

    .slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        background: var(--main-color);
        cursor: pointer;
    }

    .slider::-moz-range-thumb {
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        background: var(--main-color);
        cursor: pointer;
    }

    .slider::-moz-range-track {
        background: var(--main-highlight-color);
        border-radius: 0.5rem;
    }

    .aspectRatioWrapper {
        font-size: var(--small-font);
        width: 5rem;
        display: flex;
        align-items: center;

        select {
            padding: 0;
            font-size: var(--small-font);
        }

        option {
            font-size: var(--small-font);
        }
    }

    #cropButton {
        height: 3.75rem;
        padding: 0.5rem;
        margin-top: 1.5rem;
        text-align: center;
        background-color: var(--main-color);
        color: var(--main-highlight-color);
        border-radius: 0.5rem;
        border: 0.1rem solid var(--main-highlight-color);
    }
`;

const ImageUploadAndCrop = ({ onImageCropped, registerInput, imageShape = 'rect', registerName }) => {
    const [imageSrc, setImageSrc] = useState(null);
    const [aspectRatio, setAspectRatio] = useState(1/1)
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

    const handleAspectChange = async (e) => {
        setAspectRatio(e.target.value);
    }

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
            <div className='imageUploadWrapper'>
                <input {...registerInput(registerName)} id={registerName} className='inputLabelInput' type="file" accept="image/*" onChange={handleFileChange} />
                {imageSrc && (
                    <div className='imageEditWrapper'>
                        <div className='cropperWrapper'>
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={imageShape === 'round' ? 1 / 1 : aspectRatio}
                                cropShape={imageShape}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        </div>
                        <div className='cropperControls'>
                            <div className='zoomWrapper'>
                                <label htmlFor="zoom">Zoom:</label>
                                <input
                                    type="range"
                                    id="zoom"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    onChange={(e) => setZoom(e.target.valueAsNumber)}
                                    className='slider'
                                />
                            </div>
                            {
                                (imageShape !== 'round') &&
                                    <div className='aspectRatioWrapper'>
                                        <label htmlFor='aspect'>Aspect:</label>
                                        <select name='aspect' id='aspect' onChange={(e) => handleAspectChange(e)}>
                                            <option value={5/4}>5/4</option>
                                            <option value={16/9}>16/9</option>
                                            <option value={1/1}>1/1</option>
                                        </select>
                                    </div>
                            }
                            <div id='cropButton' onClick={createCroppedImage}>Crop</div>
                        </div>
                    </div>
                )}
            </div>
        </ImageUploadCropStyles>
    );
};

export default ImageUploadAndCrop;