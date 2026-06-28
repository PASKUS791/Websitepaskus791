export const getImageUrl = (name) => {
  return new URL(`../assets/images/${name}`, import.meta.url).href;
};

export const getVideoUrl = (name) => {
  return new URL(`../assets/videos/${name}`, import.meta.url).href;
};
