import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom"; // ✅ import for navigation
import TajMahalBg1 from "./TajMahalBg1.png";
import TajMahalBg2 from "./TajMahalBg2.png";
import TajMahalF from "./TajMahalF.png";

gsap.registerPlugin(ScrollTrigger);

const Tajmahal = () => {
  const containerRef = useRef(null);
  const bg1Ref = useRef(null);
  const bg2Ref = useRef(null);
  const fgRef = useRef(null);
  const navigate = useNavigate(); // ✅ hook

  useEffect(() => {
    gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "-90% top",
        end: "top top",
        scrub: true,
        markers: true,
      },
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full z-50 h-screen bg-[#ccd7cf] overflow-hidden relative"
    >
      <img
        ref={bg1Ref}
        className="absolute z-10 h-full w-full object-cover"
        src={TajMahalBg1}
        alt="bg1"
      />
      <img
        ref={bg2Ref}
        className="absolute z-30 h-full w-full object-cover"
        src={TajMahalBg2}
        alt="bg2"
      />
      <img
        // ref={fgRef}
        className="absolute z-40 h-full w-full object-cover"
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
