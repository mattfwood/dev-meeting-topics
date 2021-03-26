import { AuthorizationError, Ctx } from 'blitz';
import db, { Prisma } from 'db';

type DeleteFeatureInput = Pick<Prisma.FeatureDeleteArgs, 'where'>;

export default async function deleteFeature(
  { where }: DeleteFeatureInput,
  ctx: Ctx
) {
  ctx.session.$authorize();

  const feature = await db.feature.findUnique({
    where,
    include: { author: true },
  });

  // only allow the feature creator to delete
  if (feature?.author?.id !== ctx.session.userId) {
    throw new AuthorizationError();
  }

  // @TODO: probably make these null so they're not completely destroyed
  await db.vote.deleteMany({
    where: {
      featureId: where.id,
    },
  });
  const deletedFeature = await db.feature.delete({ where });

  return deletedFeature;
}
