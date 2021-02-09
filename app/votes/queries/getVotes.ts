import { Ctx } from 'blitz';
import db, { Prisma } from 'db';

type GetVotesInput = Pick<
  Prisma.FindManyVoteArgs,
  'where' | 'orderBy' | 'skip' | 'take'
>;

export default async function getVotes(
  { where, orderBy, skip = 0, take }: GetVotesInput,
  ctx: Ctx
) {
  ctx.session.authorize();

  const votes = await db.vote.findMany({
    where,
    orderBy,
    take,
    skip,
  });

  const count = await db.vote.count();
  const hasMore = typeof take === 'number' ? skip + take < count : false;
  const nextPage = hasMore ? { take, skip: skip + take! } : null;

  return {
    votes,
    nextPage,
    hasMore,
    count,
  };
}
