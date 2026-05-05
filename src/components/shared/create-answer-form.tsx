import { useAuthContext } from "@/contexts/auth.context";
import { useCreateAnswer } from "@/hooks/useAnswerApi";
import { CHAR_LIMIT, MAIN_BORDERS } from "@/lib/constants";
import { Button, Stack, Textarea, Typography } from "@mui/joy";
import { useForm } from "react-hook-form";
import { CustomAvatar } from "./custom-avatar";

type FormData = { content: string };

export function CreateAnswerForm({ questionId }: { questionId: number }) {
  const { currentUser } = useAuthContext();
  const { mutateAsync: createAnswer, isPending } = useCreateAnswer(questionId);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    watch,
  } = useForm<FormData>();
  const contentValue = watch("content") ?? "";

  const isContentMaxed = contentValue.length >= CHAR_LIMIT.ANSWER_CONTENT;
  const isContentAlmostMaxed = contentValue.length >= CHAR_LIMIT.ANSWER_CONTENT * 0.8;

  const isValidLength = contentValue.length > 0 && contentValue.length <= CHAR_LIMIT.ANSWER_CONTENT;

  const onSubmit = async (data: FormData) => {
    if (!isValidLength) return;
    try {
      await createAnswer({ content: data.content }, { onSuccess: () => reset() });
    } catch (error: any) {
      console.error("Failed to create answer:", error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack borderBottom={MAIN_BORDERS} p={2} gap={3}>
        <Stack direction="row" alignItems="flex-start" gap={1}>
          <CustomAvatar user={currentUser!} size={32} fontSize={12} />

          <Textarea
            {...register("content", { required: true })}
            variant="plain"
            placeholder="Write your answer here..."
            disabled={isSubmitting}
            sx={{
              flexGrow: 1,
              fontSize: 14,
              border: "none",
              boxShadow: "none",
              py: 0,
              "& textarea": {
                textAlign: "justify",
                textTransform: "none",
                pt: 0.5,
              },
              "::before": { boxShadow: "none" },
              backgroundColor: "inherit",
            }}
          />
        </Stack>

        {contentValue && (
          <Stack direction="row" justifyContent="flex-end" alignItems="center" gap={1}>
            <Typography
              level="body-sm"
              color={isContentMaxed ? "danger" : isContentAlmostMaxed ? "warning" : "neutral"}
            >
              {contentValue.length} / {CHAR_LIMIT.ANSWER_CONTENT}
            </Typography>

            <Button
              type="submit"
              size="sm"
              loading={isSubmitting || isPending}
              disabled={!isValidLength}
            >
              Submit
            </Button>
          </Stack>
        )}
      </Stack>
    </form>
  );
}
