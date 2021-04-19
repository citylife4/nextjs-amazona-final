import axios from 'axios';
import { getErrorMessage } from '../utils/error';
import React, { useContext, useEffect, useState } from 'react';
import FileUploader from './FileUploader';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Modal,
  Typography,
} from '@material-ui/core';
import { Store } from './Store';
import { Alert } from '@material-ui/lab';
import { useStyles } from '../utils/styles';
import DeleteIcon from '@material-ui/icons/Delete';

export default function ImagePicker(props) {
 
  const [modalVisible, setModalVisible] = useState(false);

  const classes = useStyles(); 
  const { image, label, onImageSelect } = props;
  
  const [currentImage, setCurrentImage] = useState();
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const { state } = useContext(Store);
  const { uploady } = state;

  const deleteHandler = async (selectedImage) => {
    const imageUsages = selectedImage.usages.length >0? "It's been used here: " + selectedImage.usages.join('\n'):
    'It is unused.';
    if(window.confirm('Are you sure? '  + imageUsages)){
      try {
         await axios.delete('/api/images/' + encodeURIComponent(selectedImage));
      } catch (err) {
        console.log('error');
      }
    }
  }
  const selectImageHandler = (selectedImage) => {
    onImageSelect(selectedImage);
    setCurrentImage(selectedImage);
    setModalVisible(false);
  };

  useEffect(() => { 
    const fetchImages = async () => {
      try {
        const { data } = await axios.get('/api/users/images', {
          headers: { authorization: `Bearer ${state.userInfo.token}` },
        });
        setImages(data);
        setLoading(false);
      } catch (err) {
        setError(getErrorMessage(err));
        setLoading(false);
      }
    };
    fetchImages();
    setCurrentImage(image);
   
  }, [uploady]);
  const showModal = () => {
    setModalVisible(true);
  };
  const handleClose = () => {
    setModalVisible(false);
  };

  return (
    <Box>
      <Typography>{label || 'Select Image'}</Typography>
      <Box>
        <img
          className={classes.smallImage}
          src={currentImage || '/images/no-image.jpg'}
        ></img>
      </Box>
      <Box>
        <Button onClick={showModal} variant="contained">
          Pick Image
        </Button>
      </Box>
      <Modal
        open={modalVisible}
        className={classes.modal}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div className={classes.modalBody}>
          <Button
            onClick={handleClose}
            className={classes.closeButton}
            variant="contained"
          >
            x
          </Button>
          <FileUploader caption="Upload An Image"></FileUploader>
          <hr />
          <Typography>Or choose from image gallery</Typography>

          {loading ? (
            <CircularProgress></CircularProgress>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : images.length === 0 ? (
            <Alert severity="info">No image Found</Alert>
          ) : (
            <Grid container>
              {images.map((image) => (
                <Grid item key={image.url} className={classes.girdItem}>
                  <Button
                    variant="contained" className="image-picker-button"
                    onClick={()=> selectImageHandler(image.url)}
                  >
                    <img
                      className={classes.gridImage}
                      src={image.url}
                      alt={image.url}
                    />
                  <Button className="hidden-delete-button" onClick={(e)=>{e.stopPropagation();deleteHandler(image)}}><DeleteIcon   /></Button> 
                  </Button>                  
                  
                </Grid>
              ))}
             
            </Grid>
          )}
        </div>
      </Modal>
    </Box>
  );
}
