import { useAuth } from '../../contexts/AuthContext';

export const UserInfo = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="user-info">
      <h3>Welcome to {import.meta.env.VITE_PORTAL_NAME}</h3>
      <div className="user-details">
        <p>
          <strong>Name:</strong> {user.firstName} {user.lastName}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Status:</strong> {user.status}
        </p>
      </div>
      <div className="portal-links">
        <h4>Available Portals:</h4>
        <ul>
          <li><a href="http://localhost:3001">Portal A</a></li>
          <li><a href="http://localhost:3002">Portal B</a></li>
          <li><a href="http://localhost:3003">Portal C</a></li>
        </ul>
      </div>
      <button onClick={logout}>Logout</button>
      <style>{`
        .user-info {
          max-width: 600px;
          margin: 2rem auto;
          padding: 2rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .user-details {
          margin: 1rem 0;
          padding: 1rem;
          background-color: #f9f9f9;
          border-radius: 4px;
        }
        
        .portal-links {
          margin: 1rem 0;
        }
        
        .portal-links ul {
          list-style: none;
          padding: 0;
        }
        
        .portal-links li {
          margin: 0.5rem 0;
        }
        
        .portal-links a {
          color: #0066cc;
          text-decoration: none;
        }
        
        .portal-links a:hover {
          text-decoration: underline;
        }
        
        button {
          padding: 0.75rem 1.5rem;
          background-color: #dc3545;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        button:hover {
          background-color: #c82333;
        }
      `}</style>
    </div>
  );
};