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
          },
        })
      },
      publish: (parent, args) => {
        return prisma.post.update({
          where: {
            id: Number(args.id),
          },
          data: {
            published: true,
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
}