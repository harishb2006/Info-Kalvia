import { useState, useEffect } from 'react';
import { studentService } from '../services/api';

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading, true/false = status
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            await studentService.getProfile();
            setIsAuthenticated(true);
        } catch (error) {
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    return { isAuthenticated, loading };
};
