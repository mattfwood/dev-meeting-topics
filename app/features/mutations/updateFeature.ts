import { Ctx } from 'blitz';
import db, { Prisma } from 'db';

type UpdateFeatureInput = Pick<Prisma.FeatureUpdateArgs, 'where' | 'data'>;

export default async function updateFeature(
  { where, data }: UpdateFeatureInput,
  ctx: Ctx
) {
  ctx.session.authorize();

  const feature = await db.feature.update({ where, data });

  return feature;
}
