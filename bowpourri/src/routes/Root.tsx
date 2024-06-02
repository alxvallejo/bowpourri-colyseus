import { Outlet, Link } from 'react-router-dom';

export default function Root() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/about'>About</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
}
