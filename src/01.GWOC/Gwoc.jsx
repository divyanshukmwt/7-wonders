import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
import GwocBG from './GwocBG.png';
import GwocF from './GwocF.png';

gsap.registerPlugin(ScrollTrigger);

const Gwoc = () => {
  const bgRef = useRef(null);
  // const fgRef = useRef(null);
  const textRef = useRef(null);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Scroll-based parallax
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      }
    });

    tl.to(bgRef.current, { y: "50%", ease: "none" }, 0)
      // .to(fgRef.current, { y: "-40%", ease: "none" }, 0)
      .to(textRef.current, { y: "100%", ease: "none" }, 0)
      .to(buttonRef.current, { y: "-150px", ease: "none" }, 0);

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  // Click handler
  const handleEnter = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        navigate("/gwoccanvas"); // navigate after animation
      }
    });

    tl.to(textRef.current, { y: "+=230", duration: 0.8, ease: "power2.inOut" })
      .to(buttonRef.current, { opacity: 0, duration: 0.5, ease: "power2.out" }, "<")
      .to(containerRef.current, { opacity: 0, duration: 0.5, ease: "power2.out" });
  };

  return (
    <div ref={containerRef} className="w-full h-screen overflow-hidden relative">
      {/* Background */}
      <img
        className="w-full h-full object-cover absolute top-0 left-0 z-10 min-h-screen"
        src={GwocBG}
        alt=""
        ref={bgRef}
      />

      {/* Text */}
      <span
        className="text-[11rem] z-20 absolute font-[main] uppercase top-15 left-20"
        ref={textRef}
      >
        GREAT WALL OF CHINA
      </span>

      {/* Foreground */}
      <img
        className="w-full h-full object-cover absolute bottom-0 left-0 z-30 min-h-screen"
        src={GwocF}
        alt=""
        // ref={fgRef}
      />

      {/* Button that scrolls up with parallax */}
      <button
        ref={buttonRef}
        onClick={handleEnter}
        className="absolute z-50 bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 bg-white text-black font-bold rounded-lg shadow-lg hover:bg-gray-200"
      >
        Enter Experience
      </button>
    </div>
  );
};

export default Gwoc;
