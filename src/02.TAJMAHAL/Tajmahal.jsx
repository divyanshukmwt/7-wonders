import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";
import TajMahalBg1 from "./TajMahalBg1.png";
import TajMahalBg2 from "./TajMahalBg2.png";
import TajMahalF from "./TajMahalF.png";

gsap.registerPlugin(ScrollTrigger);

const Tajmahal = () => {
  const containerRef = useRef(null);
  const bg1Ref = useRef(null);
  const bg2Ref = useRef(null);
  const fgRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Background 2 (sky comes down)
    gsap.fromTo(
      bg2Ref.current,
      { y: -200 }, // starts slightly above
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

    // ✅ Background 1 (comes down into place)
    gsap.fromTo(
      bg1Ref.current,
      { y: -300 },
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

    // ✅ Foreground (comes down into place)
    gsap.fromTo(
      fgRef.current,
      { y: 150 },
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

// ⬇️ Exit Animation when scrolling out
gsap.fromTo(
  bg1Ref.current,
  { y: 0 },      // 👈 it’s already at 0 after entry animation
  {
    y: -300,     // 👈 move it back up to the initial position
    ease: "none",
    scrollTrigger: {
      trigger: containerRef.current,
      start: "120% bottom",
      end: "150% top",
      scrub: true,
    },
  }
);

    // gsap.fromTo(
    //   fgRef.current,
    //   { y: 0 }, // 👈 it’s already at 0 after entry animation
    //   {
    //     y: 200, // 👈 move it back down to where it started
    //     ease: "none",
    //     scrollTrigger: {
    //       trigger: containerRef.current,
    //       start: "120% bottom",
    //       end: "150% top",
    //       scrub: true,
    //       markers: true,
    //     },
    //   }
    // );

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
        src={TajMahalBg2}
        alt="bg2"
      />

      {/* Background 1 (middle building part) */}
      <img
        ref={bg1Ref}
        className="absolute z-40 h-full w-full object-cover"
        src={TajMahalBg1}
        alt="bg1"
      />

      {/* Foreground (front details) */}
      <img
        ref={fgRef}
        className="absolute z-30 h-full w-full object-cover"
        src={TajMahalF}
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

export default Tajmahal;
