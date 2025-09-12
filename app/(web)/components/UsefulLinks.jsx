// "use client";
// import React, { useEffect, useState } from "react";
// import Link from "next/link";

// const UsefulLinks = ({ data = [] }) => {
//   const [columns, setColumns] = useState([]);

//   useEffect(() => {
//     const handleResize = () => {
//       const chunkSize = window.innerWidth >= 1200 ? 6 : window.innerWidth >= 992 ? 4 : window.innerWidth >= 768 ? 3 : 1;
//       const chunks = [];
//       for (let i = 0; i < data.length; i += chunkSize) {
//         chunks.push(data.slice(i, i + chunkSize));
//       }
//       setColumns(chunks);
//     };

//     window.addEventListener("resize", handleResize);
//     handleResize();

//     return () => window.removeEventListener("resize", handleResize);
//   }, [data]);

//   return (
//     <section className="useful-links-section">
//       <div className="container mt-5 mb-5">
//         <h3 className="fw-bold text-center mb-4" style={{ color: "#192f59" }}>
//           Useful Links
//         </h3>
//         <div className="row justify-content-center">
//           {columns.map((column, columnIndex) => (
//             <div key={columnIndex} className="col-12 mb-3">
//               <div className="row justify-content-center g-3">
//                 {column.map((item, itemIndex) => (
//                   <div key={itemIndex} className="col-6 col-md-4 col-lg-2 text-center">
//                     <Link href={item.link} className="text-decoration-none">
//                       <p className="blinking-link fw-bold text-primary" style={{ cursor: "pointer" }}>
//                         {item.name}
//                       </p>
//                     </Link>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default UsefulLinks;

"use client";
import React from "react";
import Link from "next/link";

const UsefulLinks = ({ data = [] }) => {
  const halfIndex = Math.ceil(data.length / 2);
  const firstColumn = data.slice(0, halfIndex);
  const secondColumn = data.slice(halfIndex);

  return (
    <section className="useful-links-section">
      <div className="container mt-5 mb-5">
        <h3 className="fw-bold text-center mb-4" style={{ color: "#192f59" }}>
          Useful Links
        </h3>
        <div className="row">
          <div className="col-12 col-md-6">
            <ul className="list-unstyled">
              {firstColumn.map((item, index) => (
                <li key={index} className="mb-2">
                  <Link href={item.link} className="text-decoration-none">
                    <p className="blinking-link  text-primary">{item.name}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-12 col-md-6">
            <ul className="list-unstyled">
              {secondColumn.map((item, index) => (
                <li key={index} className="mb-2">
                  <Link href={item.link} className="text-decoration-none">
                    <p className="blinking-link text-primary">{item.name}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UsefulLinks;
