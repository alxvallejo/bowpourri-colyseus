import { Navigate } from 'react-router-dom';
import Layout from '~/layout/DefaultLayout';
import { useAuth } from '~/context/AuthProvider';

const ProtectedPage = () => {
    const { user, expiry, signOut } = useAuth();
    if (!user || !expiry) {
        signOut();
        return <Navigate to='/login' replace />;
    }

    if (expiry && new Date(expiry) < new Date()) {
        signOut();
        return <Navigate to='/login' replace />;
    }

    return <Layout />;
};

export default ProtectedPage;
