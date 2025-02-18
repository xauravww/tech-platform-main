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
  const [hasMore, setHasMore] = useState(true);  // Track if there are more products to load
  const [page, setPage] = useState(1);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products?page=${page}&pageSize=4`); // Pagination logic
      const data = await response.json();

      // Filter out already existing products to prevent duplication
      const newProducts = data?.products ?? [];
      setProducts((prev) => {
        const existingNames = new Set(prev.map(product => product.name));
        const filteredProducts = newProducts.filter((product: { name: string; }) => !existingNames.has(product.name));
        return [...prev, ...filteredProducts];
      });

      setHasMore(data?.hasMore ?? false); // Update "hasMore" based on the response
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  // Fetch products when the page number changes
  useEffect(() => {
    fetchProducts();
  }, [page]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-12 px-6 sm:px-10" style={{ minHeight: "calc(100vh - 65px)" }}>
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

        {/* Load More Button */}
        {hasMore && !loading && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setPage((prev) => prev + 1)} // Increment page number
              className="px-8 py-4 text-lg font-semibold text-white bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-lg backdrop-blur-md hover:bg-gradient-to-bl hover:scale-105 transition-all duration-300"
            >
              Load More
            </button>
          </div>
        )}

        {/* No more products message */}
        {!hasMore && !loading && (
          <div className="text-center mt-12 text-gray-400">
            <p>No more products to show!</p>
          </div>
        )}
      </div>
    </div>
  );
}
