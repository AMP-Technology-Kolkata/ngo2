import VideoGallery from "../components/VideoGallery";

const getProjectData = async () => {
  try {
    const res = await fetch(`${process.env.BACKLINK}/public/video-gallery`, {
      headers: {
        "x-api-key": process.env.API_KEY,
        "office-id": process.env.OFFICE,
      },
      cache: "no-store",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching project data:", error);
    return null;
  }
};

export default async function videosPage() {
  const videos = await getProjectData();
  let videosActive = true;
  if (!videos || videos.data?.length === 0) videosActive = false;

  return (
    <div>
      <VideoGallery data={videos?.data || []} active={videosActive} />
    </div>
  );
}
