import { useState } from 'react';
import AxiosInstance from '../helpers/axios';


const useImageUploader = () => {
    const [ imageUrl, setImageUrl ] = useState()

    const getImageUrl = async (canvas) => {
        // console.log(canvas)
        await canvas.current.toBlob(async function (blob) {
    
            const token = localStorage.getItem('token')
        
            const url = await AxiosInstance.get('/s3', {
                headers: { 'Authorization': 'Bearer ' + token }
            })
                .then(response => {
                    return response.data.url
                })
                .catch(err => console.log(err))
            
            await AxiosInstance.put(url, blob, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
        
            setImageUrl(url.split('?')[0])
            // return imageUrl
        })

    }

    return { imageUrl, getImageUrl }
    
}

export default useImageUploader;