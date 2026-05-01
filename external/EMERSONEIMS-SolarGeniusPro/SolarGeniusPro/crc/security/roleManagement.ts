// ROLE-BASED ACCESS CONTROL (RBAC)
// Manages user roles and permissions

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  inherits?: string[];
}

export interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete' | 'manage')[];
}

export interface UserRole {
  userId: string;
  roleId: string;
  tenantId: string;
  customPermissions?: Permission[];
  expiresAt?: Date;
}

class RoleManagement {
  private roles: Map<string, Role> = new Map();
  private userRoles: Map<string, UserRole[]> = new Map();
  
  constructor() {
    this.initializeDefaultRoles();
  }
  
  private initializeDefaultRoles(): void {
    const roles: Role[] = [
      {
        id: 'super_admin',
        name: 'Super Administrator',
        description: 'Full system access',
        permissions: [{ resource: '*', actions: ['manage'] }]
      },
      {
        id: 'admin',
        name: 'Administrator',
        description: 'Tenant administrator',
        permissions: [
          { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
          { resource: 'projects', actions: ['create', 'read', 'update', 'delete'] },
          { resource: 'designs', actions: ['create', 'read', 'update', 'delete'] },
          { resource: 'reports', actions: ['create', 'read', 'update', 'delete'] },
          { resource: 'settings', actions: ['read', 'update'] }
        ]
      },
      {
        id: 'engineer',
        name: 'Solar Engineer',
        description: 'Can design and modify solar systems',
        permissions: [
          { resource: 'projects', actions: ['create', 'read', 'update'] },
          { resource: 'designs', actions: ['create', 'read', 'update', 'delete'] },
          { resource: 'reports', actions: ['create', 'read'] }
        ]
      },
      {
        id: 'technician',
        name: 'Field Technician',
        description: 'Can view designs and update installation status',
        permissions: [
          { resource: 'projects', actions: ['read'] },
          { resource: 'designs', actions: ['read'] },
          { resource: 'installations', actions: ['read', 'update'] }
        ]
      },
      {
        id: 'client',
        name: 'Client',
        description: 'Can view their own projects and reports',
        permissions: [
          { resource: 'projects', actions: ['read'] },
          { resource: 'designs', actions: ['read'] },
          { resource: 'reports', actions: ['read'] }
        ]
      },
      {
        id: 'viewer',
        name: 'Viewer',
        description: 'Read-only access',
        permissions: [
          { resource: 'projects', actions: ['read'] },
          { resource: 'designs', actions: ['read'] }
        ]
      }
    ];
    
    for (const role of roles) {
      this.roles.set(role.id, role);
    }
  }
  
  async createRole(role: Omit<Role, 'id'>): Promise<Role> {
    const id = `role_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const newRole: Role = { ...role, id };
    this.roles.set(id, newRole);
    return newRole;
  }
  
  async getRole(roleId: string): Promise<Role | null> {
    return this.roles.get(roleId) || null;
  }
  
  async getAllRoles(): Promise<Role[]> {
    return Array.from(this.roles.values());
  }
  
  async updateRole(roleId: string, updates: Partial<Role>): Promise<Role | null> {
    const role = await this.getRole(roleId);
    if (!role) return null;
    
    const updated = { ...role, ...updates };
    this.roles.set(roleId, updated);
    return updated;
  }
  
  async deleteRole(roleId: string): Promise<boolean> {
    return this.roles.delete(roleId);
  }
  
  async assignRole(userId: string, roleId: string, tenantId: string, customPermissions?: Permission[], expiresAt?: Date): Promise<UserRole> {
    const role = await this.getRole(roleId);
    if (!role) {
      throw new Error(`Role ${roleId} not found`);
    }
    
    const userRole: UserRole = {
      userId,
      roleId,
      tenantId,
      customPermissions,
      expiresAt
    };
    
    const existing = this.userRoles.get(userId) || [];
    existing.push(userRole);
    this.userRoles.set(userId, existing);
    
    return userRole;
  }
  
  async removeRole(userId: string, roleId: string, tenantId: string): Promise<boolean> {
    const roles = this.userRoles.get(userId) || [];
    const index = roles.findIndex(r => r.roleId === roleId && r.tenantId === tenantId);
    
    if (index === -1) return false;
    
    roles.splice(index, 1);
    this.userRoles.set(userId, roles);
    return true;
  }
  
  async getUserRoles(userId: string, tenantId?: string): Promise<UserRole[]> {
    let roles = this.userRoles.get(userId) || [];
    
    if (tenantId) {
      roles = roles.filter(r => r.tenantId === tenantId);
    }
    
    // Filter expired
    const now = new Date();
    roles = roles.filter(r => !r.expiresAt || r.expiresAt > now);
    
    return roles;
  }
  
  async hasPermission(userId: string, tenantId: string, resource: string, action: string): Promise<boolean> {
    const userRoles = await this.getUserRoles(userId, tenantId);
    
    for (const userRole of userRoles) {
      const role = await this.getRole(userRole.roleId);
      if (!role) continue;
      
      // Check custom permissions
      if (userRole.customPermissions) {
        for (const perm of userRole.customPermissions) {
          if (this.matchPermission(perm, resource, action)) {
            return true;
          }
        }
      }
      
      // Check role permissions
      for (const perm of role.permissions) {
        if (this.matchPermission(perm, resource, action)) {
          return true;
        }
      }
      
      // Check inherited roles
      if (role.inherits) {
        for (const inheritedId of role.inherits) {
          const inherited = await this.getRole(inheritedId);
          if (inherited) {
            for (const perm of inherited.permissions) {
              if (this.matchPermission(perm, resource, action)) {
                return true;
              }
            }
          }
        }
      }
    }
    
    return false;
  }
  
  private matchPermission(permission: Permission, resource: string, action: string): boolean {
    const resourceMatch = permission.resource === '*' || permission.resource === resource;
    const actionMatch = permission.actions.includes('manage') || permission.actions.includes(action as any);
    return resourceMatch && actionMatch;
  }
  
  async getUserPermissions(userId: string, tenantId: string): Promise<Permission[]> {
    const permissions: Permission[] = [];
    const userRoles = await this.getUserRoles(userId, tenantId);
    
    for (const userRole of userRoles) {
      const role = await this.getRole(userRole.roleId);
      if (!role) continue;
      
      // Add custom permissions
      if (userRole.customPermissions) {
        permissions.push(...userRole.customPermissions);
      }
      
      // Add role permissions
      permissions.push(...role.permissions);
      
      // Add inherited permissions
      if (role.inherits) {
        for (const inheritedId of role.inherits) {
          const inherited = await this.getRole(inheritedId);
          if (inherited) {
            permissions.push(...inherited.permissions);
          }
        }
      }
    }
    
    // Deduplicate
    const unique = new Map();
    for (const perm of permissions) {
      const key = `${perm.resource}|${perm.actions.join(',')}`;
      if (!unique.has(key)) {
        unique.set(key, perm);
      }
    }
    
    return Array.from(unique.values());
  }
}

export const roleManagement = new RoleManagement();