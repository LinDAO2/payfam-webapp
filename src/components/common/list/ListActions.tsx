import styled from "@emotion/styled";
import { FC, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import { has } from "lodash";
import LoadingCircle from "@/components/common/LoadingCircle";
import { Box } from "@mui/material";
import { generateUUIDV4 } from "@/utils/funcs";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Confirmation from "@/components/modals/Confirmation";

const ListActionDropDown = styled(Box)`
  position: absolute;
  top: 35px;
  left: 0;
  width: 200px;
  border-radius: 10px;
  text-wrap: wrap;
  z-index: 200;
`;

const ListActionDropDownItem = styled(Box)`
  // height: 30px;
  padding: 5px 10px;
  border-bottom: 1px solid #efecec;
  &:hover {
    background-color: #abb;
    cursor: pointer;
  }
  &:first-of-type {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }
  &:nth-last-of-type(1) {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    border-bottom: none;
  }
`;

const Wrapper = styled.div`
  width: fit-content;
  position: relative;
`;
type dropDownItem = {
  name: string;
  visible: boolean;
  action: () => void;
  shouldConfirm?: boolean;
  caption?: string;
};
interface Props {
  dropDownList: dropDownItem[];
  caption?: string;
  loading?: boolean;
}
const ListActions: FC<Props> = ({ dropDownList, caption, loading }: Props) => {
  const [visible, setVisible] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [listIndex, setListIndex] = useState(0);
  const close = () => setVisible(!visible);
  const closeConfirm = () => setConfirm(!confirm);

  return (
    <Wrapper>
      <Confirmation
        visible={confirm}
        close={() => {
          closeConfirm();
        }}
        action={async () => {
          dropDownList[listIndex].action();
        }}
        caption={
          dropDownList[listIndex].caption ? dropDownList[listIndex].caption : ""
        }
      />
      <ClickAwayListener
        mouseEvent="onMouseDown"
        touchEvent="onTouchStart"
        onClickAway={() => {
          setVisible(!visible);
        }}
      >
        <>
          {loading ? (
            <div
              style={{
                padding: "8px",
                width: "fit-content",
                marginRight: "20px",
              }}
            >
              <LoadingCircle />
            </div>
          ) : (
            <IconButton onClick={() => setVisible(!visible)} sx={{ mr: 2 }}>
              <EditIcon />
            </IconButton>
          )}

          {visible && (
            <ListActionDropDown sx={{ bgcolor: "background.default" }}>
              {dropDownList.map(
                (item, index) =>
                  item.visible && (
                    <ListActionDropDownItem
                      sx={{ bgcolor: "background.default" }}
                      onClick={() => {
                        if (
                          has(item, "shouldConfirm") &&
                          item.shouldConfirm === false
                        ) {
                          item.action();
                          close();
                        } else {
                          setConfirm(!confirm);
                          setListIndex(index);
                          close();
                        }
                      }}
                      key={generateUUIDV4()}
                    >
                      {item.name}
                    </ListActionDropDownItem>
                  )
              )}
            </ListActionDropDown>
          )}
        </>
      </ClickAwayListener>
    </Wrapper>
  );
};

export default ListActions;
