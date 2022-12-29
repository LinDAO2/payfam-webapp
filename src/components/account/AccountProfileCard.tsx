import { ISessionState } from "@/db/session-slice";
import { useSession } from "@/hooks/app-hooks";
import { Stack, Typography } from "@mui/material";
import { isEmpty } from "lodash";
import moment from "moment";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";

const AccountProfileCard = () => {
  const profile = useSession() as ISessionState;
  if (isEmpty(profile)) return <p>No user found!</p>;
  return (
    <Stack sx={{ width: "100%" }} alignItems="center">
      {profile?.photo?.url !== undefined && profile?.photo?.url !== "" && (
        <LazyLoadImage
          effect="blur"
          alt="profile photo"
          src={profile?.photo?.url}
          width={100}
          height={100}
          style={{ borderRadius: 100 }}
        />
      )}
      <Typography
        variant="caption"
        color="textPrimary"
      >{`${profile?.firstName}  ${profile?.lastName}`}</Typography>
      <Typography
        variant="caption"
        color="textPrimary"
      >{`${profile?.email}`}</Typography>
      <Typography
        variant="caption"
        color="textPrimary"
      >{`${profile?.phonenumber}`}</Typography>
      <Typography
        variant="caption"
        color="textPrimary"
      >{`${profile?.persona}`}</Typography>
      <Typography variant="caption" color="textPrimary">
        Joined since{" "}
        {`${moment(profile?.addedOn?.toDate()).format("M/D/Y")}`}
      </Typography>
      <Link to={`/`}>
        <Typography variant="caption" color="textPrimary">
          View
        </Typography>
      </Link>
    </Stack>
  );
};

export default AccountProfileCard;
