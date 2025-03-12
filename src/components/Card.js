import React from "react";

const Card = ({ image, title, numero }) => {
  return (
    <div className={`card ${numero}`}>
      <div className="card-image">
        <img src={image} alt={title} />
      </div>
      <div className="card-content">
        <h2>{title}</h2>
      </div>
    </div>
  );
};

export default Card;
