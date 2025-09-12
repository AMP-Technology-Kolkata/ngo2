import TenderNotifications from "../components/Notification";
import Tender from "../components/Tender";

async function getNoticeData() {
  try {
    let officeData = await fetch(`${process.env.BACKLINK}/public/officeData`, {
      headers: {
        "x-api-key": process.env.API_KEY,
        "office-id": process.env.OFFICE,
      },
      cache: "no-store",
    });
    officeData = await officeData.json();
    const isActive = officeData.data?.enabled_services?.includes("notice");

    if (!isActive) return null;

    const res = await fetch(`${process.env.BACKLINK}/public/notice`, {
      headers: {
        "x-api-key": process.env.API_KEY,
        "office-id": process.env.OFFICE,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`Failed to fetch notice data: ${res.statusText}`);
      return null;
    }

    return {
      data: await res.json(),
      bgimage: officeData.data.notification_bg_iamge,
      // notification: officeData.data.notification,
    };
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

async function getCountData() {
  try {
    let officeData = await fetch(`${process.env.BACKLINK}/public/officeData`, {
      headers: {
        "x-api-key": process.env.API_KEY,
        "office-id": process.env.OFFICE,
      },
      cache: "no-store",
    });
    officeData = await officeData.json();
    const isActive = officeData.data?.enabled_services?.includes("counter");

    // if (!isActive) return null;

    const res = await fetch(`${process.env.BACKLINK}/public/counter`, {
      headers: {
        "x-api-key": process.env.API_KEY,
        "office-id": process.env.OFFICE,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`Failed to fetch notice data: ${res.statusText}`);
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

export default async function Notice() {
  const notices = await getNoticeData();
  const count = await getCountData();

  const noticeActive = notices && notices.data?.data?.length > 0;

  return (
    <>
      <TenderNotifications
        data={notices?.data?.data || []}
        bgImgae={notices?.bgimage}
        noticeActive={noticeActive}
        count={count?.data?.counter}
      />
    </>
  );
}
