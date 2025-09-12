import HeroSection from "../components/Hero";

const getProjectData = async () => {
  try {
    const res = await fetch(`${process.env.BACKLINK}/public/officeData`, {
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

  return (
    <div>
      <HeroSection data={videos?.data?.video_banner} />
    </div>
  );
}
