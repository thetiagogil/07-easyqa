import { FormControl, FormLabel, Input, Textarea, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { memo } from "react";
import { FieldError, UseFormRegister } from "react-hook-form";

type ControlledFieldProps = {
  type?: "input" | "textarea";
  name: string;
  label: string;
  placeholder?: string;
  value: string;
  maxLength?: number;
  showCounter?: boolean;
  minRows?: number;
  register: UseFormRegister<any>;
  error?: FieldError;
  disabled?: boolean;
  sx?: SxProps;
};

export const ControlledField = memo(function ControlledField({
  type = "input",
  name,
  label,
  placeholder,
  value,
  maxLength,
  showCounter = true,
  minRows = 3,
  register,
  error,
  disabled,
  sx,
}: ControlledFieldProps) {
  const isMaxed = maxLength ? value.length >= maxLength : false;
  const isAlmostMaxed = maxLength ? value.length >= maxLength * 0.8 : false;

  const commonProps = {
    ...register(name, {
      required: `${label} is required`,
      ...(maxLength && {
        maxLength: {
          value: maxLength,
          message: `${label} must be at most ${maxLength} characters`,
        },
      }),
    }),
    placeholder,
    disabled,
    sx: { ...sx, bgcolor: "background.body" },
  };

  return (
    <FormControl error={!!error || isMaxed}>
      <FormLabel>{label}</FormLabel>

      {type === "textarea" ? (
        <Textarea {...commonProps} minRows={minRows} />
      ) : (
        <Input {...commonProps} />
      )}

      {showCounter && maxLength && (
        <Typography
          level="body-xs"
          textAlign="right"
          color={isMaxed ? "danger" : isAlmostMaxed ? "warning" : "neutral"}
        >
          {value.length} / {maxLength}
        </Typography>
      )}
    </FormControl>
  );
});
