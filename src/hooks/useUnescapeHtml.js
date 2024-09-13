import { useState, useEffect } from 'react';

const useUnescapeHtml = (escapedString) => {
    const [ unescaped, setUnescaped ] = useState('');

    useEffect(() => {
        if (escapedString) {
            const doc = new DOMParser().parseFromString(escapedString, 'text/html');
            setUnescaped(doc.documentElement.textContent);
        }
    }, [escapedString])

    return unescaped;
}

export default useUnescapeHtml;