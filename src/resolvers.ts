const { prisma } = require('./db')

export const resolvers = {
    Query: {
      feed: (parent, args) => {
        return prisma.post.findMany()
      },
      post: (parent, args) => {
        return prisma.post.findUnique({
          where: { id: Number(args.id) },
        })
      },
    },
    Mutation: {
        createDraft: (parent, args) => {
            return prisma.post.create({
              data: {
                title: args.title,
                content: args.content,
                published: false,
                author: args.authorEmail && {
                  connect: { email: args.authorEmail },
                },
              },
            })
          },
          publish: (parent, args) => {
            return prisma.post.update({
              where: { id: Number(args.id) },
              data: {
                published: true,
              },
            })
          },
          createUser: (parent, args) => {
            return prisma.user.create({
              data: {
                email: args.data.email,
                name: args.data.name,
                posts: {
                  create: args.data.posts,
                },
              },
            })
          },
          delete: async (parent, args) => {
            const deleted = await prisma.post.delete({
                where: {
                  id: Number(args.id),
                }
              })
            if (!deleted) {
              return 'Failed delete the article with id : ' + args.id
            } 
            return 'Success delete the article with id : ' + args.id
          },
        },
        User: {
          posts: (parent, args) => {
            return prisma.user
              .findUnique({
                where: { id: parent.id },
              })
              .posts()
          },
        },
        Post: {
          author: (parent, args) => {
            return prisma.post
              .findUnique({
                where: { id: parent.id },
              })
              .author()
          },
    },
}