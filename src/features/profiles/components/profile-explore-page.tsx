import { List, ListItem, ListItemContent, Typography } from "@mui/joy";
import { MainContainer } from "@/shared/components/layout/main-container";
import { NoData } from "@/shared/components/ui/no-data";
import { ProfileAvatar } from "@/shared/components/ui/profile-avatar";
import { MAIN_BORDERS } from "@/shared/constants/app";
import { searchProfiles } from "@/features/profiles/server/queries";
import { ProfileSearchForm } from "./profile-search-form";

type ProfileExplorePageProps = {
  searchParams: Promise<{ q?: string }>;
};

export async function ProfileExplorePage({ searchParams }: ProfileExplorePageProps) {
  const { q } = await searchParams;
  const profiles = await searchProfiles(q);

  return (
    <MainContainer
      navbarProps={{
        title: "explore",
        hasBackButton: true,
        fullItem: <ProfileSearchForm defaultValue={q ?? ""} />,
      }}
      noPad
    >
      {profiles.length ? (
        <List sx={{ p: 0 }}>
          {profiles.map((profile) => (
            <ListItem key={profile.id} sx={{ borderBottom: MAIN_BORDERS, p: 0 }}>
              <ListItemContent
                component="a"
                href={`/profile/${profile.id}`}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: { xs: 2, sm: 2.5 },
                  gap: 2,
                  textDecoration: "none",
                  backgroundColor: "transparent",
                  transition: "0.3s",
                  "&:hover": {
                    backgroundColor: "background.level1",
                  },
                }}
              >
                <ProfileAvatar profile={profile} size={32} />

                <Typography level="title-sm" color="primary" fontWeight={700}>
                  {profile.displayName}
                </Typography>
                <Typography level="body-sm" noWrap>
                  {profile.bio ?? profile.username}
                </Typography>
              </ListItemContent>
            </ListItem>
          ))}
        </List>
      ) : (
        <NoData title="No profiles found" description="Try another name or username." />
      )}
    </MainContainer>
  );
}
