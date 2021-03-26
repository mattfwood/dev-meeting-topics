import { Ctx } from 'blitz';
import db, { Prisma } from 'db';

type UpdateVoteInput = Pick<Prisma.VoteUpdateArgs, 'where' | 'data'>;

export default async function updateVote(
  { where, data }: UpdateVoteInput,
  ctx: Ctx
) {
  ctx.session.$authorize();

  const vote = await db.vote.update({ where, data });

  return vote;
}
