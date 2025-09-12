import React from "react";

const Tendersec = ({ notification = [] }) => {
  return (
    <div
      style={{
        background: "#6183c3",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        height: "40px",
        fontSize: "14px",
      }}
    >
      <div
        style={{
          background: "#000",
          color: "#fff",
          padding: "0px 20px",
          fontWeight: "bold",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        Latest News
      </div>

      <marquee width="100%" direction="left" behavior="scroll" scrollamount="3">
        <div
          className="marquee"
          style={{
            overflow: "hidden",
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            flex: 1,
            width: "80%",
          }}
        >
          {notification.map((item, index) => (
            <div
              key={index}
              style={{
                // marginTop: "12px",
                marginRight: "50px",
                color: "#fff",
              }}
            >
              <p style={{ margin: "0px", textAlign: "center" }}>
                <span
                  style={{
                    color: "red",
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
