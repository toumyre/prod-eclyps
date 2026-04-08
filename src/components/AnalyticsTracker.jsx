import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const SITE_ID = import.meta.env.VITE_SITE_ID || '2';

export default function AnalyticsTracker() {
    const location = useLocation();

    useEffect(() => {
        const trackVisit = async () => {
            try {
                await fetch(`${API_URL}/analytics/visit`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-site-id': SITE_ID
                    },
                    body: JSON.stringify({
                        path: location.pathname
                    })
                });
            } catch (error) {
                console.error('Failed to track page view:', error);
            }
        };

        trackVisit();
    }, [location.pathname]);

    return null; // Component does not render anything
}
