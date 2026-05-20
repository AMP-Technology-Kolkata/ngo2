import TeamSection from "../components/Team";

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
    const isActive = officeData.data?.enabled_services?.includes("staff");

    if (!isActive) return;

    const res = await fetch(`${process.env.BACKLINK}/public/staff`, {
      headers: {
        "x-api-key": process.env.API_KEY,
        "office-id": process.env.OFFICE,
      },
      next: {
        revalidate: 1000,
      },
    });

    if (!res.ok) {
      return console.error(`Failed to fetch staff data: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

export default async function TeamPage() {
  const staffData = await getData();
  // console.log(staffData);
  const teamActive = staffData && staffData.data?.length > 0;

  return <TeamSection data={staffData?.data || []} active={teamActive} />;
}
