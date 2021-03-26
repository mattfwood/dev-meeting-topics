import { Ctx } from 'blitz';
import db from 'db';

// type CreateVoteInput = Pick<Prisma.VoteCreateArgs, 'data'>;

type CreateVoteInput = {
  featureId: number;
};

export default async function createVote(
  { data }: { data: CreateVoteInput },
  ctx: Ctx
) {
  ctx.session.$authorize();

  const existingVote = await db.vote.findFirst({
    where: {
      featureId: data.featureId,
      userId: ctx.session.userId,
    },
  });

  if (existingVote) {
    const vote = await db.vote.delete({
      where: {
        id: existingVote.id,
      },
    });

    return vote;
  }

  const vote = await db.vote.create({
    data: {
      feature: {
        connect: {
          id: data.featureId,
        },
      },
      user: {
        connect: {
          id: ctx.session.userId,
        },
      },
    },
  });

  return vote;
}
