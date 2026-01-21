import React from "react";
import Image from "next/image";

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
      <div className="flex flex-col md:flex-row items-center justify-center my-10 ">
        {ListPartner.map((partner, index) => (
          <div key={index} className="flex flex-col items-center mx-4">
            <Image
              src={partner.image}
              alt={partner.name}
              width={160}
              height={96}
              className="w-3/4 md:w-auto h-16 md:h-24 object-contain space-y-2"
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default Partner;

