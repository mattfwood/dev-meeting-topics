import { Ctx, NotFoundError } from 'blitz';
import db, { Prisma } from 'db';

type GetVoteInput = Pick<Prisma.FindFirstVoteArgs, 'where'>;

export default async function getVote({ where }: GetVoteInput, ctx: Ctx) {
  ctx.session.authorize();

  const vote = await db.vote.findFirst({ where });

  if (!vote) throw new NotFoundError();

  return vote;
}
