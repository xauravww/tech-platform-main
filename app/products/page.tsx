'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Product {
  name: string;
  description: string;
  link: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const body = document.querySelector('body')
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data?.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-12 px-6 sm:px-10" style={{ minHeight: "calc(100vh - 65px )" }}>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-extrabold text-center mb-12 text-white tracking-wide"
        >
          Our Products
        </motion.h1>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-lg shadow-lg p-6 animate-pulse"
              >
                <div className="h-6 bg-gray-400 rounded-md w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-400 rounded-md w-5/6 mb-6"></div>
                <div className="space-y-3">
                  {[...Array(2)].map((_, subIndex) => (
                    <div key={subIndex} className="p-4 bg-gray-600/30 rounded-lg">
                      <div className="h-5 bg-gray-400 rounded-md w-1/2 mb-2"></div>
                      <div className="h-4 bg-gray-400 rounded-md w-3/4"></div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-6 flex flex-col transition-all duration-300 hover:bg-white/20 hover:scale-105"
              >
                <h2 className="text-3xl font-semibold mb-3 text-white">
                  {product.name}
                </h2>
                <p className="text-gray-300 mb-5 flex-grow line-clamp-3">{product.description}</p>
                <a
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                >
                  Learn More
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
