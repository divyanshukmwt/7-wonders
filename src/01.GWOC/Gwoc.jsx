import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import GwocBG from './GwocBG.png';
import GwocF from './GwocF.png';

gsap.registerPlugin(ScrollTrigger);

const Gwoc = () => {
  const bgRef = useRef(null);
  const fgRef = useRef(null);
  const textRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Scroll-triggered parallax for images and text
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      }
    });

    tl.to(bgRef.current, { y: "-20%", ease: "none" }, 0)
      .to(fgRef.current, { y: "-40%", ease: "none" }, 0)
      .to(textRef.current, { y: "40%", ease: "none" }, 0);

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className='w-full h-screen overflow-hidden relative'>
      {/* Background */}
      <img
        className='w-full h-full object-cover absolute top-0 left-0 z-10 min-h-screen'
        src={GwocBG}
        alt=""
        ref={bgRef}
      />

      {/* Text */}
      <span
        className='text-[11rem] z-20 absolute font-[main] uppercase top-15 left-20'
        ref={textRef}>
        GREAT WALL OF CHINA
      </span>

      {/* Foreground */}
      <img
        className='w-full h-full object-cover absolute bottom-0 left-0 z-30 min-h-screen'
        src={GwocF}
        alt=""
        ref={fgRef}
      />

      {/* Fixed Navigation Button */}
      <Link
        to="/gwoccanvas"
        className="absolute z-50 bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 bg-white text-black font-bold rounded-lg shadow-lg hover:bg-gray-200 transition"
      >
        Enter Canvas
      </Link>
    </div>
  );
};

export default Gwoc;
