import React, { useState } from 'react';
import { SurveyForm } from './components/SurveyForm';
import { APP_NAME } from './constants';

const BACKGROUND_IMAGES = [
  'https://images.blackmagicdesign.com/images/products/blackmagicursaminipro/landing/recording/recording-xl.jpg?_v=1594626389',
  'https://images.blackmagicdesign.com/images/products/hyperdeckshuttle/landing/hero/hero-xl.jpg?_v=1743565911',
  'https://images.blackmagicdesign.com/images/products/blackmagicursacineimmersive/landing/body/body-xl.jpg?_v=1756981206',
  'https://images.blackmagicdesign.com/images/products/blackmagicstreamingprocessors/landing/hero/hero-xl.jpg?_v=1743726474',
  'https://images.blackmagicdesign.com/images/products/blackmagicpyxis/landing/controls/controls-en-xl.jpg?_v=1724893547',
  'https://images.blackmagicdesign.com/images/products/blackmagicstudiocamera/landing/hero/hero-xl@2x.jpg?_v=1677021177',
  'https://images.blackmagicdesign.com/images/products/blackmagicvideohub/landing/hero/hero-xl@2x.jpg?_v=1711517293',
  'https://images.blackmagicdesign.com/images/products/blackmagicpyxis/landing/optionalviewfinder/optionalviewfinder-xl.jpg?_v=1761193254'
];

const App: React.FC = () => {
  // Initialize with a random image
  const [bgImage] = useState(() => {
    const randomIndex = Math.floor(Math.random() * BACKGROUND_IMAGES.length);
    return BACKGROUND_IMAGES[randomIndex];
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-hipixel-accent selection:text-white font-sans">
      
      {/* Header - Solid Black Background to match Logo JPG */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-black border-b border-white/10 shadow-2xl">
        <div className="flex items-center gap-3">
          <img 
            src="https://i.ibb.co/W4yPvznT/hpp-white-3.jpg" 
            alt="HiPixel Plus Logo" 
            className="h-10 w-auto object-contain"
          />
          <h1 className="text-xl font-display font-bold tracking-tight text-white/90">{APP_NAME}</h1>
        </div>
      </header>

      {/* Full Screen Hero Section */}
      <div className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={bgImage}
            alt="Cinematic Background" 
            className="w-full h-full object-cover scale-105 md:animate-[pulse-slow_10s_ease-in-out_infinite]"
          />
          {/* Overlays - Darkened for better text visibility */}
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mt-10 md:animate-fade-in-up">
           <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-xs font-bold uppercase tracking-[0.2em] mb-8 backdrop-blur-md shadow-lg">
             Service Survey
           </span>
           <h1 className="text-4xl md:text-7xl font-display font-bold mb-6 text-white drop-shadow-2xl tracking-tight md:tracking-tight leading-snug md:leading-tight break-keep">
             더 나은 서비스를 위한<br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-white to-purple-200">
               소중한 의견.
             </span>
           </h1>
           <p className="text-base md:text-2xl text-gray-200 max-w-2xl mx-auto font-light leading-loose md:leading-relaxed drop-shadow-lg text-shadow-sm tracking-wide md:tracking-normal break-keep">
             고객님의 서비스 경험을 들려주세요. <br className="block"/>
             하이픽셀플러스는 고객님의 목소리에 귀 기울여 <br className="hidden md:block"/> 최고의 서비스를 만들어 가겠습니다.
           </p>
        </div>
      </div>

      {/* Main Content (Survey Form) */}
      <main className="relative z-20 px-4 -mt-32 pb-40 flex flex-col items-center">
        {/* Decorative background for form section */}
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-transparent to-[#050505] pointer-events-none" />
        
        <SurveyForm />
      </main>

      {/* Background Orbs for Lower Section */}
      <div className="fixed bottom-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
         <div className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-indigo-900/10 rounded-full blur-[120px]" />
         <div className="absolute top-[40%] right-[-10%] w-[35vw] h-[35vw] bg-purple-900/10 rounded-full blur-[100px]" />
      </div>

      {/* Footer - Lowered z-index to 10 to prevent covering the fixed submit button which is inside Main (z-20) */}
      <footer className="relative z-10 py-8 text-center text-gray-600 text-sm bg-[#050505]">
        <p>&copy; {new Date().getFullYear()} 하이픽셀플러스 All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
