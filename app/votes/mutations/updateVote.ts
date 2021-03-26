import { AuthorizationError, Ctx } from 'blitz';
import db, { Prisma } from 'db';

type UpdateVoteInput = Pick<Prisma.VoteUpdateArgs, 'where' | 'data'>;

export default async function updateVote(
  { where, data }: UpdateVoteInput,
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

  const vote = await db.vote.update({ where, data });

  return vote;
}
