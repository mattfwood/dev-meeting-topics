import { AuthorizationError, Ctx } from 'blitz';
import db, { Prisma } from 'db';

type UpdateFeatureInput = Pick<Prisma.FeatureUpdateArgs, 'where' | 'data'>;

export default async function updateFeature(
  { where, data }: UpdateFeatureInput,
  ctx: Ctx
) {
  ctx.session.$authorize();

  const feature = await db.feature.findUnique({
    where,
    include: { author: true },
  });

  // only allow the feature creator to edit
  if (feature?.author?.id !== ctx.session.userId) {
    throw new AuthorizationError();
  }

  const updatedFeature = await db.feature.update({ where, data });

  return updatedFeature;
}
