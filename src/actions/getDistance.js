import haversine from "haversine-distance";

export const getDistance = ([lat1, lon1], [lat2, lon2]) => {
  const distanceInMeters = Math.round(
    haversine({ lat: lat1, lon: lon1 }, { lat: lat2, lon: lon2 })
  );

  if (distanceInMeters < 1000) {
    return distanceInMeters + " m";
  } else {
    const distanceInKilometers = (distanceInMeters / 1000)
      .toFixed(2)
      .replace(".", ",");
    return distanceInKilometers + " km";
  }
};
