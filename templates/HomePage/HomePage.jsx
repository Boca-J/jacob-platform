import React, { useState,useEffect } from 'react';
import { fetchUserData } from '@/libs/redux/thunks/user'
import { auth } from '@/libs/redux/store';
import { useDispatch } from 'react-redux';

import { Grid, Typography } from '@mui/material';
import Image from 'next/image';

import ImageURLs from '@/assets/urls';

import styles from './styles';

import { firestore } from '@/libs/redux/store';
import { ToolsListingContainer } from '@/tools';
import Filters from '@/tools/components/Filter/Filters';
import SearchBar from '@/tools/components/SearchBar/SearchBar';
import SortDropdown from '@/tools/components/SortDorpdown/SortDropdown';
import ReccomendedForYou from '@/tools/views/ReccomendedForYou/ReccomendedForYou';
import { updateFavorites } from '@/libs/services/user/updateFavorites';

const TABS = [
  'All',
  'New',
  'Planning',
  'Assessments',
  'Assignments',
  'Writing',
  'Study',
];

const HomePage = ({ data: unsortedData, loading }) => {
  const [currentTab, setCurrentTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('Most Popular');
  const [favorites, setFavorites] = useState([]); // State to track favorite tool IDs
  const dispatch = useDispatch();


  useEffect(() => {
    if (auth.currentUser?.uid) {
      dispatch(fetchUserData({ firestore, id: auth.currentUser.uid }))
        .unwrap()
        .then((userMetadata) => {
          setFavorites(userMetadata.favoriteToolsId || []);
        })
        .catch(() => {
        
          setFavorites([]); 
        });
    }
  }, []);
  

  const handleToggleFavorite = (toolId) => {
    const userId = auth.currentUser?.uid; // Ensure the user is authenticated
    if (!userId) {
      console.error('User not authenticated');
      return;
    }
    setFavorites((prevFavorites) => {
      const isFavorite = prevFavorites.includes(toolId);
  
      updateFavorites(userId, toolId, isFavorite ? 'remove' : 'add');
  
  
      return isFavorite
        ? prevFavorites.filter((favId) => favId !== toolId) 
        : [...prevFavorites, toolId];
    });
  };

  const data = [...(unsortedData || [])].sort((a, b) => a.id - b.id);

  // Filter and search logic
  const filteredData = data.filter((tool) => {
    const matchesSearch = tool.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTab = currentTab === 'All' || tool.category === currentTab;
    return matchesSearch && matchesTab;
  });

  const sortedData = filteredData.sort((a, b) => {
    if (sortOption === 'A-Z') return a.name.localeCompare(b.name);
    if (sortOption === 'Z-A') return b.name.localeCompare(a.name);
    if (sortOption === 'Most Popular') return b.popularity - a.popularity;
    if (sortOption === 'Recently Added')
      return new Date(b.date) - new Date(a.date);
    return 0;
  });

  const favoriteTools = sortedData.filter((tool) =>
    favorites.includes(tool.id)
  );

  // Welcome Banner
  const renderWelcomeBanner = () => (
    <Grid {...styles.bannerGridProps}>
      <Image
        src={ImageURLs.WelcomeBannerImg}
        alt="welcome_banner_img"
        {...styles.image1Props}
      />
      <Grid>
        <Typography {...styles.titleProps}>
          Hello! Welcome to Marvel AI Tools. 👋
        </Typography>
        <Typography {...styles.subtitleProps}>
          Made for educators. Hello! I&apos;m Marvel AI, your AI teaching
          assistant. We are here to support you on your journey as a teacher,
          mentor, and more!
        </Typography>
      </Grid>
    </Grid>
  );

  // Filters and Search
  const renderFilters = () => (
    <Grid container direction="column" spacing={2}>
      <Grid
        item
        container
        alignItems="center"
        spacing={2}
        justifyContent="space-between"
      >
        <Grid item>
          <SearchBar onSearch={setSearchQuery} />
        </Grid>
        <Grid item>
          <SortDropdown sortOption={sortOption} setSortOption={setSortOption} />
        </Grid>
      </Grid>
      <Grid item>
        <Filters
          tabs={TABS}
          activeTab={currentTab}
          setActiveTab={setCurrentTab}
        />
      </Grid>
    </Grid>
  );

  return (
    <Grid {...styles.mainGridProps}>
      {renderWelcomeBanner()}
      {renderFilters()}
      <ToolsListingContainer
        data={favoriteTools}
        loading={loading}
        favorites={favorites}
        handleToggleFavorite={handleToggleFavorite}
        category="Favorites"
      />
      <ReccomendedForYou data={sortedData} loading={loading} />
      <ToolsListingContainer
        data={sortedData}
        loading={loading}
        favorites={favorites}
        handleToggleFavorite={handleToggleFavorite}
        category="Marvel Tools"
      />
    </Grid>
  );
};

export default HomePage;
