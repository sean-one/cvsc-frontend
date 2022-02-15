import { useState, useRef, useEffect } from 'react';

const useImagePreviewer = () => {
    const [editImage, setEditImage] = useState(false)
    const [imageToUpload, setImageToUpload] = useState()
    const canvas = useRef(null)

    const imagePreview = (event) => {
        setEditImage(true)
        let fileToUpload = event.target.files
        let reader = new FileReader()
        const previewImage = new Image()
        reader.onload = function (e) {
            previewImage.src = e.target.result
            previewImage.onload = () => setImageToUpload(previewImage)
        }
        reader.readAsDataURL(fileToUpload[0])
    }

    useEffect(() => {
        let mounted = true
        if (mounted) {
            if (imageToUpload && canvas) {
                const ctx = canvas.current.getContext('2d')
                const MAX_WIDTH = canvas.current.width
                const MAX_HEIGHT = canvas.current.height
                let width = imageToUpload.width
                let height = imageToUpload.height


                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width
                    width = MAX_WIDTH
                } else if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height
                    height = MAX_HEIGHT
                } else {
                    if (width > height) {
                        width = MAX_WIDTH
                        height *= width / MAX_WIDTH
                    } else {
                        height *= MAX_WIDTH / width
                        width = MAX_WIDTH
                    }
                }

                // crop canvas to the size of the drawing
                canvas.current.width = width
                canvas.current.height = height

                ctx.clearRect(0, 0, canvas.current.width, canvas.current.height)

                ctx.drawImage(imageToUpload, (canvas.current.width / 2) - (width / 2), (canvas.current.height / 2) - (height / 2), width, height)
            }
        }

        return () => {
            mounted = false
        }
    }, [imageToUpload, canvas])

    return { editImage, imagePreview, imageToUpload, canvas }
}

export default useImagePreviewer;