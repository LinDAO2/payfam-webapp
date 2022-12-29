
import LinearProgress, {
    LinearProgressProps,
  } from "@mui/material/LinearProgress";
  import Typography from "@mui/material/Typography";
  import Box from "@mui/material/Box";
  
  export default function LinearProgressWithLabel(
    props: LinearProgressProps & { value: number; title?: string }
  ) {
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          {props.title && (
            <Typography variant="caption" color="textPrimary">
              {props.title}
            </Typography>
          )}
  
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            props.value
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }
  