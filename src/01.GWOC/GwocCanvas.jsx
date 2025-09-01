import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
gsap.registerPlugin(ScrollTrigger);
import img1 from './1.png';
import img2 from './2.png';
import img3 from './3.png';

const GwocCanvas = () => {
  const canvasRef = useRef(null);
  const heroRef = useRef(null);
  const overlayRef = useRef(null);

  const grandchild1Ref = useRef(null);
  const grandchild2Ref = useRef(null);
  const grandchild3Ref = useRef(null);

  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselIndexRef = useRef(0);

  const slides = [
    img1, img2, img3
  ];

  useEffect(() => {
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
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

    // <-- NEW: Set initial hidden/offscreen state for overlay children
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

        const animationProgress = Math.min(progress / 0.9, 1);
        const targetFrame = Math.round(animationProgress * (frameCount - 1));
        videoFrames.frame = targetFrame;
        render();

        const fadeStart = 0.4;
        const fadeDuration = 0.2;
        const fadeEnd = fadeStart + fadeDuration;
        const overlayOpacity = Math.min(
          Math.max((progress - fadeStart) / fadeDuration, 0),
          1
        );
        if (overlayRef.current) {
          overlayRef.current.style.opacity = overlayOpacity;
        }

        if (overlayOpacity >= 1 && overlayRef.current) {
          // run entrance animations only once
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
          let slideIndex = Math.min(
            Math.floor(clamped * slides.length),
            slides.length - 1
          );
          if (carouselIndexRef.current !== slideIndex) {
            carouselIndexRef.current = slideIndex;
            setCurrentSlide(slideIndex);
          }
        }
      },
    });

    return () => {
      st.kill();
      ScrollTrigger.getAll().forEach((s) => s.kill());
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
      try {
        if (typeof lenis.destroy === "function") lenis.destroy();
      } catch (e) {}
      window.removeEventListener("resize", setCanvasSize);
    };
  }, []);

  return (
    <div className="w-full h-screen relative" ref={heroRef}>
      <canvas ref={canvasRef} className="h-full w-full" />

      <div
        ref={overlayRef}
        className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white text-3xl"
        style={{
          opacity: 0,
          backgroundColor: "rgba(0,0,0,0.2)",
        }}
      >
        <div className="w-full h-full">
          <div className="h-full flex flex-col w-full">
            {/* Grandchild 1 */}
            <div
              ref={grandchild1Ref}
              className="w-full h-[30%] p-4 flex items-center justify-center"
            >
              Grandchild1
            </div>

            {/* Bottom Section */}
            <div className="flex w-full h-[70%]">
              {/* Grandchild 2 → Text */}
              <div
                ref={grandchild2Ref}
                className="w-[30%] p-4 flex flex-col justify-center text-left text-lg"
              >
                <h2 className="font-bold text-2xl mb-4">Carousel Info</h2>
                <p className="mb-2">
                  {currentSlide === 0 && "This is the first slide description."}
                  {currentSlide === 1 && "Here is some text for the second slide."}
                  {currentSlide === 2 && "And this is for the third slide."}
                </p>
                <p className="text-sm opacity-80">
                  Text changes with slides automatically.
                </p>
              </div>

              {/* Grandchild 3 → Carousel */}
              <div
                ref={grandchild3Ref}
                className="w-[70%] p-4 flex items-center justify-center"
              >
                <div className="relative w-full h-full overflow-hidden rounded-2xl shadow-lg">
                  <div
                    className="carousel flex w-full h-full transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                    {slides.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        className="w-full h-full object-cover flex-shrink-0"
                        alt={`Slide ${i + 1}`}
                      />
                    ))}
                  </div>
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
