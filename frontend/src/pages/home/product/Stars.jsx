import { FaStar } from "react-icons/fa";

function Stars({ stars }) {
  return (
    <div className="stars">
      {[...Array(5)].map((_, index) => (
        <FaStar
          key={index}
          color={index < Math.round(stars) ? "#ffc107" : "#ddd"}
        />
      ))}
    </div>
  );
}

export default Stars;
