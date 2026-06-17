import type { VoteValue } from "@/types/easyqa";

export type VoteState = {
  voteScore: number;
  viewerVoteValue: VoteValue | null;
};

export const applyVote = (
  current: VoteState,
  selectedValue: VoteValue,
): VoteState => {
  if (current.viewerVoteValue === selectedValue) {
    return {
      voteScore: current.voteScore - selectedValue,
      viewerVoteValue: null,
    };
  }

  if (current.viewerVoteValue === null) {
    return {
      voteScore: current.voteScore + selectedValue,
      viewerVoteValue: selectedValue,
    };
  }

  return {
    voteScore: current.voteScore + selectedValue * 2,
    viewerVoteValue: selectedValue,
  };
};
