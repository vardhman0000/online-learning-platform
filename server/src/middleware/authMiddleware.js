const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET; // Load from environment variables
const debug = process.env.DEBUG_AUTH_MIDDLEWARE === 'true'; // Enable debug logging via env variable
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Bearer <token>

    if (!secretKey) {
        console.error('JWT_SECRET is not set in environment variables!');
        return res.status(500).json({ message: 'JWT secret not configured' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
        if (debug) {
            console.error('Token verification error:', err.message); // Log the specific error message
        }
      return res.status(401).json({ message: 'Invalid token', error: err.message }); // Include the error message for debugging
    }

    req.user = decoded; // Store user information in the request object
        if (debug) {
            console.log('User authenticated:', decoded.username);
            console.log('User role:', decoded.role)
        }

    next(); // Proceed to the next middleware/route handler
  });
}

// function authorizeRole(allowedRoles) {
//   return (req, res, next) => {
//     if (!req.user || !allowedRoles.includes(req.user.role)) {
//       return res.status(403).json({ message: 'Forbidden: Insufficient role' });
//     }
//     next();
//   };
// }

function authorizeRole(allowedRoles) {
  return (req, res, next) => {
    // Assumes verifyToken has already run and set req.user
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'Forbidden: Role not available on token.' });
    }

    const userRole = req.user.role;

    if (allowedRoles.includes(userRole)) {
      // User has one of the allowed roles, proceed to the next middleware/controller
      next();
    } else {
      // User's role is not authorized for this route
      res.status(403).json({ message: 'Forbidden: You do not have the required permissions.' });
    }
  };
}

module.exports = { verifyToken, authorizeRole };

