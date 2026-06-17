import { describe, expect, it } from "vitest";
import { applyVote } from "./vote-state";

describe("applyVote", () => {
  it("adds a new upvote", () => {
    expect(applyVote({ voteScore: 2, viewerVoteValue: null }, 1)).toEqual({
      voteScore: 3,
      viewerVoteValue: 1,
    });
  });

  it("removes an existing vote when the same value is selected", () => {
    expect(applyVote({ voteScore: 3, viewerVoteValue: 1 }, 1)).toEqual({
      voteScore: 2,
      viewerVoteValue: null,
    });
  });

  it("switches from upvote to downvote", () => {
    expect(applyVote({ voteScore: 3, viewerVoteValue: 1 }, -1)).toEqual({
      voteScore: 1,
      viewerVoteValue: -1,
    });
  });

  it("switches from downvote to upvote", () => {
    expect(applyVote({ voteScore: 1, viewerVoteValue: -1 }, 1)).toEqual({
      voteScore: 3,
      viewerVoteValue: 1,
    });
  });
});
