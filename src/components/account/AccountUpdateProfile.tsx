import ProfileForm from "@/components/forms/ProfileForm";
import styled from "@emotion/styled";
import { Box, Divider, Typography } from "@mui/material";

const Wrapper = styled(Box)`
  border-radius: 10px;
  min-height: 200px;
`;

interface Props {
  compact?: boolean;
}
const AccountUpdateProfile = ({ compact }: Props) => {
  return (
    <Wrapper
      boxShadow={compact ? 0 : 2}
      sx={{ bgcolor: compact ? "transparent" : "background.paper" }}
    >
      {!compact && (
        <>
          <Typography
            variant="h6"
            color="textPrimary"
            sx={{ m: 1, textAlign: "center", }}
          >
            Update profile
          </Typography>
          <Divider sx={{ my: 1 }} />
        </>
      )}

      <ProfileForm />
    </Wrapper>
  );
};

export default AccountUpdateProfile;
