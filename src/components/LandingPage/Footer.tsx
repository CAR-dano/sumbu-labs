import React from "react";
import Link from "next/link";
import { FaXTwitter } from "react-icons/fa6";
import { MdKeyboardArrowDown, MdOutlineMailOutline } from "react-icons/md";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import Image from "next/image";

const Footer = () => {
  return (
    <div
      id="footer"
      className="flex px-4 sm:px-8 lg:px-[52px] mb-8 sm:mb-16 lg:mb-[130px] flex-col"
    >
      <div
        id="contact"
        className="w-full flex flex-col lg:flex-row items-stretch justify-between gap-6 lg:gap-0"
      >
        {/* Social Media Icons - Hidden on mobile, shown on larger screens */}
        <div className="socmed hidden lg:flex flex-col gap-[46px] mb-10">
          <a
            href="https://x.com/SumbuLabs"
            target="_blank"
            rel="noopener noreferrer"
            className="w-[78px] h-[78px] bg-[#11152D] rounded-full text-white flex items-center justify-center hover:bg-[#aa6afe] transition-colors duration-300"
          >
            <FaXTwitter size={36} />
          </a>
          <a
            href="mailto:sumbulab@gmail.com"
            className="w-[78px] h-[78px] bg-[#11152D] rounded-full text-white flex items-center justify-center hover:bg-[#aa6afe] transition-colors duration-300"
          >
            <MdOutlineMailOutline size={36} />
          </a>
          <a
            href="https://wa.me/6281231551634"
            target="_blank"
            rel="noopener noreferrer"
            className="w-[78px] h-[78px] bg-[#11152D] rounded-full text-white flex items-center justify-center hover:bg-[#aa6afe] transition-colors duration-300"
          >
            <FaWhatsapp size={36} />
          </a>
          <a
            href="https://www.instagram.com/sumbulabs/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-[78px] h-[78px] bg-[#11152D] rounded-full text-white flex items-center justify-center hover:bg-[#aa6afe] transition-colors duration-300"
          >
            <FaInstagram size={36} />
          </a>
        </div>

        {/* Main Content */}
        <div className="relative flex flex-col lg:flex-row gap-4 lg:gap-5 content w-full bg-[#1B0C32] py-4 sm:py-6 lg:py-[26px] px-4 sm:px-6 lg:px-[32px] rounded-2xl lg:rounded-br-none lg:rounded-bl-none lg:rounded-[47px] flex-1 lg:ml-[46px] rounded-b-none overflow-hidden">
          {/* Background Logo - Adjusted for mobile */}
          <div className="absolute right-0 -bottom-[10px] sm:-bottom-[50px] lg:-bottom-[75px] z-0 opacity-20 lg:opacity-100">
            <Image
              src="/assets/logo/sumbu-opc.svg"
              alt="Sumbu OPC Logo"
              width={250}
              height={250}
              className="w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] lg:w-[450px] lg:h-[450px]"
            />
          </div>

          {/* Logo Section */}
          <div className="w-full lg:w-[28%] flex justify-center lg:justify-start mb-4 lg:mb-0">
            <div className="w-32 sm:w-40 lg:w-full">
              <Image
                src="/assets/logo/sumbu.svg"
                alt="Sumbu Logo"
                width={450}
                height={450}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Center Content */}
          <div className="w-full lg:w-[30%] flex flex-col items-center justify-center gap-4 lg:gap-6 z-10 relative">
            <h1 className="text-2xl sm:text-3xl lg:text-[56px] leading-tight lg:leading-none text-white text-center">
              Align the{" "}
              <span className="font-bold text-4xl sm:text-5xl lg:text-[112px] block lg:inline">
                Axis
              </span>
            </h1>
            <div className="div-button flex items-center justify-center">
              <Link
                href="/brief"
                className="btn-contact text-sm sm:text-base lg:text-xl px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-3"
              >
                Start Your Project
              </Link>
              <button className="btn-contact-2 w-10 h-10 sm:w-12 sm:h-12 lg:w-[54px] lg:h-[54px]">
                <MdKeyboardArrowDown size={24} className="sm:hidden" />
                <MdKeyboardArrowDown
                  size={30}
                  className="hidden sm:block lg:hidden"
                />
                <MdKeyboardArrowDown size={36} className="hidden lg:block" />
              </button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="contact flex flex-col items-start justify-center gap-3 lg:gap-4 z-10 relative mt-6 lg:mt-0">
            <a
              href="https://x.com/SumbuLabs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-3 lg:gap-5 text-white items-center hover:text-[#aa6afe] transition-colors duration-300"
            >
              <FaXTwitter size={24} className="sm:hidden" />
              <FaXTwitter size={30} className="hidden sm:block lg:hidden" />
              <FaXTwitter size={36} className="hidden lg:block" />
              <p className="text-sm sm:text-lg lg:text-2xl font-roboto">
                sumbu.lab
              </p>
            </a>
            <a
              href="mailto:sumbulab@gmail.com"
              className="flex gap-3 lg:gap-5 text-white items-center hover:text-[#aa6afe] transition-colors duration-300"
            >
              <MdOutlineMailOutline size={24} className="sm:hidden" />
              <MdOutlineMailOutline
                size={30}
                className="hidden sm:block lg:hidden"
              />
              <MdOutlineMailOutline size={36} className="hidden lg:block" />
              <p className="text-sm sm:text-lg lg:text-2xl font-roboto break-all">
                sumbulab@gmail.com
              </p>
            </a>
            <a
              href="https://wa.me/6281231551634"
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-3 lg:gap-5 text-white items-center hover:text-[#aa6afe] transition-colors duration-300"
            >
              <FaWhatsapp size={24} className="sm:hidden" />
              <FaWhatsapp size={30} className="hidden sm:block lg:hidden" />
              <FaWhatsapp size={36} className="hidden lg:block" />
              <p className="text-sm sm:text-lg lg:text-2xl font-roboto">
                081231551634
              </p>
            </a>
            <a
              href="https://www.instagram.com/sumbulabs/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-3 lg:gap-5 text-white items-center hover:text-[#aa6afe] transition-colors duration-300"
            >
              <FaInstagram size={24} className="sm:hidden" />
              <FaInstagram size={30} className="hidden sm:block lg:hidden" />
              <FaInstagram size={36} className="hidden lg:block" />
              <p className="text-sm sm:text-lg lg:text-2xl font-roboto">
                sumbu.xyz
              </p>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="copyright text-left w-full bg-[#1B0C32] py-4 sm:py-6 lg:py-[26px] px-4 sm:px-6 lg:px-[32px] rounded-2xl lg:rounded-[47px] lg:rounded-tr-none  rounded-tr-none rounded-tl-none lg:rounded-tl-[47px]">
        <p className="text-xs sm:text-base lg:text-[26px] text-white font-roboto text-opacity-50">
          copyright &copy; {new Date().getFullYear()} Sumbu labs. All rights
          reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;

