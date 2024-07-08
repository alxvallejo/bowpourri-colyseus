import { useEffect, useState } from 'react';
import { useAuth, supabase } from '../context/AuthProvider';
import { Link, Outlet } from 'react-router-dom';

export default function Trivia() {
    const { user } = useAuth();

    return (
        <div>
            <h1>Trivia</h1>
            <nav>
                <Link to='new'>New Question</Link>
            </nav>
            <Outlet />
        </div>
    );
}
