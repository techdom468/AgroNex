import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Leaf, Cpu, Database, Server, BrainCircuit, Globe, Zap, ShieldCheck, Phone, CheckCircle, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const technologies = [
    { icon: <Database className="h-8 w-8 text-blue-400" />, name: "React & Tailwind", desc: "Modern, responsive frontend" },
    { icon: <Server className="h-8 w-8 text-green-600" />, name: "Django REST API", desc: "Robust and secure backend" },
    { icon: <Database className="h-8 w-8 text-green-500" />, name: "MongoDB", desc: "Scalable NoSQL database" },
    { icon: <BrainCircuit className="h-8 w-8 text-yellow-500" />, name: "YOLOv8 & ML", desc: "Advanced AI models" }
  ];

  const benefits = [
    { icon: <Zap className="h-5 w-5 text-yellow-500" />, text: "AI Powered Insights" },
    { icon: <Globe className="h-5 w-5 text-blue-500" />, text: "Real-Time Data Streams" },
    { icon: <ShieldCheck className="h-5 w-5 text-green-500" />, text: "Secure & Reliable" },
    { icon: <CheckCircle className="h-5 w-5 text-primary-500" />, text: "Farmer Friendly UI" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-16 mb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 to-transparent dark:from-primary-900/10 z-0"></div>
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-primary-400/20 rounded-full blur-3xl opacity-50 dark:opacity-20 z-0 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-secondary-400/20 rounded-full blur-3xl opacity-50 dark:opacity-20 z-0 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-4xl mx-auto">
            <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">AgroNex</span>
            </motion.h1>
            <motion.p variants={itemVariants} className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              AgroNex is an AI-powered smart farming platform dedicated to helping farmers harness the power of modern technology. We turn complex data into actionable insights.
            </motion.p>
            <motion.div variants={itemVariants} className="flex justify-center gap-4">
              <Link to="/register"><Button variant="primary" size="lg">Get Started</Button></Link>
              <Link to="/#features"><Button variant="outline" size="lg" className="bg-white/50 dark:bg-gray-900/50">Explore Features</Button></Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <Card className="h-full p-8 border-t-4 border-t-primary-500 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                To empower farmers with accessible AI technology, ultimately increasing crop productivity, reducing unexpected losses due to diseases, and providing accurate recommendations that ensure food security and financial stability.
              </p>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <Card className="h-full p-8 border-t-4 border-t-secondary-500 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Pioneering the future of digital and sustainable agriculture through smart decision-support systems. We envision a world where every farmer, regardless of scale, has an AI agronomist in their pocket.
              </p>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* How it Works - Timeline */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
          <p className="text-gray-600 dark:text-gray-400">Your journey to smart farming in 5 easy steps.</p>
        </div>
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary-500 before:to-secondary-500">
          {["Register", "Complete Profile", "Use AI Features", "Receive Smart Recommendations", "Improve Farming Decisions"].map((step, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-gray-900 bg-primary-500 text-white font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                {idx + 1}
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{step}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Technology Stack & Why Choose Us */}
      <section className="py-16 bg-white dark:bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Technology Stack</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {technologies.map((tech, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                    <Card className="flex items-center gap-4 p-4 border-gray-100 dark:border-gray-800">
                      <div className="shrink-0">{tech.icon}</div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">{tech.name}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{tech.desc}</p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Why Choose AgroNex</h2>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 border border-gray-100 dark:border-gray-800">
                <ul className="space-y-4">
                  {benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="bg-white dark:bg-gray-900 rounded-full p-1 shadow-sm">
                        {benefit.icon}
                      </div>
                      <span className="text-lg text-gray-700 dark:text-gray-300 font-medium">{benefit.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
