"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import VideoWithExternalAudio from "@/components/VideoWithExternalAudio";

export default function HomePage() {
  const [step, setStep] = useState<1 | 2>(1);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const showVideo = step === 1;

  useEffect(() => {
    if (showVideo) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    let frameId = 0;
    const arabicChars = "أبتثجحخدذرزسشصضطظعغفقكلمنهوي";
    const fontSize = 14;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const columns = Math.max(1, Math.floor(canvas.width / fontSize));
    const drops = Array(columns).fill(1);

    const draw = () => {
      context.fillStyle = "rgba(13, 35, 26, 0.16)";
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.fillStyle = "rgba(22, 56, 43, 0.72)";
      context.font = `${fontSize}px Amiri, serif`;

      for (let index = 0; index < drops.length; index += 1) {
        const text = arabicChars.charAt(Math.floor(Math.random() * arabicChars.length));
        context.fillText(text, index * fontSize, drops[index] * fontSize);

        if (drops[index] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[index] = 0;
        }

        drops[index] += 1;
      }

      frameId = window.requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.cancelAnimationFrame(frameId);
    };
  }, [showVideo]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0d231a] text-[#f7f4ed] selection:bg-[#d4af37] selection:text-[#0d231a]">
      <AnimatePresence mode="wait">
        {showVideo ? (
          <motion.div
            key="intro"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative flex h-screen min-h-[640px] items-center justify-center overflow-hidden"
          >
           <VideoWithExternalAudio audioEnabled={true} onFinish={() => setStep(2)} />      
          </motion.div>
        ) : (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.85, ease: "easeOut" }}
            className="relative z-10 flex min-h-screen flex-col items-center justify-between px-4 pb-0 pt-6 sm:px-6"
          >
            <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-0 opacity-40" />

            <header className="relative z-10 flex w-full max-w-6xl items-center justify-between border-b border-[#d4af37]/20 px-4 pb-5 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <span className="font-['Reem_Kufi'] text-2xl font-bold tracking-wider text-[#d4af37]">أمتي تقرأ</span>
              </div>

              <nav className="hidden items-center gap-8 text-sm text-[#b8c7c0] md:flex">
                <a href="#about" className="transition-colors hover:text-[#d4af37]">
                  عن المسابقة
                </a>
                <a href="#centers" className="transition-colors hover:text-[#d4af37]">
                  المراكز المشاركة
                </a>
                <a href="#goals" className="transition-colors hover:text-[#d4af37]">
                  الأهداف والرؤية
                </a>
              </nav>

              <Link
                href="/login"
                className="rounded-lg border border-[#d4af37]/50 px-5 py-2 text-xs font-bold font-['Reem_Kufi'] text-[#d4af37] transition-all duration-300 hover:bg-[#d4af37] hover:text-[#0d231a]"
              >
                تسجيل الدخول
              </Link>
            </header>

            <main id="about" className="relative z-10 my-auto mt-10 max-w-3xl space-y-6 px-4 text-center">
              <div className="inline-block rounded-full border border-[#d4af37]/30 bg-[#16382b]/60 px-4 py-1.5 text-xs font-['Reem_Kufi'] tracking-wide text-[#d4af37] backdrop-blur-md">
                ✨ المبادرة القرائية التنافسية الكبرى
              </div>

              <h1 className="font-['Reem_Kufi'] text-4xl leading-tight tracking-wide text-[#f7f4ed] drop-shadow-md sm:text-5xl md:text-6xl">
                إعلاءُ شَأْنِ الكِتَابِ
                <br />
                <span className="text-[#d4af37]">وَصِناعةُ الجِيلِ القَارِئ</span>
              </h1>

              <p className="mx-auto max-w-2xl text-sm leading-relaxed text-[#b8c7c0] sm:text-base">
                منصة تفاعلية متكاملة لربط القرّاء بالمراكز والمشرفين، متابعة التقرير اليومي للقراءة، رصد النقاط، وتكريم الأوائل ضمن بيئة تنافسية مشجعة.
              </p>

              <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
                <Link
                  href="/login"
                  className="rounded-xl bg-[#d4af37] px-8 py-3.5 text-sm font-bold font-['Reem_Kufi'] text-[#0d231a] shadow-[0_4px_25px_rgba(212,175,55,0.3)] transition-all duration-300 hover:bg-[#f7f4ed]"
                >
                  انضم للمسابقة الآن
                </Link>
                <a
                  href="#centers"
                  className="rounded-xl border border-[#d4af37]/30 bg-[#16382b]/70 px-8 py-3.5 text-sm text-[#f7f4ed] backdrop-blur-sm transition-all duration-300 hover:border-[#d4af37]"
                >
                  استكشف تفاصيل المسابقة
                </a>
              </div>

              <div id="goals" className="grid gap-3 pt-4 text-right text-sm text-[#dce8df] sm:grid-cols-3">
                <div className="rounded-[1rem] border border-[#d4af37]/20 bg-[#16382b]/60 p-4">
                  <p className="font-['Reem_Kufi'] text-lg text-[#f7f4ed]">المراحل</p>
                  <p className="mt-2 leading-7 text-[#b8c7c0]">القراءة اليومية، التقدم، والتقييم في مسار واضح ومشجع.</p>
                </div>
                <div className="rounded-[1rem] border border-[#d4af37]/20 bg-[#16382b]/60 p-4">
                  <p className="font-['Reem_Kufi'] text-lg text-[#f7f4ed]">المراكز</p>
                  <p className="mt-2 leading-7 text-[#b8c7c0]">تجمع بين المشرفين والمدراء والطلاب في منظومة واحدة.</p>
                </div>
                <div className="rounded-[1rem] border border-[#d4af37]/20 bg-[#16382b]/60 p-4">
                  <p className="font-['Reem_Kufi'] text-lg text-[#f7f4ed]">الرؤية</p>
                  <p className="mt-2 leading-7 text-[#b8c7c0]">تنمية جيل قارئ يمتلك الوعي، الاستمرارية، والهوية.</p>
                </div>
              </div>
            </main>

            <section id="centers" className="relative mt-6 h-56 w-full max-w-5xl overflow-hidden rounded-[100px_100px_0_0] border-t-2 border-[#d4af37]/40 shadow-[0_-15px_40px_rgba(212,175,55,0.16)] sm:h-72 md:h-80">
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0d231a] via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 z-10 h-24 bg-[radial-gradient(ellipse_45%_100%_at_50%_0%,rgba(212,175,55,0.2),transparent_70%)]" />

              <svg viewBox="0 0 1200 680" className="absolute inset-0 h-full w-full object-cover opacity-90">
                <rect x="0" y="0" width="1200" height="680" fill="url(#libraryGlow)" />
                <rect x="0" y="0" width="1200" height="680" fill="url(#libraryBase)" />
                <g opacity="0.95">
                  <rect x="110" y="245" width="240" height="280" rx="18" fill="#152f22" stroke="#d4af37" strokeOpacity="0.2" />
                  <rect x="370" y="210" width="260" height="320" rx="18" fill="#16382b" stroke="#d4af37" strokeOpacity="0.16" />
                  <rect x="660" y="180" width="300" height="350" rx="20" fill="#11291c" stroke="#d4af37" strokeOpacity="0.2" />
                </g>
                <g opacity="0.82">
                  {[...Array(8)].map((_, index) => (
                    <rect key={index} x={140 + index * 95} y="270" width="48" height="200" rx="8" fill="#2f5c43" />
                  ))}
                  {[...Array(7)].map((_, index) => (
                    <rect key={index + 100} x={400 + index * 92} y="235" width="48" height="220" rx="8" fill="#315b42" />
                  ))}
                  {[...Array(9)].map((_, index) => (
                    <rect key={index + 200} x={690 + index * 78} y="205" width="48" height="240" rx="8" fill="#2d553f" />
                  ))}
                </g>
                <g opacity="0.92">
                  {[...Array(18)].map((_, index) => (
                    <rect key={index + 300} x={155 + (index % 6) * 90} y={280 + Math.floor(index / 6) * 60} width="36" height="44" rx="4" fill="#d4af37" fillOpacity="0.16" />
                  ))}
                </g>
                <path d="M160 145C290 85 500 70 670 120C820 160 985 190 1040 150" stroke="#d4af37" strokeOpacity="0.25" strokeWidth="3" fill="none" />
                <path d="M90 470C260 420 420 400 640 438C790 462 940 490 1085 452" stroke="#f7f4ed" strokeOpacity="0.16" strokeWidth="2" fill="none" />
                <defs>
                  <linearGradient id="libraryGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#132d20" />
                    <stop offset="100%" stopColor="#0a1a13" />
                  </linearGradient>
                  <linearGradient id="libraryBase" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#16382b" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#0d231a" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
              </svg>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
