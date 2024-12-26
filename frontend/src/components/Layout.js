import React from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ children, logout }) => {
  return (
    <div className="flex">
      <nav className="bg-gray-800 text-white w-64 h-screen p-4">
        <h2 className="text-xl font-bold mb-4">Chess Club</h2>
        <ul className="space-y-2">
          <li>
            <Link to="/tournaments" className="hover:text-gray-400">Tournaments</Link>
          </li>
          <li>
            <Link to="/players" className="hover:text-gray-400">Players</Link>
          </li>
        </ul>
        <button
          onClick={logout}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </nav>
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
};

export default Layout;
