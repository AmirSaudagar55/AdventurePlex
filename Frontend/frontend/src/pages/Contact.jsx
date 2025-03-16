import { useState } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent successfully!');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg md:grid md:max-w-none md:grid-cols-2 md:gap-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl sm:tracking-tight">
              Get in touch
            </h2>
            <p className="mt-3 text-lg text-gray-500">
              Have questions about our facilities or services? We're here to help!
            </p>
            <div className="mt-9">
              <div className="mt-6 flex">
                <Phone className="h-6 w-6 text-gray-400" aria-hidden="true" />
                <p className="ml-3 text-base text-gray-500">+1 (555) 123-4567</p>
              </div>
              <div className="mt-6 flex">
                <Mail className="h-6 w-6 text-gray-400" aria-hidden="true" />
                <p className="ml-3 text-base text-gray-500">contact@sportspot.com</p>
              </div>
              <div className="mt-6 flex">
                <MapPin className="h-6 w-6 text-gray-400" aria-hidden="true" />
                <div className="ml-3 text-base text-gray-500">
                  <p>123 Sports Avenue</p>
                  <p>New York, NY 10001</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 sm:mt-16 md:mt-0">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl sm:tracking-tight">
              Send us a message
            </h2>
            <form onSubmit={handleSubmit} className="mt-9 space-y-6">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <textarea
                name="message"
                rows="4"
                placeholder="Message"
                value={formData.message}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
              <button
                type="submit"
                className="inline-flex justify-center rounded-md bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
