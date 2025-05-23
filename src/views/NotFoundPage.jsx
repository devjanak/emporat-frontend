import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="hero min-h-[80vh]">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">404</h1>
          <p className="py-6">Page not found. The page you are looking for might have been removed or is temporarily unavailable.</p>
          <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage; 