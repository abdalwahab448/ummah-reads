'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// استيراد خلفية المكتبة
import libraryBg from '../assets/library_bg.jpg';

export default function LandingPage() {
  const [showVideo, setShowVideo] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleStart = async () => {
    const video = videoRef.current;
    const audio = audioRef.current;

    if (!video || !audio) return;

    video.muted = false;
    video.volume = 1;
    audio.muted = false;
    audio.volume = 1;

    try {
      await Promise.all([video.play(), audio.play()]);
      setHasStarted(true);
    } catch (error) {
      console.warn('Playback blocked until user interaction is allowed', error);
    }
  };

  // 2. إيقاف الاثنين معاً
  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  // 3. ✨ السر هنا: ضبط التزامن المستمر أثناء التشغيل
  const handleTimeUpdate = () => {
    if (videoRef.current && audioRef.current) {
      const timeDiff = Math.abs(videoRef.current.currentTime - audioRef.current.currentTime);
      if (timeDiff > 0.1) {
        audioRef.current.currentTime = videoRef.current.currentTime;
      }
    }
  };

  // 4. عند انتهاء الفيديو والصوت
  const handleEnded = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setShowVideo(false);
  };

  return (
    <main className="min-h-screen w-full bg-[#0d231a] flex items-center justify-center p-4 md:p-8 dir-rtl">
      {/* 1. مشهد مقدمة الفيديو والصوت المدمج */}
      {showVideo ? (
        <div className="relative w-full max-w-5xl h-[600px] rounded-2xl overflow-hidden border border-[#d4af37]/40 shadow-2xl bg-black flex items-center justify-center">
          <video
            ref={videoRef}
            playsInline
            onPause={handlePause}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            className="w-full h-full object-cover"
          >
            <source src="/assets/intro.mp4" type="video/mp4" />
            متصفحك لا يدعم تشغيل الفيديو.
          </video>

          <audio
            ref={audioRef}
            src="/assets/audio.mp3"
            preload="auto"
          />

          {!hasStarted && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 backdrop-blur-sm">
              <div className="flex flex-col items-center rounded-[2rem] border border-[#d4af37]/40 bg-gradient-to-br from-[#0d231a] via-[#16382b] to-[#0d231a] px-8 py-10 text-center shadow-[0_0_80px_rgba(212,175,55,0.25)]">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#d4af37] to-[#f7f4ed] text-4xl text-[#0d231a] shadow-lg">
                  ▶
                </div>
                <p className="mb-2 text-xl font-semibold text-[#f7f4ed]">ابدأ العرض الآن</p>
                <p className="mb-6 max-w-xs text-sm leading-6 text-[#d4af37]/90">
                  اضغط للبدء مع الفيديو والصوت معاً وبشكل واضح.
                </p>
                <button
                  type="button"
                  onClick={handleStart}
                  className="rounded-full bg-[#d4af37] px-6 py-3 text-sm font-bold text-[#0d231a] shadow-lg transition hover:scale-105 hover:bg-[#f7f4ed]"
                >
                  تشغيل الفيديو والصوت
                </button>
              </div>
            </div>
          )}

          <button
            onClick={handleEnded}
            className="absolute bottom-6 left-6 z-30 bg-[#0d231a]/80 text-[#d4af37] border border-[#d4af37]/50 px-6 py-2 rounded-full font-medium text-sm hover:bg-[#d4af37] hover:text-[#0d231a] transition-all backdrop-blur-md shadow-lg"
          >
            تخطي المقدمة ↵
          </button>
        </div>
      ) : (
        <div className="relative w-full max-w-5xl h-[600px] rounded-2xl overflow-hidden border border-[#d4af37]/40 shadow-2xl animate-fade-in">
          <Image
            src={libraryBg}
            alt="Library Background"
            fill
            priority
            placeholder="blur"
            className="object-cover z-0"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#0d231a]/85 via-[#0d231a]/40 to-transparent z-10 pointer-events-none" />

          <div className="relative z-20 h-full flex flex-col justify-between p-8 md:p-12 text-[#f1f0e6]">
            <header className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-[#d4af37] font-serif">
                أُمَّتِي تَقْرَأُ
              </h1>
              <nav className="hidden md:flex space-x-6 space-x-reverse text-sm font-medium">
                <Link href="#" className="hover:text-[#d4af37] transition-colors">الرئيسية</Link>
                <Link href="#" className="hover:text-[#d4af37] transition-colors">عن المبادرة</Link>
                <Link href="#" className="hover:text-[#d4af37] transition-colors">المراكز</Link>
              </nav>
            </header>

            <div className="max-w-xl my-auto">
              <p className="text-[#d4af37] text-sm font-semibold mb-2">
                ✦ المبادرة القرائية التنافسية الكبرى
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-[#d4af37] mb-4 font-serif leading-tight">
                إِعْلَاءُ شَأْنِ الكِتَابِ <br />
                <span className="text-white">وَصِناعَةُ الجِيلِ القَارِئ</span>
              </h2>
              <p className="text-gray-200 text-sm md:text-base leading-relaxed mb-6">
                منصة تفاعلية متكاملة لربط القرّاء بالمراكز والمشرفين، متابعة التقرير اليومي للقراءة، رصد النقاط، وتكريم الأوائل.
              </p>

              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="bg-[#d4af37] text-[#0d231a] font-bold px-6 py-3 rounded-full hover:bg-white transition-all shadow-lg"
                >
                  انضم للمسابقة الآن
                </Link>

                <button
                  onClick={() => setShowVideo(true)}
                  className="bg-[#0d231a]/60 text-[#f1f0e6] px-5 py-3 rounded-full border border-[#f1f0e6]/30 hover:border-[#d4af37] hover:text-[#d4af37] transition-all text-sm"
                >
                  إعادة تشغيل الفيديو 🎬
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
