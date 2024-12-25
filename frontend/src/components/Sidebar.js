import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-gray-800 text-white fixed">
      <div className="p-4 text-2xl font-bold text-center border-b border-gray-700">
        Chess Club App
      </div>
      <nav className="p-4 space-y-4">
        <Link
          to="/"
          className="block py-2 px-4 hover:bg-gray-700 rounded"
        >
          Dashboard
        </Link>
        <Link
          to="/tournaments"
          className="block py-2 px-4 hover:bg-gray-700 rounded"
        >
          Tournaments
        </Link>
        <Link
          to="/players"
          className="block py-2 px-4 hover:bg-gray-700 rounded"
        >
          Players
        </Link>
        <Link
          to="/login"
          className="block py-2 px-4 hover:bg-gray-700 rounded"
        >
          Login
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
