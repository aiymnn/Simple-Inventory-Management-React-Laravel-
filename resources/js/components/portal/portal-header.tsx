import { PageProps } from '@/types/global';
import { Link, router, usePage } from '@inertiajs/react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, User, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

const PortalHeader: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { auth, cartCount, orderCount } = usePage<PageProps>().props;
    const currentUrl = usePage().url;

    const navigation = [
        { name: 'Home', href: '/portal/home' },
        { name: 'Product', href: '/portal/products' },
        { name: 'About', href: '/portal/about' },
        { name: 'Contact', href: '/portal/contact' },
    ];

    const isLoggedIn = !!auth.user;
    const isAdmin = auth.user?.role === 'admin' || auth.user?.role === 'staff';

    const handleLogout = () => {
        router.post(route('logout'));
    };

    // Close profile dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setProfileDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="fixed inset-x-0 top-0 z-50 bg-white/80 shadow-sm backdrop-blur-md dark:bg-gray-900/80">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <Link href="/" className="text-2xl font-bold text-indigo-600 hover:opacity-90 dark:text-indigo-400">
                        ShopPortal
                    </Link>

                    <nav className="hidden items-center space-x-6 md:flex">
                        {navigation.map((item) => {
                            const isActive = currentUrl.startsWith(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={clsx(
                                        'relative text-sm font-medium transition',
                                        isActive
                                            ? 'text-indigo-600 dark:text-indigo-400'
                                            : 'text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400',
                                    )}
                                >
                                    {item.name}
                                    {isActive && <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-indigo-600 dark:bg-indigo-400"></span>}
                                </Link>
                            );
                        })}

                        {/* Profile Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                className="relative flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
                            >
                                <User size={18} />
                                {isLoggedIn ? auth.user.name : 'Account'}
                                {cartCount > 0 && <span className="ml-1 rounded-full bg-red-500 px-1.5 text-xs text-white">{cartCount}</span>}
                            </button>
                            {profileDropdownOpen && (
                                <div className="absolute right-0 z-50 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black/10 dark:bg-gray-800">
                                    <div className="py-1 text-sm text-gray-700 dark:text-gray-200">
                                        {isLoggedIn ? (
                                            <>
                                                {isAdmin && (
                                                    <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                        Admin Dashboard
                                                    </Link>
                                                )}
                                                <Link href="/portal/my-orders" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                    My Orders ({orderCount})
                                                </Link>
                                                <Link href="/portal/carts" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                    My Cart ({cartCount})
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
                                                >
                                                    Logout
                                                </button>
                                            </>
                                        ) : (
                                            <Link href="/login" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                Login / Sign up
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </nav>

                    <div className="md:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-gray-600 transition hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        key="mobile-menu"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        className="md:hidden"
                    >
                        <div className="space-y-2 bg-white/90 px-4 pt-2 pb-4 backdrop-blur-md dark:bg-gray-900/90">
                            {navigation.map((item) => {
                                const isActive = currentUrl.startsWith(item.href);
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={clsx(
                                            'block rounded px-3 py-2 text-sm font-medium transition-all',
                                            isActive
                                                ? 'bg-gray-100 text-indigo-600 dark:bg-gray-800 dark:text-indigo-400'
                                                : 'text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400',
                                        )}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                );
                            })}

                            {isLoggedIn ? (
                                <>
                                    {isAdmin && (
                                        <Link
                                            href="/dashboard"
                                            className="block rounded px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <Link
                                        href="/portal/my-orders"
                                        className="block rounded px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        My Orders ({orderCount})
                                    </Link>
                                    <Link
                                        href="/portal/carts"
                                        className="block rounded px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        My Cart ({cartCount})
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setMobileMenuOpen(false);
                                            handleLogout();
                                        }}
                                        className="block w-full rounded bg-red-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-red-700"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    className="block w-full rounded bg-indigo-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-indigo-700"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default PortalHeader;
