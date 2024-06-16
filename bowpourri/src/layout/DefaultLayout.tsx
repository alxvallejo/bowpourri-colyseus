import { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

export default function Layout() {
    const { user, signOut } = useAuth();

    return (
        <div className='flex h-full min-h-screen flex-col'>
            <div className='navbar bg-base-100 fixed px-5'>
                {/* <div className='navbar-start invisible md:visible'>
          <div className='dropdown'>
            <label tabIndex={0} className='btn-ghost btn-circle btn'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M4 6h16M4 12h16M4 18h7'
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className='dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow'
            >
              <li>
                <Link to='/categories'>Categories</Link>
              </li>
              <li>
                <Link to='/questions'>Questions</Link>
              </li>
              <li>
                <Link to='/notes'>Notes</Link>
              </li>
              <li>
                <Link to='/trivia'>Trivia</Link>
              </li>
            </ul>
          </div>
        </div> */}
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
                {/* <div className="flex-1 px-2 lg:flex-none">
          <h1 className="text-3xl">
            <Link to=".">
              <div className="font-title inline-flex text-lg text-primary transition-all duration-200 md:text-3xl">
                <span className="lowercase">Bowst</span>{" "}
                <span className="font-bold text-base-content">Standup</span>
              </div>
            </Link>
          </h1>
        </div> */}
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

            <main className='flex h-full md:mt-32 mt-16'>
                <div className='w-full flex-1 p-6'>
                    {/* {!socket ? `Connecting` : <Outlet context={{ socket }} />} */}
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
