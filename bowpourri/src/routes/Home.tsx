import { useEffect, useState } from 'react';
import { useAuth, supabase } from '../context/AuthProvider';
import { Link, Outlet, useOutletContext } from 'react-router-dom';
import { set } from 'react-hook-form';
import { TriviaContext } from '../layout/DefaultLayout';

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
    const { trivia, bowpourri, wheel, currentPlayer, counter, playerScores } =
        useOutletContext<TriviaContext | null>();
    const [spun, setSpun] = useState(false);
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);

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

    useEffect(() => {
        if (selectedOption) {
            console.log('sending answer: ', selectedOption);
            trivia.send('answer', selectedOption);
        }
    }, [selectedOption, trivia]);

    const spinWheel = () => {
        if (spun) return;
        console.log('spinning wheel');
        trivia.send('spin');
        setSpun(true);
    };

    const yourTurn = currentPlayer?.email === profile?.email;
    console.log('yourTurn: ', yourTurn);

    console.log('bowpourri: ', bowpourri);

    console.log('playerScores?.congratsTo', playerScores?.congratsTo);

    return (
        <div>
            <h4>Welcome, {profile?.name}</h4>
            {!yourTurn && <h3>Prepare for standup...</h3>}

            <div className='flex w-auto'>
                <textarea
                    className='textarea textarea-info textarea-lg w-full max-w-xs'
                    placeholder='What did you do yesterday?'
                ></textarea>
            </div>
            <nav>
                <Link to='trivia'>Add a trivia question!</Link>
            </nav>

            {bowpourri ? (
                <div className='shadow p-4'>
                    <h2>Bowpourri</h2>
                    <p>{bowpourri.question}</p>
                    <ul className='flex flex-col'>
                        {options.map((option, i) => {
                            const selected = selectedOption === option;
                            const classname = selected
                                ? 'btn btn-active btn-accent'
                                : 'btn btn-outline btn-accent';
                            return (
                                <button
                                    className={`mb-4 ${classname}`}
                                    key={i}
                                    onClick={() => setSelectedOption(option)}
                                    disabled={!!playerScores}
                                >
                                    {option}
                                </button>
                            );
                        })}
                    </ul>
                    {counter && <h1>{counter}</h1>}
                    {playerScores?.answer && (
                        <div>
                            <h2 className='btn btn-accent'>
                                {playerScores?.answer === selectedOption
                                    ? `Correct!`
                                    : `Incorrect!`}
                            </h2>
                            <p>
                                Correct Answer: {playerScores?.answer} -{' '}
                                {playerScores?.answerDescription}
                            </p>
                        </div>
                    )}
                    {playerScores?.congratsTo && (
                        <h2>
                            Congrats to{' '}
                            {playerScores?.congratsTo.length > 0
                                ? playerScores?.congratsTo.join(', ')
                                : `no one`}
                            !
                        </h2>
                    )}
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
