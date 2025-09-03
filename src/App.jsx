import React, { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Gwoc from './01.GWOC/Gwoc';
import GwocCanvas from './01.GWOC/GwocCanvas';
import Tajmahal from './02.TAJMAHAL/Tajmahal';
import TajMahalCanvas from './02.TAJMAHAL/TajMahalCanvas';
import Ctr from './03.CTR/Ctr';
import Lenis from '@studio-freight/lenis';

const App = () => {
  const lenisRef = useRef(null);

  useEffect(() => {
    lenisRef.current = new Lenis({ smooth: true });

    function raf(time) {
      lenisRef.current.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenisRef.current.destroy();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Gwoc />
              <Tajmahal />
              <Ctr />
            </>
          }
        />
        <Route path="/gwoccanvas" element={<GwocCanvas />} />
        <Route path="/tajmahalcanvas" element={<TajMahalCanvas />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
