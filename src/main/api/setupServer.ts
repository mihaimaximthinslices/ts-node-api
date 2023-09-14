import { RequestHandlerFactory } from './factories/handlers'
import express, { Express } from 'express'
import { makeExpressRequestHandlerFactory } from './expressHandlerFactory'

type Params = {
  server: Express
  requestHandlerFactory: RequestHandlerFactory
}

export const setupServer = (params: Params) => {
  const { server, requestHandlerFactory } = params

  const handlerFactory = makeExpressRequestHandlerFactory(requestHandlerFactory)

  server.use(express.json())

  server.post('/login', handlerFactory.make('loginHandler'))
  server.post('/register', handlerFactory.make('postUserHandler'))
  server.post('/logout', handlerFactory.make('logoutHandler'))

  server.get('/posts', handlerFactory.make('getPostsHandler'))
  server.post('/posts', handlerFactory.make('postPostHandler'))

  server.get('/posts/:postId', handlerFactory.make('getPostHandler'))
  server.delete('/posts/:postId', handlerFactory.make('deletePostHandler'))

  server.post('/posts/:postId/members', handlerFactory.make('postPostMemberHandler'))

  server.get('/posts/:postId/comments', handlerFactory.make('getPostCommentsHandler'))
  server.post('/posts/:postId/comments', handlerFactory.make('postPostCommentHandler'))

  server.get('/posts/:postId/comments/:commentId', handlerFactory.make('getPostCommentHandler'))
  server.patch('/posts/:postId/comments/:commentId', handlerFactory.make('patchPostCommentHandler'))
  server.delete('/posts/:postId/comments/:commentId', handlerFactory.make('deletePostCommentHandler'))
}
