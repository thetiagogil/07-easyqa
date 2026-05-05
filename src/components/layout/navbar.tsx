import { useAuthContext } from "@/contexts/auth.context";
import { MAIN_BORDERS } from "@/lib/constants";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton, Link, Stack, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { CustomAvatar } from "../shared/custom-avatar";

interface NavbarProps {
  title?: string;
  hasBackButton?: boolean;
  startItem?: ReactNode;
  centerItem?: ReactNode;
  endItem?: ReactNode;
  fullItem?: ReactNode;
}

const NavbarContainer = ({ children }: { children: ReactNode }) => (
  <Stack
    component="nav"
    position="sticky"
    top={0}
    bgcolor="background.body"
    height={56}
    direction="row"
    justifyContent="space-between"
    alignItems="center"
    borderTop={{ xs: "", sm: MAIN_BORDERS }}
    borderBottom={MAIN_BORDERS}
    py={1}
    px={2}
    zIndex={10}
  >
    {children}
  </Stack>
);

const BackButton = ({ sx }: { sx?: SxProps }) => {
  const router = useRouter();
  return (
    <IconButton
      color="neutral"
      size="sm"
      onClick={() => {
        const internalReferrer = document.referrer.startsWith(window.location.origin);
        if (internalReferrer) {
          router.back();
        } else {
          router.push("/");
        }
      }}
      sx={{ ...sx, alignSelf: "center" }}
    >
      <ArrowBackIcon />
    </IconButton>
  );
};

export const Navbar = ({
  title,
  startItem,
  centerItem,
  endItem,
  fullItem,
  hasBackButton,
}: NavbarProps) => {
  const { authenticated } = usePrivy();
  const { currentUser } = useAuthContext();

  if (fullItem)
    return (
      <NavbarContainer>
        {hasBackButton ? <BackButton sx={{ mr: 2 }} /> : null} {fullItem}
      </NavbarContainer>
    );
  return (
    <NavbarContainer>
      <Stack flexDirection="row" justifyContent="start" alignItems="center" flexBasis="100%">
        {startItem ? (
          startItem
        ) : hasBackButton ? (
          <BackButton />
        ) : (
          authenticated && (
            <Link href={`/profile/${currentUser?.id}`} underline="none">
              <CustomAvatar user={currentUser!} />
            </Link>
          )
        )}
      </Stack>

      <Stack flexDirection="row" justifyContent="center" alignItems="center" flexBasis="100%">
        {centerItem ? centerItem : <Typography level="body-md">{title}</Typography>}
      </Stack>

      <Stack flexDirection="row" justifyContent="end" alignItems="center" flexBasis="100%">
        {endItem ?? <></>}
      </Stack>
    </NavbarContainer>
  );
};
