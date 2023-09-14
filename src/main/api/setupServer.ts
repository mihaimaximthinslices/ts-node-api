import { RequestHandlerFactory } from './factories/handlers'
import express, { Express } from 'express'
import { withIRequestHandlerAdapter } from './withIRequestHandler'

type Params = {
  server: Express
  requestHandlerFactory: RequestHandlerFactory
}

export const setupServer = (params: Params) => {
  const { server, requestHandlerFactory } = params

  server.use(express.json())

  server.post('/login', withIRequestHandlerAdapter(requestHandlerFactory.make('loginHandler')))
  server.post('/register', withIRequestHandlerAdapter(requestHandlerFactory.make('postUserHandler')))
  server.post('/logout', withIRequestHandlerAdapter(requestHandlerFactory.make('logoutHandler')))

  server.get('/posts', withIRequestHandlerAdapter(requestHandlerFactory.make('getPostsHandler')))
  server.post('/posts', withIRequestHandlerAdapter(requestHandlerFactory.make('postPostHandler')))

  server.get('/posts/:postId', withIRequestHandlerAdapter(requestHandlerFactory.make('getPostHandler')))
  server.delete('/posts/:postId', withIRequestHandlerAdapter(requestHandlerFactory.make('deletePostHandler')))

  server.post('/posts/:postId/members', withIRequestHandlerAdapter(requestHandlerFactory.make('postPostMemberHandler')))

  server.get(
    '/posts/:postId/comments',
    withIRequestHandlerAdapter(requestHandlerFactory.make('getPostCommentsHandler')),
  )
  server.post(
    '/posts/:postId/comments',
    withIRequestHandlerAdapter(requestHandlerFactory.make('postPostCommentHandler')),
  )

  server.get(
    '/posts/:postId/comments/:commentId',
    withIRequestHandlerAdapter(requestHandlerFactory.make('getPostCommentHandler')),
  )
  server.patch(
    '/posts/:postId/comments/:commentId',
    withIRequestHandlerAdapter(requestHandlerFactory.make('patchPostCommentHandler')),
  )
  server.delete(
    '/posts/:postId/comments/:commentId',
    withIRequestHandlerAdapter(requestHandlerFactory.make('deletePostCommentHandler')),
  )
}
