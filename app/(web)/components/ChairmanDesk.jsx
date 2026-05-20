import Image from "next/image";
import styles from "../styles/desk.module.css";

async function getData() {
  const res = await fetch(process.env.BACKLINK + "/public/people", {
    headers: {
      "x-api-key": process.env.API_KEY,
      "office-id": process.env.OFFICE,
    },
    next: {
        revalidate: 1000,
      },
  });
  if (!res.ok) {
    return res.statusText;
  }
  return res.json();
}
async function getTitleData() {
  const res = await fetch(process.env.BACKLINK + "/public/headings", {
    headers: {
      "x-api-key": process.env.API_KEY,
      "office-id": process.env.OFFICE,
    },
    next: {
        revalidate: 1000,
      },
  });
  if (!res.ok) {
    return res.statusText;
  }
  return res.json();
}
export default async function ChairmanDesk({ showFullDescription = true }) {
  const deskdata = await getData();
  const titeldata = await getTitleData();
  const data = deskdata?.data;
  const title = titeldata?.data?.people || " Desk";

  return (
    <section className="backimge chairman-section">
      <div className={styles.deskwrpper}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionKicker}>Leadership</span>
          <h2 className={styles.sectionTitle}>{title}</h2>
          <p className={styles.sectionSubtitle}>A brief message from the leadership team presented in a clean, public-facing format.</p>
        </div>

        {!data?.length && <div className={styles.emptyState}>Chairman desk information is not available right now.</div>}

        {data?.map((person, index) => (
          <div key={index} className={styles.chairmanDesk}>
            <div className={styles.personMeta}>
              <span className={styles.nameTag}>Chairman Desk</span>
              <h3 className={styles.personName}>{person.name}</h3>
              <p className={styles.deskDetails}>
                {showFullDescription
                  ? person.about
                  : `${person.about?.slice(0, 500) || ""}...`}
                {!showFullDescription && (
                  <a href="/Desk" className={styles.readMoreLink}>
                    Read More
                  </a>
                )}
              </p>
              <div className={styles.featureRow}>
                <span className={styles.featureChip}>Public Leadership</span>
                <span className={styles.featureChip}>Citizen Message</span>
                <span className={styles.featureChip}>Official Desk</span>
              </div>
            </div>
            <div className={styles.imageSection}>
              <Image
                src={`${process.env.BACKPUBLIC}/${person.image?.slice(7)}`}
                alt={person.name}
                width={260}
                height={320}
                className={styles.portrait}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
