import {
  Box,
  List,
  ListItem,
  ListItemContent,
  Stack,
  Typography,
} from "@mui/joy";
import NextLink from "next/link";
import { MainContainer } from "@/shared/components/layout/main-container";
import { NoData } from "@/shared/components/ui/no-data";
import { LinkButton } from "@/shared/components/ui/link-button";
import { ProfileAvatar } from "@/shared/components/ui/profile-avatar";
import { MAIN_BORDERS } from "@/shared/constants/app";
import { searchExploreProfiles } from "@/features/explore/server/queries";
import { ExploreSearchForm } from "./explore-search-form";

type ExplorePageProps = {
  searchParams: Promise<{ q?: string }>;
};

export const ExplorePage = async ({ searchParams }: ExplorePageProps) => {
  const { q } = await searchParams;
  const searchTerm = q?.trim() ?? "";
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
            <ListItem
              key={profile.id}
              sx={{ borderBottom: MAIN_BORDERS, p: 0 }}
            >
              <NextLink
                href={`/profile/${profile.id}`}
                style={{
                  color: "inherit",
                  display: "block",
                  textDecoration: "none",
                  width: "100%",
                }}
              >
                <ListItemContent
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

                  <Stack minWidth={0} gap={0.25}>
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                      minWidth={0}
                    >
                      <Typography
                        level="title-sm"
                        color="primary"
                        fontWeight={700}
                        noWrap
                      >
                        {profile.displayName}
                      </Typography>
                      {profile.username ? (
                        <Typography
                          level="body-xs"
                          textColor="neutral.500"
                          noWrap
                        >
                          @{profile.username}
                        </Typography>
                      ) : null}
                    </Box>
                    <Typography level="body-sm" textColor="neutral.500" noWrap>
                      {profile.bio ?? "No bio yet."}
                    </Typography>
                  </Stack>
                </ListItemContent>
              </NextLink>
            </ListItem>
          ))}
        </List>
      ) : (
        <NoData
          title={searchTerm ? "No profiles found" : "No profiles yet"}
          description={
            searchTerm
              ? `No results for "${searchTerm}". Try another name or username.`
              : "Profiles will appear here as people join EasyQA."
          }
          action={
            searchTerm ? (
              <LinkButton href="/explore" size="sm">
                Clear search
              </LinkButton>
            ) : null
          }
        />
      )}
    </MainContainer>
  );
};
