import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './routes/Root';
import Login from './routes/Login';
import ProtectedPage from './routes/ProtectedPage';
import AuthProvider from './context/AuthProvider';
import Trivia from './routes/Trivia';
import NewQuestion from './routes/trivia/NewQuestion';
import Questions from './routes/trivia/Questions';
import Home from './routes/Home';

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
                        path: '/',
                        element: <Home />,
                    },
                    {
                        path: 'trivia',
                        element: <Trivia />,
                        children: [
                            {
                                path: '',
                                element: <Questions />,
                            },
                            {
                                path: 'edit/:id',
                                element: <NewQuestion />,
                            },
                            {
                                path: 'new',
                                element: <NewQuestion />,
                            },
                        ],
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
