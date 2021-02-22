import { Ctx } from 'blitz';
import db, { Prisma } from 'db';

type GetFeaturesInput = Pick<
  Prisma.FindManyFeatureArgs,
  'where' | 'orderBy' | 'skip' | 'take'
>;

export default async function getFeatures(
  { where, orderBy, skip = 0, take }: GetFeaturesInput,
  ctx: Ctx
) {
  ctx.session.$authorize();

  const features = await db.feature.findMany({
    where,
    orderBy,
    take,
    skip,
    include: { author: true, votes: true },
  });

  const count = await db.feature.count();
  const hasMore = typeof take === 'number' ? skip + take < count : false;
  const nextPage = hasMore ? { take, skip: skip + take! } : null;

  return {
    features,
    nextPage,
    hasMore,
    count,
  };
}
