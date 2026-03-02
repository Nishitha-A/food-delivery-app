import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
    const { token, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    return token ? <Outlet /> : <Navigate to="/login" />;
};

export const AdminRoute = () => {
    const { user, token, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    // Note: In a real app, 'user' object should be fetched and verified
    return (token && user?.role === 'admin') ? <Outlet /> : <Navigate to="/admin/login" />;
};
