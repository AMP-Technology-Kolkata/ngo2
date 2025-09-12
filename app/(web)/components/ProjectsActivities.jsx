"use client";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";

const ProjectsActivities = ({ data = [], bgImgae = "" }) => {
  const settings = {
    type: "loop",
    rewind: true,
    autoplay: true,
    interval: 3000,
    perPage: 5,
    perMove: 1,
    gap: "1rem",
    pagination: false,
    breakpoints: {
      1024: {
        perPage: 3,
      },
      600: {
        perPage: 2,
      },
      480: {
        perPage: 1,
      },
    },
  };

  return (
    <div
      className="projects-activities"
      style={{
        backgroundImage: `url(${
          process.env.NEXT_PUBLIC_BACKPUBLIC
        }/${bgImgae.slice(7)})`,
      }}
    >
      <h2 className="display-10 fw-bold">Projects & Activities</h2>
      <Splide options={settings} style={{ zIndex: 111 }}>
        {data?.map((project, index) => (
          <SplideSlide key={index}>
            <div className="project-card">
              <img
                src={project.image}
                alt={project.title}
                className="project-image"
              />
              <p>{project.title}</p>
            </div>
          </SplideSlide>
        ))}
      </Splide>
      <style jsx>{`
        .projects-activities {
          padding: 40px;
          margin: 90px 0;
          position: relative;
        }
        .projects-activities h2 {
          text-align: center;
          margin-bottom: 20px;
        }
        .project-card {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .project-card img {
          width: 90%;
          height: 240px;
          border-radius: 1px;
        }
        .project-card p {
          margin-top: 10px;
          text-align: center;
          width: 90%;
          background: #fff;
          color: #000;
          padding: 5px;
        }
        .projects-activities {
          background-repeat: no-repeat;
          background-position: 50% 50%;
          background-size: cover;
          border-radius: 10px;
        }
        .projects-activities::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(25, 47, 89, 0.7);
          border-radius: 15px;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default ProjectsActivities;
