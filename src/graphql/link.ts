import { extendType, intArg, nonNull, nullable, objectType, stringArg } from "nexus";

export const link = objectType({
  name: "Link",
  definition(t) {
    t.nonNull.int("id");
    t.nullable.string("description");
    t.nonNull.string("url");
  }
});

export const LinkQuery = extendType({  // 2
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("feed", {   // 3
      type: "Link",
      resolve(parent, args, context, info) {    // 4
        return context.prisma.link.findMany();
      },
    });
    t.field("linkById", {
      type: "Link",
      args: {
        id: nonNull(intArg()),
      },
      resolve(parent, args, context, info) {
        return context.prisma.link.findUnique({ where: { id: args.id }});
      }
    })
  },
});

export const LinkMutation = extendType({  // 1
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createLink", {  // 2
      type: "Link",
      args: {
        description: nonNull(stringArg()),
        url: nonNull(stringArg()),
      },

      resolve(parent, args, context) {
        const { description, url } = args;
        const newLink = context.prisma.link.create({
          data: {
            description: description,
            url: url,
          },
        });
        return newLink;
      },
    });
    t.nonNull.field("updateLink", {
      type: "Link",
      args: {
        id: nonNull(intArg()),
        url: stringArg(),
        description: nullable(stringArg()),
      },
      async resolve(parent, args, context, info) {
        const _Link = await context.prisma.link.findUnique({
          where: {
            id: args.id,
          },
        });
        if (_Link && args.url !== null && args.url !== undefined) {
          _Link.url = args.url;
        }
        if (_Link && args.description !== null && args.description !== undefined) {
          _Link.description = args.description;
        }
        const updLink = context.prisma.link.update({
          where: { id: args.id },
          data: { ..._Link }
        });
        return updLink;
      }
    });
    t.nonNull.field("deleteLink", {
      type: "Link",
      args: {
        id: nonNull(intArg()),
      },
      resolve(parent, args, context, info) {
        return context.prisma.link.delete({ where: { id: args.id }});
      }
    })
  },
});