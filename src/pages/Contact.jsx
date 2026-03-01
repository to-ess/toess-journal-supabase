import { Mail, MapPin, Phone, Send } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">Contact Us</h1>
        
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <Mail className="w-8 h-8 text-indigo-600 mb-4" />
            <h3 className="font-bold text-lg mb-2">Email</h3>
            <a href="mailto:editor@toess-journal.org" className="text-indigo-600 hover:underline">
              editor@toess-journal.org
            </a>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <Phone className="w-8 h-8 text-indigo-600 mb-4" />
            <h3 className="font-bold text-lg mb-2">Phone</h3>
            <a href="tel:+919952 445562" className="text-indigo-600 hover:underline">
              +91 99524 45562
            </a>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <MapPin className="w-8 h-8 text-indigo-600 mb-4" />
            <h3 className="font-bold text-lg mb-2">Address</h3>
            <p className="text-sm text-gray-600">
              Bangalore, Karnataka<br />
              India
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Name *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Email *</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Subject *</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="What is this about?"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Message *</label>
              <textarea
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Your message..."
              />
            </div>

            <button
              type="submit"
              className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}