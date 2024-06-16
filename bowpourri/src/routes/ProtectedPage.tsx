import { Navigate } from 'react-router-dom';
import Layout from '../layout/DefaultLayout';
import { useAuth } from '../context/AuthProvider';

const ProtectedPage = () => {
    const { user } = useAuth();
    console.log('user at ProtectedPage: ', user);

    if (!user) {
        return <Navigate to='/login' replace />;
    }

    return <Layout />;
};

export default ProtectedPage;
