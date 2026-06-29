import { Link } from 'react-router-dom';
import { LogOut, Home } from 'lucide-react';

export default function Exit() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div className="mx-auto w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-6">
          <LogOut size={40} className="ml-1" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900">Thank You for Visiting</h1>
        
        <p className="text-gray-600 text-lg">
          We hope to see you at Dialogue Institute of Technology and Management Kaduna soon.
        </p>
        
        <div className="pt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            <Home size={20} />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
