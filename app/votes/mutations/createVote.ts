import { Ctx } from 'blitz';
import db, { Prisma } from 'db';

type CreateVoteInput = Pick<Prisma.VoteCreateArgs, 'data'>;
export default async function createVote({ data }: CreateVoteInput, ctx: Ctx) {
  ctx.session.authorize();

  const vote = await db.vote.create({ data });

  return vote;
}
