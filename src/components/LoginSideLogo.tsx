import React from "react";

const LoginSideLogo: React.FC<{ size?: number }> = ({ size = 100 }) => {
  const circleSize = size * 0.5;

  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Large Circle */}
      <div
        style={{
          width: circleSize,
          height: circleSize,
          borderRadius: "50%",
          backgroundColor: "#2e2e2e",
          position: "absolute",
          top: "0%",
          left: "0%",
        }}
      />
      {/* Small Circle */}
      <div
        style={{
          width: circleSize * 0.6,
          height: circleSize * 0.6,
          borderRadius: "50%",
          backgroundColor: "#2e2e2e",
          position: "absolute",
          bottom: "0%",
          right: "0%",
        }}
      />
    </div>
  );
};

export default LoginSideLogo;
