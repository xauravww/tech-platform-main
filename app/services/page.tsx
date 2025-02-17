'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface SubService {
  name: string;
  technologies?: string[];
  description: string;
}

interface Service {
  category: string;
  description: string;
  sub_services: SubService[];
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        const data = await response.json();
        setServices(data?.services ?? []);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-12 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-extrabold text-center mb-12 text-white tracking-wide"
        >
          Our Services
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
            {services.map((service, index) => (
              <motion.div
                key={service.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-6 transition-all duration-300 hover:bg-white/20 hover:scale-105"
              >
                <h2 className="text-3xl font-semibold mb-3 text-white">
                  {service.category}
                </h2>
                <p className="text-gray-300 mb-5 break-words">
                  {service.description}
                </p>

                <div className="space-y-4">
                  {service.sub_services.map((subService) => (
                    <motion.div
                      key={subService.name}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 bg-gray-800/50 backdrop-blur-md rounded-lg cursor-pointer transition-all duration-300 hover:bg-gray-700/70"
                    >
                      <h3 className="text-lg font-medium text-white mb-2">{subService.name}</h3>
                      <p className="text-gray-300 break-words">
                        {subService.description}
                      </p>

                      {subService.technologies && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {subService.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-1 bg-blue-400/20 text-blue-300 rounded-full text-sm font-semibold"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
