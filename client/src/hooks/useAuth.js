import { useState, useEffect } from 'react';
import { studentService } from '../services/api';

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading, true/false = status
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            await studentService.getProfile();
            setIsAuthenticated(true);
            setError(null);
        } catch (error) {
            console.error('Auth check failed:', error.message);
            setIsAuthenticated(false);
            if (error.message === 'Request timeout') {
                setError('Server is waking up, please refresh in a moment...');
            }
        } finally {
            setLoading(false);
        }
    };

    return { isAuthenticated, loading, error };
};
