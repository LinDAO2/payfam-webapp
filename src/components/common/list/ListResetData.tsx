import Refresh from "@mui/icons-material/Refresh";
import Button from "@mui/material/Button";

interface Props {
  onClick: () => void;
  title: string;
}

const ListResetData = ({ onClick, title }: Props) => {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={onClick}
      startIcon={<Refresh />}
      style={{ width: "fit-content", textTransform: "capitalize" }}
    >
      {title}
    </Button>
  );
};

export default ListResetData;
