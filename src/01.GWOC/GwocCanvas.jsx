import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
gsap.registerPlugin(ScrollTrigger);
import img1 from './slide1.webp';
import img2 from './slide2.webp';
import img3 from './slide3.webp';
import audio from './Goddess of the Mountain by Winky詩 Cover 百鬼 IBUKI.mp3';

const GwocCanvas = () => {
  const canvasRef = useRef(null);
  const heroRef = useRef(null);
  const overlayRef = useRef(null);
  const grandchild1Ref = useRef(null);
  const grandchild2Ref = useRef(null);
  const grandchild3Ref = useRef(null);
  const textWrapperRef = useRef(null);

  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselIndexRef = useRef(0);
  const prevProgressRef = useRef(0);
  const [showClickText, setShowClickText] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const slides = [img1, img2, img3];
  const audioRef = useRef(new Audio(audio));

  // Mouse move listener
  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Play audio on first click anywhere (only if audioEnabled)
  useEffect(() => {
    const handleWindowClick = () => {
      if (showClickText && audioEnabled) {
        audioRef.current.play();
        gsap.to(".click-sound-text", {
          opacity: 0,
          duration: 0.5,
          onComplete: () => setShowClickText(false),
        });
        setAudioEnabled(false);
        window.removeEventListener("click", handleWindowClick);
      }
    };
    window.addEventListener("click", handleWindowClick);
    return () => window.removeEventListener("click", handleWindowClick);
  }, [showClickText, audioEnabled]);

  // Animate text on slide change
  const animateText = (direction = "forward") => {
    if (!textWrapperRef.current) return;
    const fromX = direction === "forward" ? 200 : -200;
    const toX = 0;
    const tl = gsap.timeline();
    tl.to(textWrapperRef.current, {
      x: direction === "forward" ? -200 : 200,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
    }).fromTo(
      textWrapperRef.current,
      { x: fromX, opacity: 0 },
      { x: toX, opacity: 1, duration: 0.5, ease: "power2.out" }
    );
  };

  useEffect(() => {
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const setCanvasSize = () => {
      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * pixelRatio;
      canvas.height = window.innerHeight * pixelRatio;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    gsap.set(canvas, { opacity: 0 });
    gsap.set([grandchild1Ref.current, grandchild2Ref.current, grandchild3Ref.current], {
      opacity: 0,
      y: (i, target) => (target === grandchild1Ref.current ? -100 : 0),
      x: (i, target) =>
        target === grandchild2Ref.current ? -150 : target === grandchild3Ref.current ? 150 : 0,
    });

    const frameCount = 193;
    const currentFrame = (index) =>
      `/Images/Gwoc/Frame_${(index + 1).toString().padStart(4, "0")}.webp`;

    const images = [];
    let imagesToLoad = frameCount;
    const videoFrames = { frame: 0 };

    const onLoad = () => {
      imagesToLoad--;
      if (!imagesToLoad) {
        gsap.to(canvas, { opacity: 1, duration: 0.5, ease: "power2.out" });
        render();
      }
    };

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.onload = onLoad;
      img.onerror = onLoad;
      img.src = currentFrame(i);
      images.push(img);
    }

    const render = () => {
      const canvasWidth = window.innerWidth;
      const canvasHeight = window.innerHeight;
      context.clearRect(0, 0, canvasWidth, canvasHeight);

      const img = images[videoFrames.frame];
      if (img && img.complete && img.naturalWidth > 0) {
        const imageAspect = img.naturalWidth / img.naturalHeight;
        const canvasAspect = canvasWidth / canvasHeight;

        let drawWidth, drawHeight, drawX, drawY;
        if (imageAspect > canvasAspect) {
          drawHeight = canvasHeight;
          drawWidth = drawHeight * imageAspect;
          drawX = (canvasWidth - drawWidth) / 2;
          drawY = 0;
        } else {
          drawWidth = canvasWidth;
          drawHeight = drawWidth / imageAspect;
          drawX = 0;
          drawY = (canvasHeight - drawHeight) / 2;
        }

        context.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      }
    };

    const st = ScrollTrigger.create({
      trigger: heroRef.current,
      start: "top top",
      end: `+=${window.innerHeight * 20}px`,
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const direction = progress > prevProgressRef.current ? "forward" : "backward";
        prevProgressRef.current = progress;

        const animationProgress = Math.min(progress / 0.9, 1);
        const targetFrame = Math.round(animationProgress * (frameCount - 1));
        videoFrames.frame = targetFrame;
        render();

        const fadeStart = 0.4;
        const fadeDuration = 0.2;
        const fadeEnd = fadeStart + fadeDuration;
        const overlayOpacity = Math.min(Math.max((progress - fadeStart) / fadeDuration, 0), 1);

        if (overlayOpacity > 0 && showClickText) {
          // Fade out click text and disable audio
          gsap.to(".click-sound-text", { opacity: 0, duration: 0.5 });
          setShowClickText(false);
          setAudioEnabled(false);
        }

        if (overlayRef.current) {
          overlayRef.current.style.opacity = overlayOpacity;
        }

        if (overlayOpacity >= 1 && overlayRef.current) {
          if (!overlayRef.current.dataset.animated) {
            overlayRef.current.dataset.animated = "true";
            const tl = gsap.timeline();
            tl.fromTo(
              grandchild1Ref.current,
              { y: -100, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
            )
              .fromTo(
                grandchild2Ref.current,
                { x: -150, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
                "-=0.4"
              )
              .fromTo(
                grandchild3Ref.current,
                { x: 150, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
                "-=0.8"
              );
          }

          const normalized = (progress - fadeEnd) / (1 - fadeEnd);
          const clamped = Math.max(0, Math.min(1, normalized || 0));
          let slideIndex = Math.min(Math.floor(clamped * slides.length), slides.length - 1);
          if (carouselIndexRef.current !== slideIndex) {
            carouselIndexRef.current = slideIndex;
            animateText(direction);
            setCurrentSlide(slideIndex);
          }
        }
      },
    });

    return () => {
      st.kill();
      ScrollTrigger.getAll().forEach((s) => s.kill());
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
      try { if (typeof lenis.destroy === "function") lenis.destroy(); } catch (e) { }
      window.removeEventListener("resize", setCanvasSize);
    };
  }, []);

  return (
    <div className="w-full h-screen relative" ref={heroRef}>
      <canvas ref={canvasRef} className="h-full w-full" />

      {/* Mouse-follow click text */}
      {showClickText && (
        <div
          className="click-sound-text fixed pointer-events-none z-50 text-white mix-blend-difference px-3 py-1 rounded select-none"
          style={{
            top: mousePos.y + "px",
            left: mousePos.x + 10 + "px",
            cursor: "default",
            opacity: 1,
          }}
        >
          Click for Sound
        </div>
      )}

      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white text-3xl"
        style={{ opacity: 0, backgroundColor: "rgba(0,0,0,0.2)" }}
      >
        <div className="w-full h-full">
          <div className="h-full flex flex-col w-full">
            {/* Grandchild 1 */}
            <div
              ref={grandchild1Ref}
              className="w-full h-[30%] p-4 font-[main] text-[7rem] flex items-center justify-center"
            >
              THE GREAT WALL OF CHINA
            </div>

            {/* Bottom Section */}
            <div className="flex w-full gap-[1vw] h-[50%]">
              {/* Grandchild 2 → Text */}
              <div
                ref={grandchild2Ref}
                className="w-[40%] p-4 flex flex-col justify-center text-left text-lg relative overflow-hidden"
              >
                <div ref={textWrapperRef} className="absolute w-full">
                  <h2 className="font-bold font-[montserrat] text-2xl mb-4">
                    {currentSlide === 0 && "The Majestic Great Wall"}
                    {currentSlide === 1 && "A Journey Through Time"}
                    {currentSlide === 2 && "A New Wonder of the World"}
                  </h2>
                  <p className="mb-2 w-[95%] font-[montserrat]">
                    {currentSlide === 0 &&
                      "Stretching over 13,000 miles, the Great Wall of China is a marvel of ancient engineering. Built to protect the Chinese states from invasions, it stands as a symbol of strength, perseverance, and human ingenuity."}
                    {currentSlide === 1 &&
                      "Construction began more than 2,000 years ago during the Qin Dynasty and continued over centuries. Made of stone, brick, and earth, it winds through mountains, deserts, and plains, reflecting the dedication and skill of countless workers."}
                    {currentSlide === 2 &&
                      "Voted one of the New 7 Wonders of the World, the Great Wall is celebrated for its immense scale, remarkable engineering, and cultural significance. It stands as a timeless symbol of China’s history and resilience."}
                  </p>
                </div>
              </div>

              {/* Grandchild 3 → Carousel */}
              <div
                ref={grandchild3Ref}
                className="w-[60%] p-4 flex flex-col items-start justify-start"
              >
                <div className="relative w-full h-full overflow-hidden rounded-l shadow-lg">
                  <div
                    className="carousel flex transition-transform duration-700 ease-in-out"
                    style={{
                      transform: `translateX(-${currentSlide * (window.innerWidth * 0.6 * 0.75 + 16)
                        }px)`,
                    }}
                  >
                    {slides.map((src, i) => (
                      <div
                        key={i}
                        className="flex-shrink-0 rounded-l mr-4"
                        style={{ width: `${60 * 0.75}vw`, height: "100%" }}
                      >
                        <img
                          src={src}
                          className="w-full h-full object-cover rounded-l"
                          alt={`Slide ${i + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="w-[79%] h-1 bg-white/20 rounded relative mt-5">
                  <div
                    className="absolute left-0 h-1 bg-white/60 rounded-full transition-all duration-300 ease-out"
                    style={{
                      width: `${((currentSlide + 1) / slides.length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GwocCanvas;

