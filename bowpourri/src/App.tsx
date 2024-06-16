import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './routes/Root';
import Login from './routes/Login';
import ProtectedPage from './routes/ProtectedPage';
import AuthProvider from './context/AuthProvider';
import Trivia from './routes/Trivia';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        children: [
            {
                path: '/login',
                element: <Login />,
            },
            {
                path: '/',
                element: <ProtectedPage />,
                children: [
                    {
                        path: 'trivia',
                        element: <Trivia />,
                    },
                ],
            },
        ],
    },
]);

function App() {
    return (
        <>
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
        </>
    );
}

export default App;
