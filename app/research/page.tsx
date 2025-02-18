'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Research {
  title: string;
  year: number;
  type: string;
  description: string;
  doi: string;
}

export default function ResearchPage() {
  const [research, setResearch] = useState<Research[]>([]);
  const [loading, setLoading] = useState<boolean>(false);  // Set loading state to false initially
  const [page, setPage] = useState<number>(1);  // Track current page
  const [hasMore, setHasMore] = useState<boolean>(true);  // Check if more data exists
  const pageSize = 4;  // Set page size to 4 or any other value

  // Fetch research data with pagination
  const fetchResearch = async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/research?page=${pageNumber}&pageSize=${pageSize}`);
      const data = await response.json();
      console.log("Research data:", data);

      // Ensure we don't append duplicate research
      setResearch((prevResearch) => {
        // Only append new research if it is not already in the list
        const newResearch = data.researches.filter(
          (newItem: Research) => !prevResearch.some((item) => item.title === newItem.title)
        );
        return [...prevResearch, ...newResearch];
      });
      setHasMore(data.hasMore);
    } catch (error) {
      console.error('Error fetching research:', error);
    } finally {
      setLoading(false);  // Ensure loading state is turned off once the data is fetched
    }
  };

  // Fetch research when page changes
  useEffect(() => {
    fetchResearch(page);
  }, [page]);  // Trigger fetch when the page changes

  // Load more button handler
  const loadMore = () => {
    if (hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);  // Increment page number if more data is available
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-12 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-extrabold text-center mb-12 text-white tracking-wide"
        >
          Research Citations
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
          <div className="space-y-8">
            {research.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-6 transition-all duration-300 hover:bg-white/20 hover:scale-105"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                  <h2 className="text-2xl font-semibold text-white flex-1 mr-4 text-ellipsis overflow-hidden whitespace-normal">
                    {item.title}
                  </h2>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {item.year}
                    </span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      {item.type}
                    </span>
                  </div>
                </div>
                <p className="text-gray-300 mb-6 break-words text-sm sm:text-base">
                  {item.description}
                </p>
                <a
                  href={item.doi}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                >
                  View Publication
                </a>
              </motion.div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && !loading && (
          <div className="flex justify-center mt-8">
            <button
              onClick={loadMore}
              className="px-8 py-4 text-lg font-semibold text-white bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-lg backdrop-blur-md hover:bg-gradient-to-bl hover:scale-105 transition-all duration-300"
            >
              Load More
            </button>
          </div>
        )}

        {/* No more research message */}
        {!hasMore && !loading && (
          <div className="text-center mt-12 text-gray-400">
            <p>No more Research to show!</p>
          </div>
        )}
      </div>
    </div>
  );
}
