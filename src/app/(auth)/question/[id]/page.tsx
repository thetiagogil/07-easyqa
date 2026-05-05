"use client";
import { MainContainer } from "@/components/layout/main-container";
import { CreateAnswerForm } from "@/components/shared/create-answer-form";
import { Loading } from "@/components/shared/loading";
import { NoData } from "@/components/shared/no-data";
import { QuestionEntry } from "@/components/shared/question-entry";
import { TargetEntry } from "@/components/shared/target-entry";
import { useAuthContext } from "@/contexts/auth.context";
import { useInfiniteScrollObserver } from "@/hooks/useInfiniteScrollObserver";
import { useGetQuestionAnswers, useGetQuestionById } from "@/hooks/useQuestionApi";
import { useParams } from "next/navigation";
import { useRef } from "react";

export default function QuestionPage() {
  const { id } = useParams();
  const { currentUser } = useAuthContext();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const { data: question, isPending: isPendingQuestion } = useGetQuestionById(Number(id));
  const {
    data: answersRaw,
    isPending: isPendingAnswers,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetQuestionAnswers(Number(id));

  const answers = answersRaw?.pages.flat() || [];

  const hasAlreadyAnswered =
    !answers?.find((answer) => answer.userId === currentUser?.id) &&
    currentUser?.id !== question?.userId;

  useInfiniteScrollObserver({
    targetRef: loadMoreRef,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  return (
    <MainContainer navbarProps={{ title: "question", hasBackButton: true }} noPad>
      {isPendingQuestion || isPendingAnswers ? (
        <Loading />
      ) : !question ? (
        <NoData />
      ) : (
        <>
          <QuestionEntry question={question} />
          {hasAlreadyAnswered && <CreateAnswerForm questionId={question.id} />}
          {answers.length === 0 && !isFetchingNextPage && <NoData />}
          {answers?.map((answer) => (
            <TargetEntry
              key={answer.id}
              targetType="answer"
              target={answer}
              answeredQuestion={question}
            />
          ))}
          {hasNextPage && <div ref={loadMoreRef} />}
          {isFetchingNextPage && <Loading />}
        </>
      )}
    </MainContainer>
  );
}
