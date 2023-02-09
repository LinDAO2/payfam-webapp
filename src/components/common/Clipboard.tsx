import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { IconButton, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

interface Props {
  text: string;
}
const Clipboard = ({ text }: Props) => {
  const [copied, setCopied] = useState(false);

  return (
    <Stack>
      {copied && (
        <Typography variant="caption" color="textSecondary">
          Copied!
        </Typography>
      )}
      <CopyToClipboard
        text={text}
        onCopy={() => {
          setCopied(true);

          setTimeout(() => {
            setCopied(false);
          }, 1000);
        }}
      >
        <IconButton disabled={copied}>
          <ContentCopyIcon sx={{ color: "#000" }} />
        </IconButton>
      </CopyToClipboard>
    </Stack>
  );
};

export default Clipboard;
