"use client";
import { MainContainer } from "@/components/layout/main-container";
import { ControlledField } from "@/components/ui/controlled-input";
import { useCreateQuestion } from "@/hooks/useQuestionApi";
import { CHAR_LIMIT } from "@/lib/constants";
import { Button, Stack } from "@mui/joy";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type FormData = { title: string; content: string };

export default function QuestionAddPage() {
  const router = useRouter();
  const { mutateAsync: createQuestion, isPending, isSuccess } = useCreateQuestion();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormData>();
  const title = watch("title") || "";
  const content = watch("content") || "";

  const isValidLength =
    title.length > 0 &&
    title.length <= CHAR_LIMIT.QUESTION_TITLE &&
    content.length > 0 &&
    content.length <= CHAR_LIMIT.QUESTION_CONTENT;

  const onSubmit = async (data: FormData) => {
    if (!isValidLength) return;
    await createQuestion({ title: data.title, content: data.content });
  };

  useEffect(() => {
    if (isSuccess) {
      router.replace("/");
    }
  }, [isSuccess, router]);

  return (
    <MainContainer
      navbarProps={{
        title: "add question",
        hasBackButton: true,
      }}
      noPad
    >
      <form id="add-question-form" onSubmit={handleSubmit(onSubmit)}>
        <Stack p={2} gap={3}>
          <ControlledField
            type="input"
            name="title"
            label="Title"
            value={title}
            maxLength={100}
            register={register}
            error={errors.title}
            disabled={isSubmitting}
          />

          <ControlledField
            type="textarea"
            name="content"
            label="Content"
            value={content}
            maxLength={160}
            register={register}
            error={errors.content}
            disabled={isSubmitting}
          />

          <Button
            type="submit"
            form="add-question-form"
            size="sm"
            loading={isSubmitting || isPending}
            disabled={!isValidLength}
          >
            Submit
          </Button>
        </Stack>
      </form>
    </MainContainer>
  );
}
