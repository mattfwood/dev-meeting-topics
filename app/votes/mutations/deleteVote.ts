import { Ctx } from 'blitz';
import db, { Prisma } from 'db';

type DeleteVoteInput = Pick<Prisma.VoteDeleteArgs, 'where'>;

export default async function deleteVote({ where }: DeleteVoteInput, ctx: Ctx) {
  ctx.session.authorize();

  const vote = await db.vote.delete({ where });

  return vote;
}
