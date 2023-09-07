export class InvalidInputError extends Error {
  constructor(message: string) {
    super(message)

    this.name = 'InvalidInputError'
    this.message = message
  }
}

export class UnauthorizedError extends Error {
  constructor(entity: string, action?: string) {
    super()

    this.name = `UnauthorizedError`
    this.message = `${entity} is not authorized${action ? ' to ' + action : ''}`
  }
}

export class EntityNotFound extends Error {
  constructor(entity: string) {
    super()

    this.name = `EntityNotFound`
    this.message = `${entity} was not found`
  }
}
