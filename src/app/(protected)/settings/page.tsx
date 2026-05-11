import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { List, ListItem, Stack, Typography } from "@mui/joy";
import { SignOutButton } from "@/components/actions/sign-out-button";
import { MainContainer } from "@/components/layout/main-container";
import { PageStack } from "@/components/shared/page-stack";
import { SectionHeading } from "@/components/shared/section-heading";
import { APP_RADIUS, MAIN_BORDERS } from "@/lib/constants";
import { requireProfile } from "@/lib/server/data";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const currentUser = await requireProfile();

  return (
    <MainContainer navbarProps={{ title: "settings", hasBackButton: true }} noPad>
      <PageStack>
        <Stack gap={1.5}>
          <SectionHeading title="Connections" description="Account providers connected to EASYQA." />
          <List
            variant="outlined"
            sx={{
              p: 0,
              border: MAIN_BORDERS,
              borderRadius: APP_RADIUS,
              overflow: "hidden",
            }}
          >
            <ListItem sx={{ display: "flex", justifyContent: "space-between", gap: 2, px: 1.25, py: 1 }}>
              <Stack flexDirection="row" alignItems="center" gap={1}>
                <Typography>Email</Typography>
                <CheckCircleIcon color="success" fontSize="small" />
              </Stack>
              <Typography level="body-sm" textColor="neutral.500" noWrap>
                {currentUser.email ?? "Supabase Auth"}
              </Typography>
            </ListItem>
          </List>
        </Stack>

        <Stack gap={1.5}>
          <SectionHeading title="App" description="Manage your active session." />
          <SignOutButton fullWidth />
        </Stack>
      </PageStack>
    </MainContainer>
  );
}
