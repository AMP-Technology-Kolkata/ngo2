"use server";

const PATHS = {
  village: "village",
  post_office: "post_office",
  police_station: "police_station",
  sansad: "sansad",
  id_type: "id_type",
};

async function fetchMaster(type) {
  const path = PATHS[type];
  const url = `${process.env.BACKLINK}/public/${path}`;

  try {
    const res = await fetch(url, {
      headers: {
        "x-api-key": process.env.API_KEY,
        "office-id": process.env.OFFICE,
      },
      cache: "no-store",
    });
    const json = await res.json();
    console.log(`[master-data] ${type} => status:${res.status} count:${json?.data?.length ?? "N/A"}`);
    if (!res.ok) {
      console.error(`[master-data] ${type} failed body:`, json);
      return [];
    }
    return json?.data || [];
  } catch (err) {
    console.error(`[master-data] ${type} error:`, err.message);
    return [];
  }
}

export async function getFormMasterData() {
  const [village, post_office, police_station, sansad, id_type] = await Promise.all([
    fetchMaster("village"),
    fetchMaster("post_office"),
    fetchMaster("police_station"),
    fetchMaster("sansad"),
    fetchMaster("id_type"),
  ]);
  return { village, post_office, police_station, sansad, id_type };
}