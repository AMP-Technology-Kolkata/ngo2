import ProjectsActivities from "../components/ProjectsActivities";

async function getProjectData() {
  try {
    let officeData = await fetch(`${process.env.BACKLINK}/public/officeData`, {
      headers: {
        "x-api-key": process.env.API_KEY,
        "office-id": process.env.OFFICE,
      },
      cache: "no-store",
    });
    officeData = await officeData.json();
    const isActive = officeData.data?.enabled_services?.includes("activity");

    // if (!isActive) return null;

    const res = await fetch(`${process.env.BACKLINK}/public/activity`, {
      headers: {
        "x-api-key": process.env.API_KEY,
        "office-id": process.env.OFFICE,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`Failed to fetch project data: ${res.statusText}`);
      return null;
    }

    return {
      data: await res.json(),
      bgimage: officeData.data.activity_bg_iamge,
    };
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

export default async function ProjectsPage() {
  const projects = await getProjectData();
  let projectsActive = true;
  if (!projects || projects.data?.data?.length === 0) projectsActive = false;

  return (
    <ProjectsActivities
      data={projects?.data?.data || []}
      bgImgae={projects?.bgimage}
      active={projectsActive}
    />
  );
}
