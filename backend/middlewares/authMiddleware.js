const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
  let token;

  // Expect header: Authorization: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // attach user id to request
    next();
  } catch (err) {
    console.error('JWT error:', err);
    return res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};
