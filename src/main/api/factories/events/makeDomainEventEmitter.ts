import EventEmitter from 'events'
import { AllDependencies } from '../../../../prodServer'
import { DomainEventEmitter } from '../../../../domain/events'
import { Post, User, Comment } from '../../../../domain/entities'

export class ConcreteEventEmitter implements DomainEventEmitter {
  private emitter: EventEmitter

  constructor(private dependencies: AllDependencies) {
    console.log(Object.keys(this.dependencies))
    this.emitter = new EventEmitter()

    // Example: Add custom behavior for the 'postDeleted' event
    this.emitter.on('postDeleted', (post: Post) => {
      // Handle the 'postDeleted' event
      console.log(`Post with ID ${post.id} has been deleted.`)
    })

    this.emitter.on('postCreated', (post: Post) => {
      console.log(`Post with ID ${post.id} has been created.`)
    })

    this.emitter.on('commentCreated', (comment: Comment) => {
      console.log(`Comment with ID ${comment.id} has been created.`)
    })

    this.emitter.on('userCreated', (user: User) => {
      console.log(`User with ID ${user.id} has been created.`)
    })
  }

  onPostDeleted(listener: (post: Post) => void): void {
    this.emitter.on('postDeleted', listener)
  }

  onPostCreated(listener: (post: Post) => void): void {
    this.emitter.on('postCreated', listener)
  }

  onCommentCreated(listener: (comment: Comment) => void): void {
    this.emitter.on('commentCreated', listener)
  }

  emitPostDeleted(post: Post): void {
    console.log(`Preparing to emit 'postDeleted' event for Post ID: ${post.id}`)

    this.emitter.emit('postDeleted', post)
  }

  emitPostCreated(post: Post): void {
    console.log(`Preparing to emit 'postCreated' event for Post ID: ${post.id}`)

    this.emitter.emit('postCreated', post)
  }

  emitCommentCreated(comment: Comment): void {
    console.log(`Preparing to emit 'commentCreated' event for Comment ID: ${comment.id}`)

    this.emitter.emit('commentCreated', comment)
  }

  onUserCreated(listener: (user: User) => void) {
    this.emitter.on('userCreated', listener)
  }

  emitUserCreated(user: User) {
    console.log(`Preparing to emit 'userCreated' event for User ID: ${user.id}`)

    this.emitter.emit('userCreated', user)
  }
}
