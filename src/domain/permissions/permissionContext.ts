import { DomainPermission } from './permissionService'
import { Logger } from '../shared'
export interface DomainPermissionContext {
  grantPermission: (permissionName: DomainPermission) => void
  hasPermission: (permissionName: DomainPermission) => boolean
}

export class PermissionContext implements DomainPermissionContext {
  constructor(private logger: Logger) {}
  private grantedPermissions: Set<DomainPermission> = new Set()

  grantPermission(permissionName: DomainPermission) {
    this.logger.info(`Invoked PermissionContext.grantPermission with ${permissionName}`)
    this.grantedPermissions.add(permissionName)
  }

  hasPermission(permissionName: DomainPermission): boolean {
    this.logger.info(`Invoked PermissionContext.hasPermission with ${permissionName}`)
    const result = this.grantedPermissions.has(permissionName)
    this.logger.info(`PermissionContext.hasPermission returned ${result}`)
    return result
  }
}
