import { useState, useEffect } from "react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const aboutSection = document.getElementById("about");
      if (aboutSection) {
        const rect = aboutSection.getBoundingClientRect();
        // Check if the top of the 'about' section is in the viewport
        setIsScrolled(rect.top <= 0);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={` w-full px-6 py-4 ${
        isScrolled ? "  shadow-lg" : "bg-transparent text-black"
      } transition-colors duration-300`}
    >
      
    </nav>
  );
};

export default Navbar;
