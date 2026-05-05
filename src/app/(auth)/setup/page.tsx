"use client";
import { useAuthContext } from "@/contexts/auth.context";
import { useUpdateUser } from "@/hooks/useUserApi";
import { Button, FormControl, FormHelperText, Input, Stack, Typography } from "@mui/joy";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type FormData = {
  name: string;
};

export default function SetupPage() {
  const { currentUser } = useAuthContext();
  const { mutateAsync: updateUser, isPending, isSuccess } = useUpdateUser();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    await updateUser({
      name: data.name,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      router.replace("/");
    }
  }, [isSuccess, router]);

  if (!currentUser) return null;
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack minHeight="100vh" justifyContent="center" alignItems="center" p={2}>
        <Stack width="100%" maxWidth={400} gap={4}>
          <Typography level="h3" textAlign="center">
            Hi, please choose a name!
          </Typography>

          <Stack gap={2}>
            <FormControl error={!!errors.name}>
              <Input
                {...register("name", { required: "Name is required" })}
                placeholder="Your name"
                disabled={isSubmitting}
              />
              {errors.name && <FormHelperText>{errors.name.message}</FormHelperText>}
            </FormControl>

            <Button type="submit" loading={isSubmitting || isPending}>
              Confirm
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </form>
  );
}
