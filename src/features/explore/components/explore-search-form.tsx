import SearchIcon from "@mui/icons-material/Search";
import { Box, Input } from "@mui/joy";

type ExploreSearchFormProps = {
  defaultValue: string;
};

export function ExploreSearchForm({ defaultValue }: ExploreSearchFormProps) {
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
