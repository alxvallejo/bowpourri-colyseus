import { useEffect, useState } from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './routes/Root';
import { createClient } from '@supabase/supabase-js';
import Login from './routes/Login';

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

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
                path: '',
            },
        ],
    },
]);

function App() {
    const [session, setSession] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}

export default App;
