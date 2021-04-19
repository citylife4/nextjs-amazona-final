/* eslint-disable react/display-name */
import React, {
  useState,
  useCallback,
  useRef,
  forwardRef,
  useContext,
} from 'react';
import {   useStyles } from '../utils/styles';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Uploady, {
  withRequestPreSendUpdate,
  useItemFinalizeListener,
} from '@rpldy/uploady';
import UploadPreview, { PREVIEW_TYPES } from '@rpldy/upload-preview';
import { cropImage } from '../utils/image';
import { Box, Button, CircularProgress } from '@material-ui/core';
import { asUploadButton } from '@rpldy/upload-button';
import { Store } from './Store';

const CROP_MIN_WIDTH = 500;
const CROP_MIN_HEIGHT = 500;
const ItemPreviewWithCrop = withRequestPreSendUpdate((props) => {
  const {
    id,
    url,
    isFallback,
    type,
    updateRequest,
    requestData,
    previewMethods,
    imageType,
  } = props;
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [crop, setCrop] = useState({  width:CROP_MIN_WIDTH,height:CROP_MIN_HEIGHT, x:0, y:0, aspect: 1 / 1 });
  const { dispatch } = useContext(Store);

  useItemFinalizeListener((item) => {
    if (item.uploadResponse !== 'cancel') {
      dispatch({
        type: 'UPLOADY_FINISH_UPLOAD',
        payload: { imageType, imageUrl: item.uploadResponse.data.secure_url },
      });
    }
    setLoading(false);
    setFinished(true);
  }, id);

  const onUploadCrop = useCallback(async () => {
    if (updateRequest && (crop?.height || crop?.width)) {
      const croppedFile = await cropImage(url, requestData.items[0].file, crop);
      requestData.items[0].file = croppedFile;
      setLoading(true);
      updateRequest({ items: requestData.items });
    }
  }, [url, requestData, updateRequest, crop]);

  const onUploadCancel = useCallback(() => {
    updateRequest(false);
    if (previewMethods.current?.clear) {
      previewMethods.current.clear();
    }
  }, [updateRequest, previewMethods]);

  const classes = useStyles();
  return isFallback || type !== PREVIEW_TYPES.IMAGE ? (
    <img src={url} alt="fallback img" />
  ) : (
    <>
      {requestData && !finished ? (
        <ReactCrop
        minWidth={CROP_MIN_WIDTH}
        minHeight={CROP_MIN_HEIGHT}
          src={url}
          crop={crop}
          onChange={setCrop}
          onComplete={setCrop}
          className={classes.cropMainContent}
        />
      ) : (
        ''
      )}
      {!finished && updateRequest && crop &&
          <Box>
            <Button disabled={loading} variant="contained" onClick={onUploadCrop} >
              Upload
            </Button>
            <Button  disabled={loading} onClick={onUploadCancel} >
              Cancel
              </Button> 
          </Box>
      }
      {loading && <CircularProgress />}
    </>
  );
});

const DivUploadButton = asUploadButton(
  forwardRef((props, ref) => (
    <Button
      {...props}
      variant="contained" >
      {props.children}
      
    </Button>
  ))
);

export default function FileUploader(props) {
  const previewMethodsRef = useRef();
  const { state } = useContext(Store);
  const { token } = state.userInfo;
  return (
    <Uploady
      destination={{
        url: '/api/upload',
        headers: { authorization: `Bearer ${token}` },
      }}
    >
      <Box>
        <DivUploadButton>{props.caption}</DivUploadButton>
        <Box>
          <UploadPreview
            PreviewComponent={ItemPreviewWithCrop}
            previewComponentProps={{
              previewMethods: previewMethodsRef,
              imageType: props.imageType,
            }}
            previewMethodsRef={previewMethodsRef}
            fallbackUrl="https://icon-library.net/images/image-placeholder-icon/image-placeholder-icon-6.jpg"
          />
        </Box>
      </Box>
    </Uploady>
  );
}
