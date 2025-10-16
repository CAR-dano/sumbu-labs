import { FiveLanyards } from "./Lanyard";

// Contoh penggunaan komponen Lanyard dengan URL kustom
export default function LanyardExample() {
  // URL kustom untuk setiap lanyard
  const customUrls = [
    "https://sumbu-labs.com", // Lanyard pertama
    "https://github.com/sumbu-labs", // Lanyard kedua
    "https://linkedin.com/company/sumbu-labs", // Lanyard ketiga
    "https://twitter.com/sumbu_labs", // Lanyard keempat
    "https://instagram.com/sumbu.labs", // Lanyard kelima
  ];

  return (
    <div className="w-full h-screen">
      <FiveLanyards urls={customUrls} />
    </div>
  );
}

// Atau untuk menggunakan dengan URL default (GitHub profiles)
export function LanyardWithDefaults() {
  return (
    <div className="w-full h-screen">
      <FiveLanyards />
    </div>
  );
}

