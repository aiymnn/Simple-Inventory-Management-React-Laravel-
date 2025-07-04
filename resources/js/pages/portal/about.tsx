import PortalLayout from '@/layouts/portal-layout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import React from 'react';

const About: React.FC = () => {
    return (
        <PortalLayout>
            <Head>
                <title>About Us | MyStore</title>
                <meta
                    name="description"
                    content="Learn more about MyStore, our mission, and how we help businesses manage their inventory efficiently."
                />
            </Head>

            {/* Intro Section */}
            <section className="bg-white px-6 py-24 sm:px-12 dark:bg-gray-900">
                <div className="mx-auto max-w-4xl text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-6 text-4xl font-extrabold text-gray-900 sm:text-5xl dark:text-white"
                    >
                        About MyStore
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="mb-4 text-lg text-gray-700 dark:text-gray-300"
                    >
                        MyStore is built by a team passionate about simplifying warehouse and inventory operations. We aim to empower businesses with
                        modern tools that enhance efficiency, reduce errors, and improve profitability.
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-gray-600 dark:text-gray-400"
                    >
                        From real-time tracking to comprehensive reporting, our platform is trusted by businesses worldwide. Whether you're a small
                        team or a growing enterprise, MyStore is designed to scale with you.
                    </motion.p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="bg-gray-50 px-6 py-20 transition-colors duration-500 sm:px-12 dark:bg-gray-800">
                <div className="mx-auto grid max-w-6xl gap-12 sm:grid-cols-2 sm:items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <img
                            src="https://i.pinimg.com/736x/d5/19/db/d519dbde20430d2a3795d7eca31d7a90.jpg"
                            alt="Team at work"
                            className="rounded-xl shadow-md"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
                        <p className="mb-3 text-gray-700 dark:text-gray-300">
                            At MyStore, our mission is to transform how businesses manage their inventory with cutting-edge, intuitive software. We
                            focus on creating seamless user experiences and powerful features that solve real-world problems.
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                            We believe in accessibility, transparency, and continuous improvement. Your success is our priority.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-indigo-700 px-6 py-20 text-center text-white transition-colors duration-500 sm:px-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mx-auto max-w-xl"
                >
                    <h2 className="mb-4 text-4xl font-bold">Want to Learn More?</h2>
                    <p className="mb-8 text-lg opacity-90">Discover how MyStore can optimize your inventory and warehouse operations today.</p>
                    <a
                        href="/contact"
                        className="inline-block rounded-full bg-white px-8 py-3 font-semibold text-indigo-800 transition-transform duration-300 hover:scale-105 hover:bg-indigo-100"
                    >
                        Contact Us
                    </a>
                </motion.div>
            </section>
        </PortalLayout>
    );
};

export default About;
