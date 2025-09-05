import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";
import CtrBg1 from "./CtrBg1.png";
import CtrBg2 from "./CtrBg2.png";
import CtrF from "./CtrF.png";

gsap.registerPlugin(ScrollTrigger);

const Ctr = () => {
  const containerRef = useRef(null);
  const bg1Ref = useRef(null);
  const bg2Ref = useRef(null);
  const fgRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Background 2 (sky comes UP from bottom)
    gsap.fromTo(
      bg2Ref.current,
      { y: 200 }, // 👈 starts slightly below
      {
        y: 0,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "top top",
          scrub: true,
        },
      }
    );

    // ✅ Background 1 (building comes DOWN from top)
    gsap.fromTo(
      bg1Ref.current,
      { y: -300 }, // 👈 starts above
      {
        y: 0,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "top top",
          scrub: true,
        },
      }
    );

    // ✅ Foreground (comes UP from bottom)
    gsap.fromTo(
      fgRef.current,
      { y: 200 }, // 👈 starts below
      {
        y: 0,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "top top",
          scrub: true,
        },
      }
    );

    // Exit animation for bg1
    gsap.fromTo(
      bg1Ref.current,
      { y: 0 },
      {
        y: -300,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "120% bottom",
          end: "150% top",
          scrub: true,
        },
      }
    );
  }, []);


  return (
    <div
      ref={containerRef}
      className="w-full z-50 h-screen bg-[#ccd7cf] overflow-hidden relative"
    >
      {/* Background 2 (sky) */}
      <img
        ref={bg2Ref}
        className="absolute h-full w-full object-cover"
        src={CtrBg2}
        alt="bg2"
      />

      {/* Background 1 (middle building part) */}
      <img
        ref={bg1Ref}
        className="absolute z-40 h-full w-full object-cover"
        src={CtrBg1}
        alt="bg1"
      />

      {/* Foreground (front details) */}
      <img
        ref={fgRef}
        className="absolute z-30 h-full w-full object-cover"
        src={CtrF}
        alt="fg"
      />

      {/* ✅ Button for routing */}
      <div className="absolute bottom-10 z-50 left-1/2 -translate-x-1/2">
        <button
          onClick={() => navigate("/tajmahalcanvas")}
          className="px-6 py-3 bg-black text-white rounded-xl shadow-lg hover:bg-gray-800 transition"
        >
          Go to Taj Mahal Canvas
        </button>
      </div>
    </div>
  );
};

export default Ctr;
