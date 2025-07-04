import PortalLayout from '@/layouts/portal-layout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, User } from 'lucide-react';
import React from 'react';

const Contact: React.FC = () => {
    return (
        <PortalLayout>
            <Head>
                <title>Contact Us | MyStore</title>
                <meta name="description" content="Get in touch with the MyStore team for product inquiries, support, or partnership opportunities." />
            </Head>

            <section className="bg-gray-50 px-6 py-24 transition-colors duration-300 sm:px-12 dark:bg-gray-900">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mx-auto max-w-xl"
                >
                    <h1 className="mb-4 text-center text-4xl font-extrabold text-gray-900 transition-colors duration-300 dark:text-white">
                        Contact Us
                    </h1>
                    <p className="mb-10 text-center text-gray-600 transition-colors duration-300 dark:text-gray-400">
                        We’d love to hear from you! Whether you have a question about features, pricing, or anything else, our team is ready to
                        answer.
                    </p>

                    <form
                        className="space-y-6 rounded-xl bg-white p-8 shadow-lg transition-colors duration-300 dark:border dark:border-gray-700 dark:bg-gray-800"
                        onSubmit={(e) => {
                            e.preventDefault();
                            alert('Form submitted! (placeholder)');
                        }}
                    >
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Name
                            </label>
                            <div className="relative">
                                <User className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    id="name"
                                    className="w-full rounded-md border border-gray-300 bg-white py-2 pr-3 pl-10 shadow-sm transition-colors duration-300 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full rounded-md border border-gray-300 bg-white py-2 pr-3 pl-10 shadow-sm transition-colors duration-300 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                                    required
                                />
                            </div>
                        </div>

                        {/* Message */}
                        <div>
                            <label htmlFor="message" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Message
                            </label>
                            <div className="relative">
                                <MessageCircle className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                                <textarea
                                    id="message"
                                    rows={4}
                                    className="w-full rounded-md border border-gray-300 bg-white py-2 pr-3 pl-10 shadow-sm transition-colors duration-300 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                                    required
                                />
                            </div>
                        </div>

                        {/* Button */}
                        <button
                            type="submit"
                            className="w-full rounded-md bg-indigo-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        >
                            Send Message
                        </button>
                    </form>
                </motion.div>
            </section>
        </PortalLayout>
    );
};

export default Contact;
