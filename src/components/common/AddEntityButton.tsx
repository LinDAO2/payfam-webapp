import { Box, ButtonBase, styled } from "@mui/material";
import { ReactElement } from "react";

const Wrapper = styled(Box)`
  width: 200px;
  padding: 10px;
  border-radius: 5px;
  background-color: #FD3205;
  color: #fff;
  font-weight: bolder;
  font-family: Montserrat;
  font-size: 1.2em;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;

  :hover {
    cursor: pointer;
    background-color: #FD7B5F;
  }
`;

interface Props {
  title: string;
  action: () => void;
  icon: ReactElement;
}
const AddEntityButton = ({ title, icon, action }: Props) => {
  return (
    <ButtonBase onClick={action}>
      <Wrapper boxShadow={2}>
        {title} {icon}
      </Wrapper>
    </ButtonBase>
  );
};

export default AddEntityButton;
