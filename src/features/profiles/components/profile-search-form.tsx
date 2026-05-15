import SearchIcon from "@mui/icons-material/Search";
import { Box, Input } from "@mui/joy";

type ProfileSearchFormProps = {
  defaultValue: string;
};

export function ProfileSearchForm({ defaultValue }: ProfileSearchFormProps) {
  return (
    <Box component="form" action="/explore" width="100%">
      <Input
        name="q"
        placeholder="Search profiles"
        fullWidth
        startDecorator={<SearchIcon />}
        defaultValue={defaultValue}
        aria-label="Search profiles"
      />
    </Box>
  );
}
