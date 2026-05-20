import Tendersec from "../components/Tender";
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
    console.log("officeData", officeData);

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

    return res.json();
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

const Tender = async () => {
  let notification = await getNoticeData();
  notification = notification?.data.filter(
    (item) => item.type === "notification"
  );
  console.log("notification", notification);

  return <Tendersec notification={notification} />;
};

export default Tender;
