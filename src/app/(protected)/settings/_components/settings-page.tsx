import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { List, ListItem, Stack, Typography } from "@mui/joy";
import { SignOutButton } from "@/shared/components/auth/sign-out-button";
import { MainContainer } from "@/shared/components/layout/main-container";
import { LinkButton } from "@/shared/components/ui/link-button";
import { PageStack } from "@/shared/components/ui/page-stack";
import { ProfileAvatar } from "@/shared/components/ui/profile-avatar";
import { SectionHeading } from "@/shared/components/ui/section-heading";
import { APP_RADIUS, MAIN_BORDERS } from "@/shared/constants/app";
import { requireProfile } from "@/shared/server/auth";

export const SettingsPage = async () => {
  const currentUser = await requireProfile();

  return (
    <MainContainer
      navbarProps={{ title: "settings", hasBackButton: true }}
      noPad
    >
      <PageStack>
        <Stack gap={1.5}>
          <SectionHeading
            title="Connections"
            description="Account details connected to EasyQA."
          />
          <List
            variant="outlined"
            sx={{
              p: 0,
              border: MAIN_BORDERS,
              borderRadius: APP_RADIUS,
              overflow: "hidden",
            }}
          >
            <ListItem
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
                px: 1.25,
                py: 1,
              }}
            >
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
          <SectionHeading
            title="Profile"
            description="Manage your public identity and active session."
          />
          <List
            variant="outlined"
            sx={{
              p: 0,
              border: MAIN_BORDERS,
              borderRadius: APP_RADIUS,
              overflow: "hidden",
            }}
          >
            <ListItem
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
                px: 1.25,
                py: 1,
              }}
            >
              <Stack flexDirection="row" alignItems="center" gap={1}>
                <ProfileAvatar profile={currentUser.profile} size={32} />
                <Stack minWidth={0}>
                  <Typography noWrap>
                    {currentUser.profile.displayName}
                  </Typography>
                  {currentUser.profile.username ? (
                    <Typography level="body-xs" textColor="neutral.500" noWrap>
                      @{currentUser.profile.username}
                    </Typography>
                  ) : null}
                </Stack>
              </Stack>
              <LinkButton href="/profile/edit" size="sm" variant="outlined">
                Edit
              </LinkButton>
            </ListItem>
          </List>
          <SignOutButton fullWidth />
        </Stack>
      </PageStack>
    </MainContainer>
  );
};
