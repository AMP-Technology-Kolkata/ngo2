import Image from "next/image";
import styles from "../styles/desk.module.css";

async function getData() {
  const res = await fetch(process.env.BACKLINK + "/public/people", {
    headers: {
      "x-api-key": process.env.API_KEY,
      "office-id": process.env.OFFICE,
    },
    cache: "no-store",
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
    cache: "no-store",
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
    <div className="backimge">
      <div className={styles.deskwrpper}>
        {data?.map((person, index) => (
          <div key={index} className={styles.chairmanDesk}>
            <div className={styles.textSection}>
              <h2 className="display-10 fw-bold" style={{ color: "#192f59" }}>
                {title}
              </h2>
              <h4 style={{ color: "#192f59" }}>{person.name}</h4>

              <p className={styles.deskDetails}>
                {showFullDescription
                  ? person.about
                  : `${person.about.slice(0, 500)}...`}
                {!showFullDescription && (
                  <a href="/Desk" style={{ color: "blue", marginLeft: "5px" }}>
                    Read More
                  </a>
                )}
              </p>
            </div>
            <div className={styles.imageSection}>
              <Image
                src={`${process.env.BACKPUBLIC}/${person.image?.slice(7)}`}
                alt={person.name}
                width={200}
                height={250}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
