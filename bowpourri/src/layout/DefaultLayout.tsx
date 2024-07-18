import { Link, Outlet } from 'react-router-dom';
import { supabase, useAuth } from '../context/AuthProvider';

import * as Colyseus from 'colyseus.js';
import { useEffect, useState } from 'react';
const client = new Colyseus.Client('ws://localhost:2567');

type Player = {
    name: string;
    score: number;
};

type PlayerScores = {
    answer: string;
    players: Player[];
    congratsTo: string;
};

export default function Layout() {
    const { user, signOut } = useAuth();
    const [profile, setProfile] = useState(null);
    const [trivia, setTrivia] = useState(null);
    const [players, setPlayers] = useState([]);
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [wheel, setWheel] = useState([]);
    const [bowpourri, setBowpourri] = useState(null);
    const [counter, setCounter] = useState(null);
    const [playerScores, setPlayerScores] = useState<PlayerScores | null>(null);

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
        if (user && profile) {
            client
                .joinOrCreate('trivia', { profile })
                .then((room) => {
                    console.log(room.sessionId, 'joined', room.name);
                    setTrivia(room);

                    room.onMessage('players', (state) => {
                        console.log('initial room state:', state);
                        setPlayers(Object.values(state));
                    });

                    room.onMessage('wheel', (state) => {
                        console.log('initial room state:', state);
                        setWheel(Object.values(state));
                    });

                    room.onMessage('currentPlayer', (state) => {
                        console.log('currentPlayer:', state);
                        setCurrentPlayer(state);
                    });

                    room.onMessage('bowpourri', (state) => {
                        console.log('bowpourri:', state);
                        setBowpourri(state);
                    });

                    room.onMessage('counter', (state) => {
                        console.log('counter:', state);
                        setCounter(state);
                    });

                    room.onMessage('playerScores', (state) => {
                        console.log('playerScores:', state);
                        setPlayerScores(state);
                    });
                })
                .catch((e) => {
                    console.log('JOIN ERROR', e);
                });
        }
    }, [user, profile]);

    return (
        <div className='flex h-full min-h-screen flex-col'>
            <div className='navbar bg-base-100 fixed px-5'>
                <div className='navbar-start'>
                    <Link to='.'>
                        <div className='font-title inline-flex text-lg text-primary transition-all duration-200 md:text-3xl'>
                            <span className='logo'>Bowst</span>{' '}
                            <span className='font-bold text-base-content ml-4'>
                                Standup
                            </span>
                        </div>
                    </Link>
                </div>
                <div className='navbar-end'>
                    <div className='flex flex-1 justify-end px-2'>
                        <div className='flex items-center'>
                            <div>{user?.name || user?.email}</div>
                            <button
                                type='submit'
                                className='rounded py-2 px-4'
                                onClick={() => signOut()}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <main className='flex h-full mt-16'>
                <div className='w-full flex-1'>
                    {/* {!socket ? `Connecting` : <Outlet context={{ socket }} />} */}
                    <div className='drawer lg:drawer-open'>
                        <input
                            id='my-drawer-2'
                            type='checkbox'
                            className='drawer-toggle'
                        />
                        <div className='drawer-content flex flex-col justify-top prose m-6'>
                            {/* Page content here */}
                            <label
                                htmlFor='my-drawer-2'
                                className='btn btn-primary drawer-button lg:hidden'
                            >
                                Open drawer
                            </label>
                            <Outlet
                                context={{
                                    trivia,
                                    bowpourri,
                                    wheel,
                                    currentPlayer,
                                    counter,
                                    playerScores,
                                }}
                            />
                        </div>
                        <div className='drawer-side'>
                            <label
                                htmlFor='my-drawer-2'
                                aria-label='close sidebar'
                                className='drawer-overlay'
                            ></label>
                            <div className='min-h-full p-4 w-80  bg-base-200 text-base-content'>
                                <ul className='menu'>
                                    {/* Sidebar content here */}
                                    <li>
                                        <Link to='/'>Home</Link>
                                    </li>
                                    <li>
                                        <Link to='/trivia'>Trivia</Link>
                                    </li>
                                    <li className='align-bottom'>
                                        <a>Sign out</a>
                                    </li>
                                </ul>

                                <div className='overflow-x-auto'>
                                    <h2 className='text-2xl font-bold text-center'>
                                        Wheel
                                    </h2>
                                    <table className='table'>
                                        {/* head */}
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {wheel.map((player, index) => (
                                                <tr key={index}>
                                                    <td>{player.name}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className='overflow-x-auto'>
                                    <h2 className='text-2xl font-bold text-center'>
                                        Scoreboard
                                    </h2>
                                    <table className='table'>
                                        {/* head */}
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Score</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {players.map((player, index) => (
                                                <tr key={index}>
                                                    <td>{player.name}</td>
                                                    <td>{player.score}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
