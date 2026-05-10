import SearchIcon from "@mui/icons-material/Search";
import { Box, Input, List, ListItem, ListItemContent, Typography } from "@mui/joy";
import { MainContainer } from "@/components/layout/main-container";
import { NoData } from "@/components/shared/no-data";
import { ProfileAvatar } from "@/components/shared/profile-avatar";
import { MAIN_BORDERS } from "@/lib/constants";
import { searchProfiles } from "@/lib/easyqa/data";

export const dynamic = "force-dynamic";

type ExplorePageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const { q } = await searchParams;
  const profiles = await searchProfiles(q);

  return (
    <MainContainer
      navbarProps={{
        title: "explore",
        hasBackButton: true,
        fullItem: <SearchForm defaultValue={q ?? ""} />,
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
                  p: 2,
                  gap: 2,
                  textDecoration: "none",
                  backgroundColor: "transparent",
                  transition: "0.3s",
                  "&:hover": {
                    backgroundColor: "neutral.700",
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
        <NoData />
      )}
    </MainContainer>
  );
}

function SearchForm({ defaultValue }: { defaultValue: string }) {
  return (
    <Box component="form" action="/explore" width="100%">
      <Input
        name="q"
        placeholder="search users..."
        fullWidth
        startDecorator={<SearchIcon />}
        defaultValue={defaultValue}
        aria-label="search users"
      />
    </Box>
  );
}
