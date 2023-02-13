import { useState, useEffect } from "react";
import * as Location from "expo-location";

export const useLocation = () => {
  const [location, setLocation] = useState();

  useEffect(() => {
    async function setLocationWithPerms() {
      const permissions = await Location.requestForegroundPermissionsAsync();

      if (permissions.status === "granted") {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
      }
    }
    setLocationWithPerms();
  }, []);

  const updateLocation = async () => {
    const currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation);
  };

  return [location, updateLocation];
};