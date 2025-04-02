import React from "react";

interface FoodCardProps {
  image: string;
  title: string;
  price: number;
}

const FoodCard: React.FC<FoodCardProps> = ({ image, title, price }) => {
  return (
    <div className="bg-white flex flex-col text-center">
      <img src={image} alt="" className="object-cover rounded-md" />

      <div className="justify-start text-left flex flex-col mx-2">
        <h3 className="mt-2 text-lg font-semibold text-gray-800">{title}</h3>
        <p className=" text-gray-600 font-medium">${price.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default FoodCard;
