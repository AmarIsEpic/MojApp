import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useEffect, useState } from 'react';

export const FavoritesContext = createContext({
  favorites: [],
  addFavorite: async () => {},
  removeFavorite: async () => {},
  isFavorite: () => false,
});

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from AsyncStorage on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const data = await AsyncStorage.getItem('favorite_cities');
        if (data) {
          setFavorites(JSON.parse(data));
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    
    loadFavorites();
  }, []);

  // Save favorites to AsyncStorage when they change
  useEffect(() => {
    if (!isLoaded) return;
    const saveFavorites = async () => {
      try {
        await AsyncStorage.setItem('favorite_cities', JSON.stringify(favorites));
      } catch (error) {
        console.error('Error saving favorites:', error);
      }
    };
    saveFavorites();
  }, [favorites, isLoaded]);

  const addFavorite = useCallback(async (city) => {
    if (!city) return;
    setFavorites((prev) => {
      if (prev.includes(city)) return prev;
      return [...prev, city];
    });
  }, []);

  const removeFavorite = useCallback(async (city) => {
    setFavorites((prev) => prev.filter((item) => item !== city));
  }, []);

  const isFavorite = useCallback((city) => {
    return favorites.includes(city);
  }, [favorites]);

  const value = {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

