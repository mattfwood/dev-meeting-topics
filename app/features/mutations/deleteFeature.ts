import { Ctx } from 'blitz';
import db, { Prisma } from 'db';

type DeleteFeatureInput = Pick<Prisma.FeatureDeleteArgs, 'where'>;

export default async function deleteFeature(
  { where }: DeleteFeatureInput,
  ctx: Ctx
) {
  ctx.session.$authorize();

  const feature = await db.feature.delete({ where });

  return feature;
}
