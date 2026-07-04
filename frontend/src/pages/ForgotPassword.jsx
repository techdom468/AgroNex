import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import api from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [devLink, setDevLink] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setDevLink('');
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await api.post('/auth/forgot-password/', { email });
      if (response.data.status === 'success') {
        setSuccess(true);
        // Only for development to easily test the link without an email server
        if (response.data.data && response.data.data.reset_link) {
          setDevLink(response.data.data.reset_link);
        }
      } else {
        setError(response.data.message || 'Something went wrong');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col justify-center relative overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-400/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary-400/20 blur-[100px]" />
      </div>

      <div className="max-w-md w-full mx-auto relative z-10 px-4">
        <div className="mb-6">
          <Link to="/login" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to login
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Reset Password</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card glass className="p-8 shadow-xl">
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 flex items-start gap-3 border border-red-100 dark:border-red-800">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
            
            {success ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Check your email</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  We've sent a password reset link to <span className="font-medium text-gray-900 dark:text-white">{email}</span>.
                </p>
                
                {devLink && (
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-900/20 dark:border-yellow-800/30 text-left">
                    <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-500 uppercase tracking-wider mb-2">Development Mode</p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-3">Since no email server is configured, click below to simulate clicking the email link:</p>
                    <a href={devLink} className="inline-block w-full text-center px-4 py-2 bg-yellow-400 text-yellow-900 font-medium rounded-lg hover:bg-yellow-500 transition-colors">
                      Test Reset Link
                    </a>
                  </div>
                )}
                
                <div className="mt-8">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Didn't receive the email? Check your spam folder or try again.
                  </p>
                  <Button variant="outline" fullWidth onClick={() => setSuccess(false)}>
                    Try another email
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  id="email"
                  type="email"
                  label="Email Address"
                  placeholder="you@example.com"
                  icon={Mail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
                
                <Button type="submit" variant="primary" fullWidth isLoading={loading}>
                  Send Reset Link
                </Button>
              </form>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
