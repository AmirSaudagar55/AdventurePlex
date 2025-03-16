import { Menu, X, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from '../slices/userSlice';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Categories', href: '/categories' },
  { name: 'Book Now', href: '/book' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();

  const { loginWithRedirect, logout, user: auth0User, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (isAuthenticated && auth0User) {
      dispatch(setUser(auth0User));
    } else {
      dispatch(clearUser());
    }
  }, [isAuthenticated, auth0User, dispatch]);

  const storedUser = useSelector((state) => state.user.user);

  return (
    <header className="bg-white shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-indigo-600">
              <Activity className="h-8 w-8" />
              <span>AdventurePlex</span>
            </Link>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium ${location.pathname === item.href ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          {isAuthenticated && storedUser ? (
            <div className="relative">
              <button onClick={() => setProfileMenuOpen((prev) => !prev)} className="flex items-center focus:outline-none">
                <img src={storedUser.picture} alt={storedUser.name} className="w-8 h-8 rounded-full" />
              </button>
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-10">
                  <div className="py-2">
                    <span className="block px-4 py-2 text-sm text-gray-700">{storedUser.name}</span>
                    <button
                      onClick={() => logout({ returnTo: window.location.origin })}
                      className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex md:items-center space-x-4">
              <button onClick={() => loginWithRedirect()} className="text-sm font-medium text-gray-500 hover:text-gray-900">
                Login / Sign Up
              </button>
            </div>
          )}
          <div className="md:hidden">
            <button type="button" className="text-gray-400 hover:text-gray-500" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 text-base font-medium ${location.pathname === item.href ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {!isAuthenticated ? (
                <button onClick={() => { loginWithRedirect(); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900">
                  Login / Sign Up
                </button>
              ) : (
                <button onClick={() => { logout({ returnTo: window.location.origin }); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-base font-medium text-red-500 hover:bg-gray-50 hover:text-red-700">
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
