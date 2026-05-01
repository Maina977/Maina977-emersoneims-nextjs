// Authentication Middleware
// JWT validation, user authentication, role-based access control

const jwt = require('jsonwebtoken');

const authMiddleware = {
    // Verify JWT token
    verifyToken: (req, res, next) => {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                success: false, 
                error: 'Access denied. No token provided.' 
            });
        }
        
        const token = authHeader.split(' ')[1];
        
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ 
                    success: false, 
                    error: 'Token expired' 
                });
            }
            return res.status(403).json({ 
                success: false, 
                error: 'Invalid token' 
            });
        }
    },
    
    // Optional auth (doesn't fail if no token)
    optionalAuth: (req, res, next) => {
        const authHeader = req.headers.authorization;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = decoded;
            } catch (error) {
                // Ignore invalid token for optional auth
            }
        }
        next();
    },
    
    // Role-based access control
    requireRole: (...roles) => {
        return (req, res, next) => {
            if (!req.user) {
                return res.status(401).json({ 
                    success: false, 
                    error: 'Authentication required' 
                });
            }
            
            if (!roles.includes(req.user.role)) {
                return res.status(403).json({ 
                    success: false, 
                    error: 'Insufficient permissions' 
                });
            }
            
            next();
        };
    },
    
    // Require specific permission
    requirePermission: (permission) => {
        return (req, res, next) => {
            if (!req.user) {
                return res.status(401).json({ 
                    success: false, 
                    error: 'Authentication required' 
                });
            }
            
            if (!req.user.permissions || !req.user.permissions.includes(permission)) {
                return res.status(403).json({ 
                    success: false, 
                    error: `Missing required permission: ${permission}` 
                });
            }
            
            next();
        };
    },
    
    // Tenant isolation
    requireTenantAccess: (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                success: false, 
                error: 'Authentication required' 
            });
        }
        
        const tenantId = req.headers['x-tenant-id'] || req.query.tenantId;
        
        if (!tenantId) {
            return res.status(400).json({ 
                success: false, 
                error: 'Tenant ID required' 
            });
        }
        
        if (req.user.role !== 'admin' && req.user.tenantId !== tenantId) {
            return res.status(403).json({ 
                success: false, 
                error: 'Access denied for this tenant' 
            });
        }
        
        req.tenantId = tenantId;
        next();
    },
    
    // Resource ownership check
    requireOwnership: (getResourceOwnerId) => {
        return async (req, res, next) => {
            if (!req.user) {
                return res.status(401).json({ 
                    success: false, 
                    error: 'Authentication required' 
                });
            }
            
            // Admin can access any resource
            if (req.user.role === 'admin') {
                return next();
            }
            
            try {
                const ownerId = await getResourceOwnerId(req);
                if (ownerId !== req.user.id) {
                    return res.status(403).json({ 
                        success: false, 
                        error: 'You do not own this resource' 
                    });
                }
                next();
            } catch (error) {
                return res.status(500).json({ 
                    success: false, 
                    error: 'Error checking ownership' 
                });
            }
        };
    }
};

module.exports = authMiddleware;