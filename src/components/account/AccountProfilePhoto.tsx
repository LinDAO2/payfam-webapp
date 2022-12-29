import { storage } from "@/configs/firebase";

import {
  IconButton,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { LazyLoadImage } from "react-lazy-load-image-component";
import React, { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useSession } from "@/hooks/app-hooks";
import { ISessionState } from "@/db/session-slice";
import { IImageUploadProgess } from "@/types/global-types";
import { showSnackbar } from "@/helpers/snackbar-helpers";
import { deleteImageFromStorage } from "@/utils/funcs";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { collectionServices } from "@/services/root";

const AccountProfilePhoto = () => {
  const width = 100;
  const height = 100;
  const borderRadius = 100;

  const profile = useSession() as ISessionState;

  const mediaRef: any = React.useRef();

  const [ImageUploadProgess, setImageUploadProgess] =
    React.useState<IImageUploadProgess>({
      title: "",
      name: "",
      url: "",
      progress: 0,
    });

  useEffect(() => {
    if (profile.photo) {
      setImageUploadProgess((prev) => {
        return {
          ...prev,
          name: profile.photo?.name ? profile.photo?.name : "",
          url: profile.photo?.url ? profile.photo?.url : "",
        };
      });
    }
  }, [profile]);

  function uploadMedia() {
    return new Promise(async (resolve, reject) => {
      const filePicker: any = mediaRef.current;

      if (!filePicker || !filePicker.files || filePicker.files.length <= 0) {
        showSnackbar({
          status: "info",
          msg: "No file selected.",
          openSnackbar: true,
        });
        reject("No file selected.");
        return;
      }
      if (filePicker.files.length > 1) {
        showSnackbar({
          status: "error",
          msg: "You can only upload a maximum of 1 file",
          openSnackbar: true,
        });
        reject("You can only upload a maximum of 1 file");
        return;
      }

      const myFile = filePicker.files[0];

      if (myFile.size > 10485760) {
        showSnackbar({
          status: "error",
          msg: "Image is too big (max. 10 Mb)",
          openSnackbar: true,
        });
        reject("Image is too big (max. 10 Mb)");
        return;
      }
      const imageId = uuidv4().slice(10);

      try {
        const storagePathAndFilename = `profilePhotos/${imageId}.png`;

        const logoImagesRef = ref(storage, storagePathAndFilename);

        const uploadTask = uploadBytesResumable(logoImagesRef, myFile);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setImageUploadProgess((prev) => {
              return {
                ...prev,
                progress: progress,
                name: `${imageId}.png`,
                title: "Upload started",
              };
            });

            // console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                setImageUploadProgess((prev) => {
                  return {
                    ...prev,
                    title: "Upload is paused",
                  };
                });
                break;
              case "running":
                setImageUploadProgess((prev) => {
                  return {
                    ...prev,
                    title: "Upload is running",
                  };
                });
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads
          },
          async () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setImageUploadProgess((prev) => {
              return {
                ...prev,
                title: "Upload done!",
                url: downloadURL,
              };
            });

            if (profile.uid) {
              const { status, successMessage, errorMessage } =
                await collectionServices.editDoc("Users", profile.uid, {
                  photo: {
                    name: `${imageId}.png`,
                    url: downloadURL,
                  },
                });
              if (status === "success") {
                showSnackbar({
                  status,
                  openSnackbar: true,
                  msg: successMessage,
                });
              }
              if (status === "error") {
                showSnackbar({
                  status,
                  openSnackbar: true,
                  msg: errorMessage,
                });
              }
            }
          }
        );

        //@ts-ignore
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  if (!profile.uid)
    return (
      <Skeleton
        variant="rectangular"
        sx={{ height: height, width: width, borderRadius: borderRadius }}
      />
    );

  return (
    <Stack alignItems="center" justifyContent="center" sx={{ p: 1 }}>
      <Box
        component={Stack}
        sx={{
          height: height,
          width: width,
          borderRadius: borderRadius,
          border: "2px solid #ddd",
          position: "relative",
        }}
        alignItems="center"
        justifyContent="center"
      >
        {ImageUploadProgess.url === "" ? (
          <Tooltip title="Upload profile photo">
            <IconButton
              onClick={async () => {
                mediaRef.current.click();
              }}
            >
              <CameraAltIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <>
            <LazyLoadImage
              effect="blur"
              alt="profile photo"
              src={ImageUploadProgess.url}
              width={width}
              height={height}
              style={{ borderRadius: borderRadius }}
            />
            <div style={{ position: "absolute", bottom: -5, right: -5 }}>
              <Tooltip title="delete image">
                <IconButton
                  onClick={async () => {
                    await deleteImageFromStorage(
                      "profilePhotos",
                      ImageUploadProgess.name
                    );

                    setImageUploadProgess((prev) => {
                      return {
                        ...prev,
                        title: "Upload done!",
                        url: "",
                      };
                    });
                  }}
                >
                  <DeleteForeverIcon color="error" />
                </IconButton>
              </Tooltip>
            </div>
          </>
        )}
      </Box>
      {ImageUploadProgess.progress > 0 && (
        <Typography variant="caption" color="textPrimary">
          {ImageUploadProgess.title}
        </Typography>
      )}
      <input
        type="file"
        accept="image/x-png,image/jpeg,image/gif"
        //@ts-ignore
        ref={mediaRef}
        onChange={uploadMedia}
        style={{ visibility: "hidden", height: 5 }}
        multiple={false}
      />
    </Stack>
  );
};

export default AccountProfilePhoto;
