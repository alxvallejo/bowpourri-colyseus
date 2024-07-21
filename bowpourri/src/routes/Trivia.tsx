import { useEffect, useState } from 'react';
import { useAuth, supabase } from '../context/AuthProvider';
import { Link, Outlet, useOutletContext } from 'react-router-dom';

export default function Trivia() {
    const context = useOutletContext();
    return (
        <div>
            <h1>Trivia Questions</h1>
            <nav>
                <Link to='new'>New Question</Link>
            </nav>
            <Outlet context={context} />
        </div>
    );
}
