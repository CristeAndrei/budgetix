import {
  Box,
  Divider,
  IconButton,
  LinearProgress,
  Typography,
  Paper,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import { removeUploadingFiles } from "../../redux/fluxesSlice";
import { useDispatch, useSelector } from "react-redux";

export default function ListUploadingFiles() {
  const { uploadingFiles } = useSelector(({ fluxes }) => fluxes);
  const dispatch = useDispatch();

  function removeFailedProgress(fileId) {
    dispatch(removeUploadingFiles({ id: fileId }));
  }

  return (
    <>
      {uploadingFiles.length ? (
        uploadingFiles.map((file) => (
          <>
            <Divider />
            <Box
              display="flex"
              //alignItems='flex-start'
              alignItems="center"
              mt={1}
              mb={1}
              ml={1}
              key={file.id}
            >
              <Box width="100%">
                <Typography noWrap>{file.name}</Typography>
                <LinearProgress
                  display="inline"
                  variant="determinate"
                  value={file.progress * 100}
                />
              </Box>
              <Box mt={3} alignSelf="flex-end">
                <IconButton
                  disabled={!file.error}
                  size="small"
                  onClick={() => removeFailedProgress(file.id)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </>
        ))
      ) : (
        <>
          <Paper>
            <Typography>No files are being uploaded</Typography>
          </Paper>
        </>
      )}
    </>
  );
}
