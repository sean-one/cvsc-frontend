export const setImageForForm = (imageCanvas) => {
    console.log(imageCanvas)
    try {
        let canvas_image = imageCanvas.current.toDataURL("image/webp", 1.0)
    
        let [mime, image_data] = canvas_image.split(',')
        mime = mime.match(/:(.*?);/)[1]
    
        let data_string = atob(image_data)
        let data_length = data_string.length
        let image_array = new Uint8Array(data_length)
    
        while(data_length--) { image_array[data_length] = data_string.charCodeAt(data_length) }
    
        return new File([image_array], 'imageToSave.jpeg', { type: mime })

    } catch (error) {

        console.log('an error occurred while setting image for form', error)

        return null
    }
}