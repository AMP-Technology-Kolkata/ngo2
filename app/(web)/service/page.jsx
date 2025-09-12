import { FaDribbble } from "react-icons/fa";

async function getData() {
  try {
    let officeData = await fetch(`${process.env.BACKLINK}/public/officeData`, {
      headers: {
        "x-api-key": process.env.API_KEY,
        "office-id": process.env.OFFICE,
      },
      next: {
        revalidate: 3000,
      },
    });
    officeData = await officeData.json();
    const isActive = officeData.data?.enabled_services?.includes("service");

    if (!isActive) return;

    const res = await fetch(`${process.env.BACKLINK}/public/service`, {
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

export default async function ServiceGrid() {
  let data = await getData();
  if (!data || data.data?.length === 0) return;
  data = data?.data;

  const iconBoxClasses = ["iconbox-blue", "iconbox-orange", "iconbox-pink", "iconbox-yellow", "iconbox-red", "iconbox-teal"];

  return (
    <>
      <section id="services" className="services py-5 ">
        <div className="container">
          <h2
            className="display-10 fw-bold text-center"
            style={{
              color: "#192f59",
            }}
          >
            Services
          </h2>

          <div className="row">
            {data?.map((item, index) => {
              return (
                <div className="col-lg-4 col-md-6 d-flex align-items-stretch" key={index}>
                  <div className={`icon-box ${iconBoxClasses[index % 6]} rounded-4`}>
                    <div className="icon">
                      <svg wstrokewidth="100" height="100" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
                        <path
                          stroke="none"
                          strokeWidth="0"
                          fill="#f5f5f5"
                          d="M300,521.0016835830174C376.1290562159157,517.8887921683347,466.0731472004068,529.7835943286574,510.70327084640275,468.03025145048787C554.3714126377745,407.6079735673963,508.03601936045806,328.9844924480964,491.2728898941984,256.3432110539036C474.5976632858925,184.082847569629,479.9380746630129,96.60480741107993,416.23090153303,58.64404602377083C348.86323505073057,18.502131276798302,261.93793281208167,40.57373210992963,193.5410806939664,78.93577620505333C130.42746243093433,114.334589627462,98.30271207620316,179.96522072025542,76.75703585869454,249.04625023123273C51.97151888228291,328.5150500222984,13.704378332031375,421.85034740162234,66.52175969318436,486.19268352777647C119.04800174914682,550.1803526380478,217.28368757567262,524.383925680826,300,521.0016835830174"
                        ></path>
                      </svg>
                      <FaDribbble />
                    </div>

                    <a href={item.url && item.url} className="text-dark text-decoration-none">
                      <h4>{item.name}</h4>
                      <p>{item.description}</p>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
