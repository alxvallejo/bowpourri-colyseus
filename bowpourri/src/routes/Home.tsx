import { useEffect, useState } from 'react';
import { useAuth, supabase } from '../context/AuthProvider';
import { Link, Outlet } from 'react-router-dom';
import { set } from 'react-hook-form';

export default function Trivia() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);

    const getProfile = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select()
            .eq('id', user?.id);
        setProfile(data[0]);
    };

    useEffect(() => {
        if (user) {
            getProfile();
        }
    }, [user]);

    return (
        <div>
            <h1>Welcome, {profile?.name}</h1>
            <h3>Prepare for standup...</h3>
            <textarea
                className='textarea textarea-info textarea-lg w-full max-w-xs'
                placeholder='What did you do yesterday?'
            ></textarea>
            <nav>
                <Link to='trivia'>Go to trivia</Link>
            </nav>
        </div>
    );
}
