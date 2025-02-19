'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center px-6">
        {/* Blurred Gradient Background */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 opacity-30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-700 opacity-30 rounded-full blur-3xl"></div>
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
            Welcome to TechPlatform
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore our range of services, products, and research contributions, built to elevate your experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
          {[
            { title: "Services", description: "Explore our technical solutions.", href: "/services", delay: 0.1 },
            { title: "Products", description: "Discover innovative products.", href: "/products", delay: 0.2 },
            { title: "Research", description: "Learn about our latest innovations.", href: "/research", delay: 0.3 }
          ].map(({ title, description, href, delay }, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay }}
              className="bg-white/10 hover:bg-white/20  backdrop-blur-lg rounded-xl shadow-lg p-6 hover:scale-105 transform transition-all duration-300"
            >
              <Link prefetch={false} href={href} className="block">
                <h2 className="text-3xl font-semibold text-white mb-3">{title}</h2>
                <p className="text-gray-300">{description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
