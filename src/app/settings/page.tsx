import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { List, ListItem, Stack, Typography } from "@mui/joy";
import { SignOutButton } from "@/components/actions/sign-out-button";
import { MainContainer } from "@/components/layout/main-container";
import { requireProfile } from "@/lib/easyqa/data";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const currentUser = await requireProfile();

  return (
    <MainContainer navbarProps={{ title: "settings", hasBackButton: true }} sx={{ gap: 4 }}>
      <Stack gap={2}>
        <Typography level="h4">Connections</Typography>
        <List variant="outlined" sx={{ borderRadius: "md", flex: 0 }}>
          <ListItem sx={{ display: "flex", justifyContent: "space-between" }}>
            <Stack flexDirection="row" alignItems="center" gap={1}>
              <Typography>Email</Typography>
              <CheckCircleIcon color="success" />
            </Stack>
            <Typography level="body-sm" textColor="neutral.600" noWrap>
              {currentUser.email ?? "Supabase Auth"}
            </Typography>
          </ListItem>
        </List>
      </Stack>

      <Stack gap={2}>
        <Typography level="h4">App</Typography>
        <SignOutButton />
      </Stack>
    </MainContainer>
  );
}
