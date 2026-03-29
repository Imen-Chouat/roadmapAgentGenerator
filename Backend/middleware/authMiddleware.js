import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {

    //1. Get token from headers
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided ." });
    }
    // 2. Token format: "Bearer TOKEN"
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Invalid token format ." });
    }

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Save user info in request
    req.user_id = decoded.id;

    // 5. Go to next step
    next();

  } catch (error) {
    return res.status(401).json({ message: "Token invalid or expired ." });
  }
};
export default authMiddleware;