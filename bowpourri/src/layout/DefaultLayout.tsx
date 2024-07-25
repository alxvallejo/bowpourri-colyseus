import { Link, Outlet } from 'react-router-dom';
import { supabase, useAuth } from '../context/AuthProvider';

import * as Colyseus from 'colyseus.js';
import { useEffect, useState } from 'react';
import { ThemeSwitch } from './ThemeSwitch';
import { helloWorld } from '../services/game';
const socketUrl = import.meta.env.VITE_COLYSEUS_ENDPOINT;
console.log('socketUrl: ', socketUrl);
const client = new Colyseus.Client(socketUrl || 'ws://localhost:2567');

export type PlayerData = {
    id: string;
    name: string;
    score: number;
    joined_at: string;
    email: string;
    isCorrect: boolean;
    answered: string;
};

type Player = {
    name: string;
    score: number;
};

type PlayerScores = {
    answer: string;
    answerDescription: string;
    answerImageUrl: string;
    players: Player[];
    congratsTo: string[];
};

type Question = {
    id: string;
    answered_on: string;
    question: string;
    topic: string;
    option_1: string;
    option_2: string;
    option_3: string;
    option_4: string;
    created_at: string;
    email: string;
    answer: string;
    description: string;
    image_url: string;
};

export type TriviaContext = {
    trivia: Colyseus.Room;
    players: PlayerData[];
    bowpourri: Question | null;
    wheel: PlayerData[];
    currentPlayer: PlayerData;
    counter: number | null;
    playerScores: PlayerScores | null;
    refreshStats: () => void;
};

export default function Layout() {
    const { user, signOut } = useAuth();
    const [profile, setProfile] = useState(null);
    const [trivia, setTrivia] = useState(null);
    const [players, setPlayers] = useState<PlayerData[]>([]);
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [wheel, setWheel] = useState([]);
    const [bowpourri, setBowpourri] = useState(null);
    const [counter, setCounter] = useState<number | null>(null);
    const [playerScores, setPlayerScores] = useState<PlayerScores | null>(null);
    const [totalCount, setTotalCount] = useState(0);
    const [popularTopics, setPopularTopics] = useState([]);

    const getProfile = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select()
            .eq('id', user?.id);
        setProfile(data[0]);
    };

    const getTriviaStats = async () => {
        const countResp = await supabase
            .from('trivia_questions')
            .select('*', { count: 'exact', head: true })
            .is('answered_on', null);
        console.log('total questions: ', countResp.count);

        setTotalCount(countResp.count);

        const popularResp = await supabase
            .from('topics')
            .select('name, topic_count')
            .order('topic_count', { ascending: true });

        console.log('popular topics: ', popularResp.data);
        setPopularTopics(popularResp.data);
    };

    const refreshTriviaStats = async () => {
        if (trivia) {
            trivia.send('refreshTriviaStats');
        }
    };

    useEffect(() => {
        if (user && !profile) {
            getProfile();
            getTriviaStats();
        }
        if (user && profile) {
            helloWorld();
            client
                .joinOrCreate('trivia', { profile })
                .then((room) => {
                    console.log(room.sessionId, 'joined', room.name);
                    setTrivia(room);

                    room.onMessage('players', (state) => {
                        setPlayers(Object.values(state));
                    });

                    room.onMessage('wheel', (state) => {
                        setWheel(Object.values(state));
                    });

                    room.onMessage('currentPlayer', (state) => {
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

                    room.onMessage('triviaStats', (state) => {
                        console.log('triviaStats:', state);
                        setTotalCount(state.total_count);
                        setPopularTopics(state.popular_topics);
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
                            <ThemeSwitch />
                            <div className='ml-4'>
                                {user?.name || user?.email}
                            </div>
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
                                    players,
                                    bowpourri,
                                    wheel,
                                    currentPlayer,
                                    counter,
                                    playerScores,
                                    refreshStats: refreshTriviaStats,
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
                                        <Link to='/questions'>Questions</Link>
                                    </li>
                                </ul>

                                <div className='overflow-x-auto'>
                                    <h2 className='text-xl text-center'>
                                        Wheel
                                    </h2>
                                    <table className='table table-sm'>
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
                                    <h2 className='text-xl text-center'>
                                        Scoreboard
                                    </h2>
                                    <table className='table table-sm'>
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

                                <div className='overflow-x-auto'>
                                    <h2 className='text-xl text-center'>
                                        Topics
                                    </h2>
                                    <table className='table table-sm'>
                                        {/* head */}
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Count</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {popularTopics.map(
                                                (topic, index) => (
                                                    <tr key={index}>
                                                        <td>{topic.name}</td>
                                                        <td>
                                                            {topic.topic_count}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className='overflow-x-auto'>
                                    <div className='stats shadow'>
                                        <div className='stat place-items-center'>
                                            <div className='stat-title'>
                                                Questions in the Queue
                                            </div>
                                            <div className='stat-value'>
                                                {totalCount}
                                            </div>
                                        </div>

                                        {/* <div className='stat'>
                                            <div className='stat-title'>
                                                Most Popular
                                            </div>
                                            <div className='stat-value'>
                                                4,200
                                            </div>
                                        </div> */}

                                        {/* <div className='stat'>
                                            <div className='stat-title'>
                                                Most Submitted
                                            </div>
                                            <div className='stat-value'>
                                                1,200
                                            </div>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
