import React from 'react';
import { IconButton } from '@mui/material';
import { Star, StarBorder } from '@mui/icons-material';
import styles from './styles';

const FavoriteButton = ({ isFavorite, onToggleFavorite }) => {
    return (
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        {...styles.buttonProps} 
      >
        {isFavorite ? (
          <Star {...styles.iconProps(isFavorite)} /> // Apply the icon styles for favorite
        ) : (
          <StarBorder {...styles.iconProps(isFavorite)} /> // Apply the icon styles for non-favorite
        )}
      </IconButton>
    );
  };
  
  export default FavoriteButton;