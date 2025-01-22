import { useState, useEffect, useMemo } from "react";
import { fetchUserData } from "@/libs/redux/thunks/user";
import { auth } from "@/libs/redux/store";
import { useDispatch } from "react-redux";

import { Grid, Typography } from "@mui/material";
import Image from "next/image";
import { debounce } from "lodash";

import ImageURLs from "@/assets/urls";

import styles from "./styles";

import { firestore } from "@/libs/redux/store";
import { ToolsListingContainer } from "@/tools";
import Filters from "@/tools/components/Filters";
import SearchBar from "@/tools/components/SearchBar";
import SortDropdown from "@/tools/components/SortDropdown";
import Favorites from "@/tools/views/Favorites";
import RecomendedForYou from "@/tools/views/RecomendedForYou";
import SearchResults from "@/tools/views/SearchResults";
import { updateFavorites } from "@/libs/services/user/updateFavorites";

const TABS = [
  "All",
  "New",
  "Planning",
  "Assessments",
  "Assignments",
  "Writing",
  "Study",
];

const HomePage = ({ data: unsortedData, loading }) => {
  const [currentTab, setCurrentTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Most Popular");
  const [favorites, setFavorites] = useState([]);
  const [toolsFrequency, setToolsFrequency] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    // fetch user data and use the favortietools and toolsfrequency columns to set the states
    const fetchData = async () => {
      if (auth.currentUser.uid) {
        try {
          const userData = await dispatch(
            fetchUserData({ firestore, id: auth.currentUser.uid })
          ).unwrap();
          setFavorites(userData.favoriteToolsId || []);
          setToolsFrequency(userData.toolsFrequency || []);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchData();
  }, []);

  const handleToggleFavorite = (toolId) => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.error("User not authenticated");
      return;
    }
    setFavorites((prevFavorites) => {
      const isFavorite = prevFavorites.includes(toolId);

      updateFavorites(userId, toolId, isFavorite ? "remove" : "add");

      return isFavorite
        ? prevFavorites.filter((favId) => favId !== toolId)
        : [...prevFavorites, toolId];
    });
  };

  const data = [...(unsortedData || [])].sort((a, b) => a.id - b.id);

  const sortedData = data.sort((a, b) => {
    if (sortOption === "A-Z") return a.name.localeCompare(b.name);
    if (sortOption === "Z-A") return b.name.localeCompare(a.name);
    if (sortOption === "Most Popular") return b.popularity - a.popularity;
    if (sortOption === "Recently Added")
      return new Date(b.date) - new Date(a.date);
    return 0;
  });

  const handleSearch = debounce((query) => {
    setSearchQuery(query);
  }, 300);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => handleSearch.cancel();
  }, [handleSearch]);

  const filteredTools = sortedData.filter((tool) => {
    return currentTab === "All" || tool.category.includes(currentTab);
  });

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

  const renderFilters = () => (
    <Grid {...styles.containerGridProps}>
      <Grid {...styles.innerContainerGridProps}>
        <Grid item>
          <SearchBar onSearch={handleSearch} />
        </Grid>
        <Grid item>
          <SortDropdown sortOption={sortOption} setSortOption={setSortOption} />
        </Grid>
      </Grid>
      <Grid item {...styles.filtersGridProps}>
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

      {searchQuery ? (
        // Render search results if searchQuery is not empty
        <SearchResults
          data={filteredTools}
          loading={loading}
          searchQuery={searchQuery}
          favorites={favorites}
          handleToggleFavorite={handleToggleFavorite}
          category="Marvel Tools"
        />
      ) : (
        // Render other components if searchQuery is empty
        <>
          <Favorites
            data={filteredTools}
            loading={loading}
            favorites={favorites}
            handleToggleFavorite={handleToggleFavorite}
          />
          <RecomendedForYou
            data={filteredTools}
            loading={loading}
            toolsFrequency={toolsFrequency}
            favorites={favorites}
            handleToggleFavorite={handleToggleFavorite}
            category="Recommended For You"
          />
          <ToolsListingContainer
            data={filteredTools}
            loading={loading}
            favorites={favorites}
            handleToggleFavorite={handleToggleFavorite}
            category="Marvel Tools"
          />
        </>
      )}
    </Grid>
  );
};

export default HomePage;
