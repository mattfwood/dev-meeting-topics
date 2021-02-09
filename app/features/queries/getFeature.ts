import { Ctx, NotFoundError } from 'blitz';
import db, { Prisma } from 'db';

type GetFeatureInput = Pick<Prisma.FindFirstFeatureArgs, 'where'>;

export default async function getFeature({ where }: GetFeatureInput, ctx: Ctx) {
  ctx.session.authorize();

  const feature = await db.feature.findFirst({ where });

  if (!feature) throw new NotFoundError();

  return feature;
}
