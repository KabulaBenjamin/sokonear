// src/components/Footer.tsx
import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="mt-12 w-full bg-gray-900 text-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-10 grid gap-8 md:grid-cols-2">
        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-bold mb-2">Contact Me</h3>
          <p className="flex items-center space-x-2">
            <FaPhoneAlt /> <span>0798-030091</span>
          </p>
          <p className="flex items-center space-x-2 mt-2 break-all">
            <FaEnvelope /> <span>kabulabenjamin25@gmail.com</span>
          </p>
        </div>

        {/* Social Media / Connection */}
        <div>
          <h3 className="text-lg font-bold mb-2">Let’s Connect</h3>
          <div className="flex space-x-4 text-xl">
            <a
              href="https://github.com/koikoi"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/koikoi"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      {/* Business Motto */}
      <div className="bg-gray-800 text-center py-3 text-sm italic tracking-wide">
        “SokoNear, bringing the market to your doorstep”
      </div>

      {/* Copyright */}
      <div className="bg-gray-800 text-center pb-4 text-xs">
        © {new Date().getFullYear()} SokoNear. All rights reserved. Built by Koikoi <b>the Cool</b>.
      </div>
    </footer>
  );
};

export default Footer;