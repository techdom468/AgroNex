import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, ShieldAlert, CloudSun, Landmark } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const features = [
    {
      icon: <Leaf className="h-8 w-8 text-primary-500" />,
      title: "AI Crop Recommendation",
      description: "Get personalized crop suggestions based on your soil and climate data."
    },
    {
      icon: <ShieldAlert className="h-8 w-8 text-red-500" />,
      title: "Disease Detection",
      description: "Instantly identify plant diseases and get treatment advice using computer vision."
    },

    {
      icon: <CloudSun className="h-8 w-8 text-yellow-500" />,
      title: "Smart Weather Forecast",
      description: "Receive hyper-local weather updates and agricultural advisories."
    },
    {
      icon: <Landmark className="h-8 w-8 text-purple-500" />,
      title: "Government Schemes",
      description: "Explore and apply for various agricultural subsidies and government schemes easily."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 to-transparent dark:from-primary-900/10 dark:to-transparent z-0"></div>
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-primary-400/20 rounded-full blur-3xl opacity-50 dark:opacity-20 z-0"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-secondary-400/20 rounded-full blur-3xl opacity-50 dark:opacity-20 z-0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              AgroNex AI v1.0 is Live
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-8"
            >
              Smart Farming. <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">
                Better Future.
              </span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto"
            >
              Empower your agricultural journey with enterprise-grade AI. From crop prediction to disease detection.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Start for free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                  Explore Features
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Everything you need to grow</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Our platform combines cutting-edge AI models with real-time data to give you the ultimate farming advantage.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hoverable className="h-full border-gray-100 dark:border-gray-800">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-600 z-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full max-h-96 bg-primary-500 rounded-full blur-[120px] opacity-50 z-0"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to revolutionize your farm?</h2>
          <p className="text-primary-100 text-lg mb-10">Join thousands of modern farmers making data-driven decisions every day.</p>
          <Link to="/register">
            <button className="h-14 px-8 text-lg inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white text-primary-700 hover:bg-gray-100 dark:bg-white dark:text-primary-800 dark:hover:bg-gray-200 border-none shadow-xl hover:-translate-y-1">
              Create your free account
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
