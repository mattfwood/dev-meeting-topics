import { Ctx } from 'blitz';
import db, { Prisma } from 'db';

type CreateFeatureInput = Pick<Prisma.FeatureCreateArgs, 'data'>;
export default async function createFeature(
  { data }: CreateFeatureInput,
  ctx: Ctx
) {
  ctx.session.authorize();

  const feature = await db.feature.create({
    data: {
      ...data,
      author: {
        connect: {
          id: ctx.session.userId,
        },
      },
    },
  });

  return feature;
}
