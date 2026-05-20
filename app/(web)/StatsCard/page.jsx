import styles from "../styles/StatsCard.module.css";

async function getCountData() {
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
    const isActive = officeData.data?.enabled_services?.includes("counter");

    // if (!isActive) return null;

    const res = await fetch(`${process.env.BACKLINK}/public/counter`, {
      headers: {
        "x-api-key": process.env.API_KEY,
        "office-id": process.env.OFFICE,
      },
      next: {
        revalidate: 1000,
      },
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
export default async function StatsCard() {
  const count = await getCountData();
  const data = count?.data?.counter;

  return (
    <div className={styles.grid}>
      {data?.map((item, index) => (
        <div key={index} className={styles.card}>
          <div className={styles.header}>
            {/* <span className={styles.percentage}>{item.percentage}%</span> */}
            <span className={styles.icon}>📈</span>
          </div>
          <h1 className={styles.number}>{item.value}</h1>
          <p className={styles.description}>{item.text}</p>
        </div>
      ))}
    </div>
  );
}
