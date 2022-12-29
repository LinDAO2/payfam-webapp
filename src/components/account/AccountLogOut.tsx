import { auth } from "@/configs/firebase";
import Button from "@mui/material/Button";
import { signOut } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Confirmation from "../modals/Confirmation";

const AccountLogOut = () => {
  const [confirm, setConfirm] = useState(false);
  const navigate = useNavigate();
  return (
    <>
      <Confirmation
        visible={confirm}
        close={() => {
          setConfirm(!confirm);
        }}
        title="You are about to be logged out!"
        caption="."
        action={() => {
          signOut(auth);
          setTimeout(() => {
            navigate("/");
          }, 500);
        }}
      />
      <Button
        variant="text"
        sx={{ mr: 1, color: "primary.dark", fontSize: 16 }}
        onClick={() => {
          setConfirm(!confirm);
        }}
      >
        Logout
      </Button>
    </>
  );
};

export default AccountLogOut;
