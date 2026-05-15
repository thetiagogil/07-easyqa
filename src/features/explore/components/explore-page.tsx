import { Box, List, ListItem, ListItemContent, Typography } from "@mui/joy";
import { MainContainer } from "@/shared/components/layout/main-container";
import { NoData } from "@/shared/components/ui/no-data";
import { ProfileAvatar } from "@/shared/components/ui/profile-avatar";
import { MAIN_BORDERS } from "@/shared/constants/app";
import { searchExploreProfiles } from "@/features/explore/server/queries";
import { ExploreSearchForm } from "./explore-search-form";

type ExplorePageProps = {
  searchParams: Promise<{ q?: string }>;
};

export async function ExplorePage({ searchParams }: ExplorePageProps) {
  const { q } = await searchParams;
  const profiles = await searchExploreProfiles(q);

  return (
    <MainContainer
      navbarProps={{
        title: "explore",
        hasBackButton: true,
        fullItem: <ExploreSearchForm defaultValue={q ?? ""} />,
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

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    minWidth: 0,
                    width: "100%",
                  }}
                >
                  <Typography
                    level="title-sm"
                    color="primary"
                    fontWeight={700}
                    noWrap
                    sx={{ flexShrink: 0, maxWidth: { xs: "62%", sm: "68%" } }}
                  >
                    {profile.displayName}
                  </Typography>
                  <Typography level="body-sm" noWrap sx={{ flex: 1, minWidth: 0 }}>
                    {profile.bio ?? profile.username}
                  </Typography>
                </Box>
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
