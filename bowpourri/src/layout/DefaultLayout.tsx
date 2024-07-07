import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

export default function Layout() {
    const { user, signOut } = useAuth();

    return (
        <div className='flex h-full min-h-screen flex-col'>
            <div className='navbar bg-base-100 fixed px-5'>
                <div className='navbar-start'>
                    <Link to='.'>
                        <div className='font-title inline-flex text-lg text-primary transition-all duration-200 md:text-3xl'>
                            <span className='lowercase'>Bowst</span>{' '}
                            <span className='font-bold text-base-content'>
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
                            <Outlet />
                        </div>
                        <div className='drawer-side'>
                            <label
                                htmlFor='my-drawer-2'
                                aria-label='close sidebar'
                                className='drawer-overlay'
                            ></label>
                            <ul className='menu p-4 w-80 min-h-full bg-base-200 text-base-content'>
                                {/* Sidebar content here */}
                                <li>
                                    <Link to='/trivia'>Trivia</Link>
                                </li>
                                <li>
                                    <a>Sidebar Item 2</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
