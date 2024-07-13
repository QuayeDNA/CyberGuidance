
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
                <h1 className="text-9xl font-bold text-gray-700">404</h1>
                <h2 className="text-3xl font-bold text-gray-600 mt-2">Page not found</h2>
                <p className="mt-4 text-gray-600 text-center">
                    It looks like the page you are looking for doesn&apos;t exist.
                </p>
                <Link to="/" className="text-blue-600 hover:underline">
                    Go back to the homepage
                </Link>
            </div>
        </div>
    </div>
  )
}

export default NotFound