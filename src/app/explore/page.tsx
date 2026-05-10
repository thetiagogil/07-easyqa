import SearchIcon from "@mui/icons-material/Search";
import { Button, Input, Link, List, ListItem, ListItemContent, Stack, Typography } from "@mui/joy";
import { EmptyState } from "@/components/shared/empty-state";
import { ProfileAvatar } from "@/components/shared/profile-avatar";
import { searchProfiles } from "@/lib/easyqa/data";

export const dynamic = "force-dynamic";

type ExplorePageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const { q } = await searchParams;
  const profiles = await searchProfiles(q);

  return (
    <Stack>
      <Stack component="form" action="/explore" p={2} gap={1.5} borderBottom="1px solid" borderColor="divider">
        <Typography level="h2">Explore</Typography>
        <Stack direction="row" gap={1}>
          <Input
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search profiles"
            startDecorator={<SearchIcon />}
            sx={{ flex: 1 }}
          />
          <Button type="submit" variant="outlined">
            Search
          </Button>
        </Stack>
      </Stack>

      {profiles.length ? (
        <List sx={{ p: 0 }}>
          {profiles.map((profile) => (
            <ListItem key={profile.id} sx={{ borderBottom: "1px solid", borderColor: "divider", p: 0 }}>
              <ListItemContent
                component="a"
                href={`/profile/${profile.id}`}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 1.5,
                  p: 2,
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                <ProfileAvatar profile={profile} size={38} />
                <Stack minWidth={0}>
                  <Typography level="title-sm">{profile.displayName}</Typography>
                  <Typography level="body-sm" textColor="text.tertiary" noWrap>
                    {profile.bio ?? profile.username ?? "No bio yet."}
                  </Typography>
                </Stack>
              </ListItemContent>
            </ListItem>
          ))}
        </List>
      ) : (
        <EmptyState
          title="No profiles found"
          body={
            q ? (
              <Link component="a" href="/explore">
                Clear search
              </Link>
            ) : (
              "Profiles appear here after users set them up."
            )
          }
        />
      )}
    </Stack>
  );
}
