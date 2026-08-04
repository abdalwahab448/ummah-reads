'use client';

import React, { useEffect, useRef, useState } from 'react';

type VideoWithExternalAudioProps = {
  onFinish?: () => void;
  audioEnabled: boolean;
  onEnableAudio?: () => void;
};

export default function VideoWithExternalAudio({ onFinish, audioEnabled, onEnableAudio }: VideoWithExternalAudioProps) {
  const [showVideo, setShowVideo] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayBoth = async () => {
    if (isPlaying) return;
    const video = videoRef.current;
    const audio = audioRef.current;

    if (!video && !audio) return;

    if (video) {
      video.muted = false;
      video.volume = 1;
    }

    if (audio) {
      audio.muted = false;
      audio.volume = 1;
      audio.currentTime = 0;
    }

    try {
      const playPromises = [video?.play?.(), audio?.play?.()].filter((value): value is Promise<void> => Boolean(value));
      await Promise.all(playPromises);
      setIsPlaying(true);
      setShowOverlay(false);
      if (onEnableAudio) onEnableAudio();
    } catch (error) {
      console.warn("Playback blocked until user interaction is allowed", error);
    }
  };

  const smoothPauseAudio = () => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    const startVolume = audio.volume;
    const steps = 8;
    const stepDuration = 30;
    let currentStep = 0;

    const fade = setInterval(() => {
      currentStep += 1;
      const nextVolume = Math.max(0, startVolume * (1 - currentStep / steps));
      audio.volume = nextVolume;

      if (currentStep >= steps) {
        clearInterval(fade);
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 1;
      }
    }, stepDuration);
  };

  const handleEndOrSkip = () => {
    if (audioRef.current) {
      smoothPauseAudio();
    }
    setIsPlaying(false);
    setShowOverlay(false);
    setShowVideo(false);
    if (onFinish) onFinish();
  };

  useEffect(() => {
    if (!showVideo && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [showVideo]);

  if (!showVideo) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <video
        ref={videoRef}
        playsInline
        loop={false}
        onPlay={() => {
          setIsPlaying(true);
          setShowOverlay(false);
        }}
        onEnded={handleEndOrSkip}
        onError={handleEndOrSkip}
        className="w-full h-full object-cover"
      >
        <source src="/assets/intro.mp4.mp4" type="video/mp4" />
        <source src="/assets/intro.mp4" type="video/mp4" />
      </video>

      <audio ref={audioRef} src="/assets/audio.mp3" preload="auto" />

      {showOverlay && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative flex flex-col items-center rounded-[2rem] border border-[#d4af37]/40 bg-gradient-to-br from-[#0d231a] via-[#16382b] to-[#0d231a] px-8 py-10 text-center shadow-[0_0_80px_rgba(212,175,55,0.25)]">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#d4af37] to-[#f7f4ed] text-4xl text-[#0d231a] shadow-lg">
              ▶
            </div>
            <p className="mb-2 text-xl font-semibold text-[#f7f4ed]">ابدأ العرض الآن</p>
            <p className="mb-6 max-w-xs text-sm leading-6 text-[#d4af37]/90">
              اضغط للبدء مع الفيديو والصوت معاً وبشكلٍ واضح.
            </p>
            <button
              type="button"
              onClick={handlePlayBoth}
              className="rounded-full bg-[#d4af37] px-6 py-3 text-sm font-bold text-[#0d231a] shadow-lg transition hover:scale-105 hover:bg-[#f7f4ed]"
            >
              تشغيل الفيديو والصوت
            </button>
          </div>
        </div>
      )}

      {!audioEnabled && !showOverlay && (
        <button
          onClick={handlePlayBoth}
          className="absolute bottom-20 right-6 z-50 rounded-full bg-[#d4af37] px-5 py-3 text-sm font-semibold text-[#0d231a] shadow-lg transition hover:bg-[#f7f4ed]"
        >
          🔊 تشغيل الصوت
        </button>
      )}

      <button
        onClick={handleEndOrSkip}
        className="absolute top-6 left-6 z-50 px-6 py-2.5 bg-[#16382b]/80 border border-[#d4af37]/40 text-[#d4af37] rounded-full text-xs font-bold backdrop-blur-md hover:bg-[#d4af37] hover:text-[#0d231a] transition-all shadow-lg"
      >
        تخطي العرض ←
      </button>
    </div>
  );
}
