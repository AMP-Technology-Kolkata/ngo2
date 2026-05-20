import styles from "./page.module.css";
import About from "./About/page";
import Hero from "./Hero/page";
import Team from "./Team/page";
import ChairmanDesk from "./Desk/page";
import Notifications from "./Notificatons/page";
import Project from "./project/page";
import { GallerySmall } from "./gallery/page";
import VideoGallery from "./videos/page";
import Uselinks from "./components/UsefulLinks";
import ServiceGrid from "./service/page";
import Tender from "./Tender/page";
import Ads from "./Ads/page";
import StatsCard from "./StatsCard/page";

async function getData() {
  try {
    let officeData = await fetch(`${process.env.BACKLINK}/public/officeData`, {
      headers: {
        "x-api-key": process.env.API_KEY,
        "office-id": process.env.OFFICE,
      },
      cache: "no-store",
    });
    officeData = await officeData.json();
    const isActive = officeData.data?.enabled_services?.includes("faq");

    // if (!isActive) return;

    const res = await fetch(`${process.env.BACKLINK}/public/useful_links`, {
      headers: {
        "x-api-key": process.env.API_KEY,
        "office-id": process.env.OFFICE,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return console.error(`Failed to fetch service data: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

export default async function Home() {
  const usefulinks = await getData();
  const backimages = await getData();

  return (
    <main className={styles.main}>
      <Hero />
      <Tender />
      <StatsCard />
      <About showFullDescription={false} />
      <ChairmanDesk showFullDescription={false} />
      <Notifications />
      <GallerySmall />
      <Ads />
      <ServiceGrid />
      <Team />
      <VideoGallery />
      <Project imagedata={backimages?.data} />
      <Uselinks data={usefulinks?.data} />
    </main>
  );
}
