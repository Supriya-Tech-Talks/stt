import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import Button from './Button';

const CONTACT_WEBHOOK = 'https://n8n.srv954053.hstgr.cloud/webhook/supriya-form';

const SERVICES = [
  'AI & Automation Solutions',
  'Software Development',
  'CRM, ERP & Business Systems',
  'Workflow & Backend Engineering',
  'Cloud, DevOps & Infrastructure',
  'Security, Maintenance & Support',
  'Other',
];

const initialForm = {
  name: '',
  email: '',
  phone: '',
  service: '',
  message: '',
};

function validateForm(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Name is required';
  else if (form.name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
  if (!form.email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Please enter a valid email';
  if (!form.phone.trim()) errors.phone = 'Phone is required';
  else if (!/^[\d\s\-\+\(\)]{10,}$/.test(form.phone.replace(/\s/g, ''))) errors.phone = 'Please enter a valid phone number';
  if (!form.service) errors.service = 'Please select a service';
  if (!form.message.trim()) errors.message = 'Message is required';
  else if (form.message.trim().length < 10) errors.message = 'Message must be at least 10 characters';
  return errors;
}

export default function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      addToast({ message: 'Please fix the form errors.', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await axios.post(
        CONTACT_WEBHOOK,
        {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          service: form.service,
          message: form.message.trim(),
        },
        { headers: { 'Content-Type': 'application/json' }, timeout: 15000 }
      );
      setForm(initialForm);
      addToast({ message: 'Thank you! Your message has been sent. We\'ll get back to you soon.', type: 'success' });
    } catch (err) {
      addToast({
        message: err.response?.data?.message || 'Failed to send message. Please try again or email us directly.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-padding bg-gray-50 dark:bg-gray-900/50" aria-labelledby="contact-heading">
      <div className="container-custom max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 id="contact-heading" className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
            Get In Touch
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Have a project in mind? Reach out and let&apos;s discuss how we can help.
          </p>

          {/* Contact info */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <a
              href="tel:+916304836880"
              className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </span>
              <span>+91 63048 36880</span>
            </a>
            <a
              href="mailto:contact@supriyatechtalks.com"
              className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <span>contact@supriyatechtalks.com</span>
            </a>
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8 shadow-xl"
        >
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                  errors.name ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                }`}
                placeholder="Your name"
                aria-required="true"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p id="name-error" className="mt-1 text-sm text-red-500" role="alert">
                  {errors.name}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                  errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                }`}
                placeholder="your@email.com"
                aria-required="true"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-500" role="alert">
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-6">
            <div>
              <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                id="contact-phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                  errors.phone ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                }`}
                placeholder="+91 63048 36880"
                aria-required="true"
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
              />
              {errors.phone && (
                <p id="phone-error" className="mt-1 text-sm text-red-500" role="alert">
                  {errors.phone}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="contact-service" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Service Interested In <span className="text-red-500">*</span>
              </label>
              <select
                id="contact-service"
                name="service"
                value={form.service}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                  errors.service ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                }`}
                aria-required="true"
                aria-invalid={!!errors.service}
                aria-describedby={errors.service ? 'service-error' : undefined}
              >
                <option value="">Select a service</option>
                {SERVICES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {errors.service && (
                <p id="service-error" className="mt-1 text-sm text-red-500" role="alert">
                  {errors.service}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={5}
              value={form.message}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none ${
                errors.message ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
              }`}
              placeholder="Tell us about your project..."
              aria-required="true"
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'message-error' : undefined}
            />
            {errors.message && (
              <p id="message-error" className="mt-1 text-sm text-red-500" role="alert">
                {errors.message}
              </p>
            )}
          </div>

          <div className="mt-8">
            <Button type="submit" disabled={isSubmitting} size="lg" className="w-full sm:w-auto min-w-[200px]">
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                'Send Message'
              )}
            </Button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
