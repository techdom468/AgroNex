import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Github, Linkedin, Instagram, ChevronDown, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import api from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const contactInfo = [
    { icon: <Mail className="h-6 w-6 text-primary-500" />, title: "Email", content: "support@agronex.com" },
    { icon: <Phone className="h-6 w-6 text-secondary-500" />, title: "Phone", content: "+1 (800) 123-4567" },
    { icon: <MapPin className="h-6 w-6 text-red-500" />, title: "Office Address", content: "123 Innovation Drive, Tech City, 10010" },
    { icon: <Clock className="h-6 w-6 text-blue-500" />, title: "Working Hours", content: "Mon - Fri, 9:00 AM - 6:00 PM" }
  ];

  const faqs = [
    { question: "What is AgroNex?", answer: "AgroNex is an AI-powered smart farming platform designed to help farmers increase productivity using technology." },
    { question: "Is AgroNex free?", answer: "We offer a free tier with basic features and premium plans for advanced AI capabilities and analytics." },
    { question: "How does Crop Recommendation work?", answer: "It analyzes your soil type, climate data, and location to suggest the most profitable and suitable crops." },
    { question: "How accurate is Disease Detection?", answer: "Our computer vision models are trained on thousands of images and achieve over 95% accuracy for common plant diseases." },
    { question: "Can I access Government Schemes?", answer: "Yes, our platform aggregates and provides easy access to the latest agricultural government schemes and subsidies." }
  ];

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Full Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email address";
    }
    if (formData.phone && !/^\+?[0-9\s\-()]{7,15}$/.test(formData.phone)) {
      errors.phone = "Invalid phone number format";
    }
    if (!formData.subject.trim()) errors.subject = "Subject is required";
    if (!formData.message.trim()) {
      errors.message = "Message is required";
    } else if (formData.message.length > 2000) {
      errors.message = "Message cannot exceed 2000 characters";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // POST to /api/v1/contact
      const response = await api.post('/contact/', formData);
      if (response.status === 201) {
        showToast('success', 'Message sent successfully!');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      }
    } catch (error) {
      showToast('error', error.response?.data?.error || 'Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12 relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }} 
            animate={{ opacity: 1, y: 0, x: '-50%' }} 
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className={`fixed bottom-8 left-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
          >
            {toast.type === 'success' ? <CheckCircle className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
            <p className="font-medium">{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative overflow-hidden mb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary-50/50 to-transparent dark:from-secondary-900/10 z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center py-12">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-500 to-primary-500">AgroNex</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We are here to help. Reach out to us with any questions, partnership inquiries, or support requests.
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Contact Info & Socials */}
          <div className="lg:col-span-1 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
              {contactInfo.map((info, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}>
                  <Card hoverable className="flex items-center gap-4 p-6 border-gray-100 dark:border-gray-800">
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-full shrink-0">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{info.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{info.content}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Connect with us</h3>
              <div className="flex gap-4">
                {[
                  { icon: <Github className="h-6 w-6" />, href: "#" },
                  { icon: <Linkedin className="h-6 w-6" />, href: "#" },
                  { icon: <Instagram className="h-6 w-6" />, href: "#" },
                  { icon: <Mail className="h-6 w-6" />, href: "mailto:support@agronex.com" }
                ].map((social, idx) => (
                  <motion.a 
                    key={idx} 
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="bg-white dark:bg-gray-900 p-3 rounded-full text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors"
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="p-8 border-t-4 border-t-primary-500 border-x-gray-100 border-b-gray-100 dark:border-x-gray-800 dark:border-b-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <Input 
                        label="Full Name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        placeholder="John Doe" 
                        className={formErrors.name ? 'border-red-500' : ''}
                      />
                      {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                    </div>
                    <div>
                      <Input 
                        label="Email Address" 
                        name="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        placeholder="john@example.com" 
                        className={formErrors.email ? 'border-red-500' : ''}
                      />
                      {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <Input 
                        label="Phone Number (Optional)" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleChange} 
                        placeholder="+1 234 567 8900" 
                        className={formErrors.phone ? 'border-red-500' : ''}
                      />
                      {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                    </div>
                    <div>
                      <Input 
                        label="Subject" 
                        name="subject" 
                        value={formData.subject} 
                        onChange={handleChange} 
                        placeholder="How can we help?" 
                        className={formErrors.subject ? 'border-red-500' : ''}
                      />
                      {formErrors.subject && <p className="text-red-500 text-xs mt-1">{formErrors.subject}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Message
                    </label>
                    <textarea 
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Write your message here..."
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200 ${formErrors.message ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}`}
                    ></textarea>
                    {formErrors.message && <p className="text-red-500 text-xs mt-1">{formErrors.message}</p>}
                  </div>

                  <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Google Map Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 mb-20">
        <Card className="overflow-hidden border-0 shadow-lg">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1690000000000!5m2!1sen!2s" 
            width="100%" 
            height="400" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Office Location"
            className="w-full filter grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
          ></iframe>
        </Card>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600 dark:text-gray-400">Can't find the answer you're looking for? Reach out to our support team.</p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <Card key={idx} className="border-gray-100 dark:border-gray-800 overflow-hidden">
              <button 
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="font-semibold text-gray-900 dark:text-white">{faq.question}</span>
                <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: 'auto', opacity: 1 }} 
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Contact;
