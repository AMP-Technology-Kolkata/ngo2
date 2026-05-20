import HeroSection from "../components/Hero";

const getProjectData = async () => {
  try {
    const res = await fetch(`${process.env.BACKLINK}/public/officeData`, {
      headers: {
        "x-api-key": process.env.API_KEY,
        "office-id": process.env.OFFICE,
      },
      next: {
        revalidate: 1000,
      },
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
  const bannerUrl = videos?.data?.video_banner;

  return (
    <main className="hero-page hero-page--video">
      <section className="hero-frame hero-frame--video">
        {bannerUrl ? (
          <HeroSection data={bannerUrl} />
        ) : (
          <div className="hero-empty-state">
            <h2>Banner content is not available right now</h2>
            <p>Please check back shortly. The official banner feed is temporarily unavailable, but the page layout is ready for updates.</p>
          </div>
        )}
      </section>
    </main>
  );
}
