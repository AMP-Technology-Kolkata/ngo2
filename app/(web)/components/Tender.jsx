import React from "react";

const Tendersec = ({ notification = [] }) => {
  return (
    <div className="tender-strip">
      <marquee width="100%" direction="left" behavior="scroll" scrollamount="3">
        <div
          className="marquee"
          style={{
            overflow: "hidden",
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            flex: 1,
            width: "100%",
          }}
        >
          {notification.map((item, index) => (
            <div
              key={index}
              style={{
                marginRight: "50px",
                color: "#4a3214",
                fontWeight: 600,
              }}
            >
              <p style={{ margin: "0px", textAlign: "center" }}>
                <span
                  style={{
                    color: "#d97706",
                    fontSize: "25px",
                    animation: "blink 1s infinite",
                  }}
                >
                  *
                </span>
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </marquee>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};

export default Tendersec;
