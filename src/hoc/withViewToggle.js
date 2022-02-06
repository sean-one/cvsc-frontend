import React, { useState } from 'react';

export const withViewToggle = WrappedComponent => props => {
    const [viewable, setViewable] = useState(false)

    const toggleViewable = () => {
        setViewable(!viewable)
    }

    return <WrappedComponent {...props} viewable={viewable} toggleView={toggleViewable} />
}