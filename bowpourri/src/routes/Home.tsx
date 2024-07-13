import { useEffect, useState } from 'react';
import { useAuth, supabase } from '../context/AuthProvider';
import { Link, Outlet, useOutletContext } from 'react-router-dom';
import { set } from 'react-hook-form';

export default function Trivia() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const { trivia } = useOutletContext();

    const getProfile = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select()
            .eq('id', user?.id);
        setProfile(data[0]);
    };

    useEffect(() => {
        if (user && !profile) {
            getProfile();
        }
    }, [user, profile]);

    const currentPlayer = trivia?.state?.currentPlayer;
    console.log('currentPlayer: ', currentPlayer);

    const yourTurn = currentPlayer?.email === profile?.email;
    console.log('yourTurn: ', yourTurn);

    return (
        <div>
            <h1>Welcome, {profile?.name}</h1>
            {!yourTurn && <h3>Prepare for standup...</h3>}

            <textarea
                className='textarea textarea-info textarea-lg w-full max-w-xs'
                placeholder='What did you do yesterday?'
            ></textarea>
            <nav>
                <Link to='trivia'>Add a trivia question!</Link>
            </nav>

            {yourTurn ? (
                <div className='stats shadow'>
                    <div className='stat'>
                        <div className='stat-title'>Guess what ...</div>
                        <div className='stat-value'>You're next!</div>
                        <div className='stat-desc'></div>
                    </div>
                </div>
            ) : (
                <div className='stats shadow'>
                    <div className='stat'>
                        <div className='stat-title'>Next:</div>
                        <div className='stat-value'>{currentPlayer?.name}</div>
                        <div className='stat-desc'></div>
                    </div>
                </div>
            )}
        </div>
    );
}
