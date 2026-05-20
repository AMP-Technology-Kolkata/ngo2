import Gallery from "../components/Gallery";

async function getData() {
  try {
    let officeData = await fetch(`${process.env.BACKLINK}/public/officeData`, {
      headers: {
        "x-api-key": process.env.API_KEY,
        "office-id": process.env.OFFICE,
      },
      next: {
        revalidate: 1000,
      },
    });
    officeData = await officeData.json();
    const isActive = officeData.data?.enabled_services?.includes("gallery");

    if (!isActive) return;

    const res = await fetch(`${process.env.BACKLINK}/public/gallery`, {
      headers: {
        "x-api-key": process.env.API_KEY,
        "office-id": process.env.OFFICE,
      },
      next: {
        revalidate: 1000,
      },
    });

    if (!res.ok) {
      return console.error(`Failed to fetch gallery data: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

export default async function GallerySection() {
  const data = await getData();
  if (!data || data.data?.length === 0) return;

  return <Gallery data={data?.data} />;
}

export async function GallerySmall() {
  const data = await getData();
  if (!data || data.data?.length === 0) return;
  data.data = data?.data.slice(0, 8);
  return <Gallery data={data?.data} loadButton={data?.data?.length > 7} />;
}
