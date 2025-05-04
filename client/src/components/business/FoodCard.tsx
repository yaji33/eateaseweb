import React from "react";

interface FoodCardProps {
  image: string;
  title: string;
  price: number;
}

const FoodCard: React.FC<FoodCardProps> = ({ image, title, price }) => {
  return (
    <div className="flex flex-col items-center m-2">
      <img
        src={image}
        alt={title}
        className="w-full h-36 object-cover rounded-lg mb-2"
      />
      <div className="justify-start items-left flex flex-col w-full">
        <h3 className="text-sm font-semibold ">{title}</h3>
        <p className=" text-sm">₱ {price}</p>
      </div>
    </div>
  );
};

export default FoodCard;
