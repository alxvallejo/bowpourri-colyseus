import { useEffect, useState } from 'react';
import { useAuth, supabase } from '../context/AuthProvider';
import { Link, Outlet, useOutletContext } from 'react-router-dom';
import { set } from 'react-hook-form';

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export default function Trivia() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const { trivia, bowpourri, wheel, currentPlayer } = useOutletContext();
    const [spun, setSpun] = useState(false);
    const [options, setOptions] = useState([]);

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

    useEffect(() => {
        if (bowpourri) {
            // combine options and randomize
            const opts = [
                bowpourri.option_1,
                bowpourri.option_2,
                bowpourri.option_3,
                bowpourri.option_4,
            ];
            // shuffle
            const shuffled = shuffleArray(opts);
            setOptions(shuffled);
        }
    }, [bowpourri]);

    const spinWheel = () => {
        if (spun) return;
        console.log('spinning wheel');
        trivia.send('spin');
        setSpun(true);
    };

    const yourTurn = currentPlayer?.email === profile?.email;
    console.log('yourTurn: ', yourTurn);

    console.log('bowpourri: ', bowpourri);

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

            {bowpourri ? (
                <div className='shadow p-4'>
                    <h2>Bowpourri</h2>
                    <p>{bowpourri.question}</p>
                    <ul>
                        {options.map((option, i) => (
                            <li key={i}>{option}</li>
                        ))}
                    </ul>
                </div>
            ) : yourTurn ? (
                <div className='flex flex-col'>
                    <div className='stats shadow'>
                        <div className='stat'>
                            <div className='stat-title'>Guess what ...</div>
                            <div className='stat-value'>You're next!</div>
                            <div className='stat-desc'></div>
                        </div>
                    </div>
                    {!spun && (
                        <button className='btn btn-primary' onClick={spinWheel}>
                            Spin the wheel
                        </button>
                    )}
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
