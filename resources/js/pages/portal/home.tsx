import PortalLayout from '@/layouts/portal-layout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import React from 'react';

const testimonials = [
    {
        id: 1,
        name: 'Sarah Williams',
        role: 'Warehouse Manager',
        quote: 'MyStore has streamlined our inventory management and improved our operational efficiency significantly.',
    },
    {
        id: 2,
        name: 'Michael Lee',
        role: 'Logistics Coordinator',
        quote: 'The real-time order tracking and analytics have transformed how we handle shipments and deliveries.',
    },
    {
        id: 3,
        name: 'Emma Johnson',
        role: 'Inventory Specialist',
        quote: 'Easy to use and reliable. The reporting features help me keep everything in check with minimal effort.',
    },
];

const Home: React.FC = () => {
    return (
        <PortalLayout>
            <Head>
                <title>Smart Inventory Management | MyStore</title>
                <meta
                    name="description"
                    content="Optimize your warehouse with MyStore's smart inventory and order tracking system. Get started with easy-to-use, modern software built for businesses."
                />
                <meta name="keywords" content="inventory, warehouse, order tracking, management software, analytics, MyStore" />
            </Head>

            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0, y: -40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative overflow-hidden bg-gradient-to-br from-indigo-700 to-indigo-900 px-6 py-28 text-center text-white transition-all duration-500 sm:px-12"
            >
                <div className="mx-auto max-w-3xl">
                    <h1 className="text-5xl leading-tight font-extrabold sm:text-6xl">Modern Inventory & Warehouse Solutions</h1>
                    <p className="mt-6 text-lg text-indigo-100">
                        Take full control of your business operations with our intuitive and scalable system.
                    </p>
                    <div className="mt-10 flex flex-wrap justify-center gap-4">
                        <a
                            href="/portal/products"
                            className="rounded-full bg-white px-8 py-3 font-semibold text-indigo-800 transition-transform duration-300 hover:scale-105 hover:bg-indigo-100 focus:ring-4 focus:ring-white"
                        >
                            View Products
                        </a>
                        <a
                            href="#"
                            className="rounded-full border border-white px-8 py-3 font-semibold text-white transition-transform duration-300 hover:scale-105 hover:bg-white hover:text-indigo-700 focus:ring-4 focus:ring-white"
                        >
                            Contact Sales
                        </a>
                    </div>
                </div>
            </motion.section>

            {/* Features Section */}
            <motion.section
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-white px-6 py-24 transition-colors duration-500 sm:px-12 dark:bg-gray-900"
            >
                <div className="mx-auto max-w-7xl">
                    <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white">Why Choose MyStore?</h2>
                    <div className="sm:grid-cols=2 grid gap-10 lg:grid-cols-3">
                        {[
                            'Inventory Management',
                            'Order Tracking',
                            'Advanced Reporting',
                            'Multi-Warehouse Support',
                            'User Access Control',
                            'Custom Alerts',
                        ].map((title, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="rounded-xl bg-gray-50 p-6 shadow-lg transition-transform duration-300 hover:scale-[1.02] dark:bg-gray-800"
                            >
                                <h3 className="mb-2 text-xl font-semibold text-indigo-700 dark:text-indigo-400">{title}</h3>
                                <p className="text-gray-600 dark:text-gray-300">Reliable and intuitive tools to empower your operations.</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* CTA Banner */}
            <motion.section
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative bg-indigo-700 px-6 py-20 text-center text-white transition-colors duration-500 sm:px-12"
            >
                <div className="mx-auto max-w-2xl">
                    <h2 className="mb-4 text-4xl font-bold">Start Optimizing Your Inventory Today</h2>
                    <p className="mb-8 text-lg opacity-90">
                        Join hundreds of businesses using MyStore to manage and grow their warehouse operations effectively.
                    </p>
                    <a
                        href="#"
                        className="inline-block rounded-full bg-white px-8 py-3 font-semibold text-indigo-800 transition-transform duration-300 hover:scale-105 hover:bg-indigo-100"
                    >
                        Get Started Free
                    </a>
                </div>
            </motion.section>

            {/* Testimonials */}
            <motion.section
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-gray-100 px-6 py-20 transition-colors duration-500 sm:px-12 dark:bg-gray-800"
            >
                <div className="mx-auto max-w-5xl">
                    <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white">What Our Customers Say</h2>
                    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                        {testimonials.map((t, i) => (
                            <motion.div
                                key={t.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.2 }}
                                viewport={{ once: true }}
                                className="rounded-lg bg-white p-6 shadow-md transition-transform duration-300 hover:scale-[1.01] dark:bg-gray-700"
                            >
                                <p className="mb-4 text-gray-700 italic dark:text-gray-300">"{t.quote}"</p>
                                <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-400">
                                    {t.name}, <span className="font-normal text-gray-500 dark:text-gray-300">{t.role}</span>
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Newsletter */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-indigo-900 px-6 py-30 text-white transition-colors duration-500 dark:from-indigo-900 dark:via-indigo-950 dark:to-gray-950"
            >
                <div className="mx-auto max-w-xl text-center">
                    <h2 className="text-3xl font-extrabold tracking-tight">Stay Updated</h2>
                    <p className="mt-3 text-base opacity-90">Get product updates, expert tips, and industry news right in your inbox.</p>
                    <form onSubmit={(e) => e.preventDefault()} className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
                        <input
                            type="email"
                            required
                            placeholder="Enter your email"
                            className="w-full rounded-md border border-white/20 bg-white/90 px-4 py-3 text-indigo-800 transition duration-300 placeholder:text-indigo-400 focus:border-white focus:ring-2 focus:ring-white focus:outline-none dark:bg-gray-100 dark:text-gray-900"
                        />
                        <button
                            type="submit"
                            className="rounded-md bg-white px-6 py-3 font-semibold text-indigo-700 transition duration-300 hover:bg-indigo-100 hover:text-indigo-900 dark:text-indigo-800 dark:hover:bg-white/80"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </motion.section>
        </PortalLayout>
    );
};

export default Home;
