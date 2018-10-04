// Return true if doc.roles includes one of the passed roles
export function hasRole (doc, roles) {
  if (!doc) return false
  roles = Array.isArray(roles) ? roles : [roles]
  if (!roles.length) return false
  return (doc.roles || []).some((docRole) => roles.includes(docRole))
}

const RoleNames = {
  admin: 'Administrator',
  corporate_mod: 'Corporate',
  'charity-rewards': 'Charity Rewards'
}

export function getRoleName (role) {
  if (!role) return 'Unknown'
  return RoleNames[role] || role[0].toUpperCase() + role.slice(1)
}

export const FeatureRoles = ['rewards', 'charity-rewards']
