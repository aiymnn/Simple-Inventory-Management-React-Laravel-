import { ChevronDown, ChevronUp, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import React, { useState } from 'react';

const PortalFooter: React.FC = () => {
    const [openSection, setOpenSection] = useState<string | null>(null);

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    const footerSections = [
        {
            id: 'company',
            title: 'Company',
            links: [
                { name: 'About Us', href: '/about' },
                { name: 'Careers', href: '/careers' },
                { name: 'Press', href: '/press' },
                { name: 'Blog', href: '/blog' },
            ],
        },
        {
            id: 'support',
            title: 'Support',
            links: [
                { name: 'Help Center', href: '/help-center' },
                { name: 'Contact Us', href: '/contact' },
                { name: 'Shipping & Returns', href: '/shipping' },
                { name: 'FAQ', href: '/faq' },
            ],
        },
        {
            id: 'legal',
            title: 'Legal',
            links: [
                { name: 'Privacy Policy', href: '/privacy' },
                { name: 'Terms of Service', href: '/terms' },
                { name: 'Cookie Policy', href: '/cookie-policy' },
            ],
        },
    ];

    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
                <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 md:grid-cols-4 md:gap-x-12">
                    {footerSections.map((section) => (
                        <section key={section.id}>
                            <h3>
                                <button
                                    type="button"
                                    aria-expanded={openSection === section.id}
                                    onClick={() => toggleSection(section.id)}
                                    className="flex w-full items-center justify-between text-base font-semibold text-white md:pointer-events-none md:block md:cursor-default"
                                >
                                    {section.title}
                                    <span className="md:hidden">
                                        {openSection === section.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                    </span>
                                </button>
                            </h3>
                            <ul
                                className={`mt-4 space-y-3 overflow-hidden transition-all duration-300 ease-in-out md:mt-6 ${
                                    openSection === section.id ? 'max-h-96' : 'max-h-0 md:max-h-full'
                                } ${openSection === section.id || 'md:block' ? 'block' : 'hidden'}`}
                            >
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href={link.href}
                                            className="block text-sm text-gray-300 transition hover:text-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ))}

                    {/* Social + Subscribe */}
                    <section>
                        <h3 className="text-base font-semibold text-white md:mb-6">Stay Connected</h3>

                        <div className="mb-6 flex space-x-4 md:mb-10">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
                                <a
                                    key={idx}
                                    href="#"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-full bg-gray-800 p-2 text-gray-300 transition hover:bg-indigo-600 hover:text-white"
                                >
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>

                        <form className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                            <label htmlFor="newsletter-email" className="sr-only">
                                Email address
                            </label>
                            <input
                                type="email"
                                id="newsletter-email"
                                placeholder="Your email address"
                                required
                                className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-3 text-gray-200 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="mt-3 rounded-md bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:mt-0"
                            >
                                Subscribe
                            </button>
                        </form>
                    </section>
                </div>

                <div className="mt-12 border-t border-gray-700 pt-6 text-center text-sm text-gray-500 select-none">
                    &copy; {new Date().getFullYear()} ShopPortal. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default PortalFooter;
