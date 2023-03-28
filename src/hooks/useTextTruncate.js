import { useState, useEffect } from 'react';

const useTextTruncate = (str, maxLength) => {
  const [truncatedStr, setTruncatedStr] = useState(str);

  useEffect(() => {

    if (str.length > maxLength) {
      
        setTruncatedStr(str.substring(0, maxLength) + '...');

    } else {

        setTruncatedStr(str);
    }
    
  }, [str, maxLength]);

  return truncatedStr;
}

export default useTextTruncate;