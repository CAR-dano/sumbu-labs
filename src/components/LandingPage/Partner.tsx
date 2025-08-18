import React from "react";

const Partner = () => {
  const ListPartner = [
    {
      name: "UGM",
      image: "/assets/partners/ugm.svg",
    },
    {
      name: "CARDANO",
      image: "/assets/partners/cardano.svg",
    },
    {
      name: "PROCAT",
      image: "/assets/partners/procat.svg",
    },
    {
      name: "PALAPA",
      image: "/assets/partners/palapa.svg",
    },
  ];

  return (
    <>
      <div className="flex items-center justify-center my-10">
        {ListPartner.map((partner, index) => (
          <div key={index} className="flex flex-col items-center mx-4">
            <h3 className="text-center">{partner.name}</h3>
            <img
              src={partner.image}
              alt={partner.name}
              className="w-auto h-16"
            />
          </div>
        ))}
      </div>

      <h1 className="services px-32">Our Services</h1>
    </>
  );
};

export default Partner;
