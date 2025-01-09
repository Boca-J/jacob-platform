import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, IconButton } from '@mui/material';
import { Star, StarBorder } from '@mui/icons-material';
import ToolOutputHistoryDrawer from '../../components/ToolOutputHistoryDrawer/ToolOutputHistoryDrawer';
import styles from '../ToolsListingContainer/styles'; // Ensure you use similar styles

const Favorites = ({ favoriteTools = [], handleToggleFavorite, favorites }) => {
  const renderTitle = () => (
    <Grid {...styles.headerGridProps}>
      <Typography {...styles.categoryTitleProps}>
        Favorites {favoriteTools && `(${favoriteTools.length})`}
      </Typography>
    </Grid>
  );

  const renderCards = () => (
    <Grid {...styles.containerGridProps}>
      <Grid {...styles.innerListGridProps}>
        {favoriteTools.length > 0 ? (
          favoriteTools.map((tool) => (
            <Grid item key={tool.id} xs={12} sm={6} md={4}>
              <ToolOutputHistoryDrawer data={tool} />
              <IconButton
                onClick={() => handleToggleFavorite(tool.id)}
                sx={{ position: 'absolute', bottom: 16, right: 16 }}
              >
                {favorites.includes(tool.id) ? (
                  <Star sx={{ color: '#9d74ff' }} />
                ) : (
                  <StarBorder />
                )}
              </IconButton>
            </Grid>
          ))
        ) : (
          <Typography />
        )}
      </Grid>
    </Grid>
  );

  return (
    <Grid {...styles.mainGridProps}>
      {renderTitle()}
      {renderCards()}
    </Grid>
  );
};

Favorites.propTypes = {
  favoriteTools: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      // Add other properties of the tool object here
    })
  ),
  handleToggleFavorite: PropTypes.func.isRequired,
  favorites: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ).isRequired,
};

Favorites.defaultProps = {
  favoriteTools: [],
};

export default Favorites;
