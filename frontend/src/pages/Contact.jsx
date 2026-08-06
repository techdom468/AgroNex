import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, ChevronDown, CheckCircle, AlertCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12 relative">
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
      <section className="relative overflow-hidden pt-32 pb-12 mb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary-50/50 to-transparent dark:from-secondary-900/10 z-0"></div>
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-secondary-400/20 rounded-full blur-3xl opacity-50 dark:opacity-20 z-0 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-primary-400/20 rounded-full blur-3xl opacity-50 dark:opacity-20 z-0 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
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
                  {
                    icon: (
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                    ),
                    href: "#",
                    label: "GitHub"
                  },
                  {
                    icon: (
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                    ),
                    href: "#",
                    label: "LinkedIn"
                  },
                  {
                    icon: (
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" /></svg>
                    ),
                    href: "#",
                    label: "Instagram"
                  },
                  { icon: <Mail className="h-6 w-6" />, href: "mailto:support@agronex.com", label: "Email" }
                ].map((social, idx) => (
                  <motion.a
                    key={idx}
                    href={social.href}
                    aria-label={social.label}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="bg-white dark:bg-gray-800 p-3 rounded-full text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors"
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
              <Card className="p-8 border-t-4 border-t-primary-500 border-x-gray-100 border-b-gray-100 dark:border-x-gray-800 dark:border-b-gray-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
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
                    <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                  </Button>
                </form>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>


      {/* FAQ Section */}
      <section className="w-full py-20 mt-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-600 z-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full max-h-96 bg-primary-500 rounded-full blur-[120px] opacity-50 z-0"></div>
        
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-primary-100">Can't find the answer you're looking for? Reach out to our support team.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-md overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-5 py-3 flex items-center justify-between text-left focus:outline-none hover:bg-white/20 transition-colors"
                >
                  <span className="font-medium text-white">{faq.question}</span>
                  <ChevronDown className={`h-5 w-5 text-white transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-black/20"
                    >
                      <div className="px-5 pb-4 text-white border-t border-white/10 pt-4 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
