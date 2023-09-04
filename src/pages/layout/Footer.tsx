import React from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  return (
    <div
      style={
        location?.pathname == '/home' ||
        location?.pathname == '/login' ||
        location?.pathname == '/question'
          ? { display: 'none' }
          : {}
      }
    >
      <footer className="text-white body-font bg-header">
        <div className="container px-5 py-8 mx-auto flex  sm:flex-row flex-col justify-between h-8 items-center">
          <p className="text-sm text-white sm:ml-4 sm:pl-4  sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
            © 2012-2023 Lasso |
            <Link
              to=""
              className="text-white ml-1"
              rel="noopener noreferrer"
              target="_blank"
            >
              {' '}
              <Link to="" className="underline text-link">
                LAA Privacy Policy{' '}
              </Link>
            </Link>
            <div>
              <p>Version 2.0.0</p> <p>Released Date: 03:08:2023</p>
            </div>
          </p>
          <div className="text-red font-bold"></div>
        </div>
      </footer>{' '}
    </div>
  );
};

export default Footer;
