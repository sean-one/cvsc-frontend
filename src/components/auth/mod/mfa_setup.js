import React, { useState } from 'react';
import AxiosInstance from '../../../helpers/axios';

const MFASetUp = () => {
    const [ qrCodeUrl, setQrCodeUrl ] = useState('')
    const [ token, setToken ] = useState('');

    const handleGenerateMFA = async () => {
        try {
            const response = await AxiosInstance.get('/auth/generate-mfa');
            setQrCodeUrl(response.data.qrCodeUrl);
        } catch (error) {
            console.error('Error generating MFA: ', error)
        }
    }

    const handleVerifyToken = async () => {
        try {
            const response = await AxiosInstance.post('/auth/verify-mfa', { tempToken: token });
            alert(response.data);
        } catch (error) {
            console.error('Error verifying token: ', error)
            alert('Failed to verify MFA token');
        }
    }

    return (
        <div>
            <button onClick={handleGenerateMFA}>Generate MFA</button>
            {
                qrCodeUrl &&
                    <div>
                        <img src={qrCodeUrl} alt='scan this qr code with your MFA app' />
                        <input
                            type='text'
                            value={token}
                            onChange={e => setToken(e.target.value)}
                            placeholder='Enter the code from your app'
                        />
                        <button onClick={handleVerifyToken}>Verify Token</button>
                    </div>
            }
        </div>
    );
};

export default MFASetUp;