const StyledCard = ({ title, bgColor, textColor, rotation, className }) => {
  return (
    <div
      className={`styled-card ${className}`}
      style={{
        backgroundColor: bgColor,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <h2
        className="styled-card-text"
        style={{
          color: textColor,
        }}
      >
        {title}
      </h2>
    </div>
  );
};

export default StyledCard;
