import { hasRole } from '../../lib/roles'

export default (user, company) => {
  if (!user) return false
  if (hasRole(user, ['corporate_mod', 'admin'])) return true
  if (!user.methods || !user.methods.length) return false
  if (['gender', 'dob', 'weight', 'height'].some((key) => !user[key])) return false
  if (company && company.locations && company.locations.length && !user.location) return false
  if (company && company.departments && company.departments.length && !user.department) return false
  return true
}
