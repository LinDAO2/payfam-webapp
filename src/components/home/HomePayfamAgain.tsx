import { useSession } from "@/hooks/app-hooks";
import { collectionServices } from "@/services/root";
import { TransactionRecipientDocument } from "@/types/transaction-types";
import { generateUUIDV4, removeSpecialChars } from "@/utils/funcs";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Spacer from "../common/Spacer";

const HomePayfamAgain = () => {
  const [recieptList, setRecieptList] = useState<
    TransactionRecipientDocument[]
  >([]);

  const profile = useSession();

  useEffect(() => {
    (async () => {
      const { status, list } = await collectionServices.getDocs("Recipients", [
        {
          uField: "userId",
          uid: profile.uid,
        },
      ]);

      if (status === "success" && list) {
        const _list = list as TransactionRecipientDocument[];
        setRecieptList(_list);
      }
    })();
  }, [profile.uid]);

  if (recieptList.length === 0) {
    return <></>;
  }

  return (
    <>
      <Spacer space={20} />
      <Typography variant="h6" color="textPrimary" gutterBottom={false}>
        Payfam Again
      </Typography>
      <Divider sx={{ mb: 1 }} />
      <Box
        sx={[
          {
            display: "grid",
            gridAutoColumns: { xs: "40%", md: "20%" },
            gridColumnGap: "10px",
            gridAutoFlow: "column",
            padding: "25px 0px",
            overflowX: "scroll",
            scrollSnapType: "x mandatory",
            cursor: "pointer",
          },
          {
            ":hover > :not(:hover)": {
              opacity: 0.3,
            },
          },
          {
            "::-webkit-scrollbar ": {
              height: 15,
            },
          },
          {
            "::-webkit-scrollbar-thumb, ::-webkit-scrollbar-track": {
              borderRadius: 92,
            },
          },
          {
            "::-webkit-scrollbar-thumb": {
              bgcolor: "primary.main",
            },
          },
          {
            "::-webkit-scrollbar-track": {
              bgcolor: "background.paper",
            },
          },
        ]}
      >
        {recieptList.map((reciept) => (
          <Box
            key={generateUUIDV4()}
            sx={{
              p: 1,
              borderRadius: 2,
              scrollSnapAlign: "start",
              transition: 0.3,
            }}
          >
            <Stack alignItems="center">
              <LazyLoadImage
                src={`https://avatars.dicebear.com/api/pixel-art/${removeSpecialChars(
                  reciept.recieverName
                )}.png`}
                alt={`payfam again ${reciept.recieverName}`}
                effect="blur"
                style={{
                  width: 50,
                  height: 50,
                  objectFit: "fill",
                }}
              />
              <Typography
                variant="subtitle2"
                color="textPrimary"
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: 100,
                }}
                textAlign="center"
              >
                {reciept.recieverName}
              </Typography>
              <Typography
                variant="caption"
                color="textPrimary"
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: 100,
                }}
                textAlign="center"
              >
                +{reciept.recieverPhonenumber}
              </Typography>
            </Stack>
          </Box>
        ))}

        {/* {Array.from({ length: 20 }, (_, index) => (
          <Box
            key={generateUUIDV4()}
            boxShadow={4}
            sx={{
              p: 1,
              borderRadius: 2,
              scrollSnapAlign: "start",
              transition: 0.3,
            }}
          >
            <Stack alignItems="center">
              <LazyLoadImage
                src={`https://avatars.dicebear.com/api/pixel-art/${index}.png`}
                alt={`payfam again ${index}`}
                effect="blur"
                style={{
                  width: 50,
                  height: 50,
                  objectFit: "fill",
                }}
              />
              <Typography
                variant="subtitle2"
                color="textPrimary"
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: 100,
                }}
              >
                {index}
              </Typography>
              <Typography
                variant="caption"
                color="textPrimary"
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: 100,
                }}
              >
                +8293738399302892892
              </Typography>
            </Stack>
          </Box>
        ))} */}
      </Box>
    </>
  );
};

export default HomePayfamAgain;
