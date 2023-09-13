import { RequestHandlerFactory } from './factories/handlers'
import express, { Express } from 'express'

type Params = {
  server: Express
  requestHandlerFactory: RequestHandlerFactory
}
export const setupServer = (params: Params) => {
  const { server, requestHandlerFactory } = params

  server.use(express.json())

  server.post('/login', requestHandlerFactory.make('loginHandler'))
  server.post('/register', requestHandlerFactory.make('postUserHandler'))
  server.post('/logout', requestHandlerFactory.make('logoutHandler'))

  server.get('/posts', requestHandlerFactory.make('getPostsHandler'))
  server.post('/posts', requestHandlerFactory.make('postPostHandler'))

  server.get('/posts/:postId', requestHandlerFactory.make('getPostHandler'))
  server.delete('/posts/:postId', requestHandlerFactory.make('deletePostHandler'))

  server.post('/posts/:postId/members', requestHandlerFactory.make('postPostMemberHandler'))

  server.get('/posts/:postId/comments', requestHandlerFactory.make('getPostCommentsHandler'))
  server.post('/posts/:postId/comments', requestHandlerFactory.make('postPostCommentHandler'))

  server.get('/posts/:postId/comments/:commentId', requestHandlerFactory.make('getPostCommentHandler'))
  server.patch('/posts/:postId/comments/:commentId', requestHandlerFactory.make('patchPostCommentHandler'))
  server.delete('/posts/:postId/comments/:commentId', requestHandlerFactory.make('deletePostCommentHandler'))
}
