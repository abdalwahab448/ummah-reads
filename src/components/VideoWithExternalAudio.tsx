'use client';

import React, { useEffect, useRef, useState } from 'react';

type VideoWithExternalAudioProps = {
  onFinish?: () => void;
  audioEnabled: boolean;
  onEnableAudio?: () => void;
};

export default function VideoWithExternalAudio({ onFinish, audioEnabled, onEnableAudio }: VideoWithExternalAudioProps) {
  const [showVideo, setShowVideo] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleEnableAudio = async () => {
    if (!audioRef.current) return;

    try {
      await audioRef.current.play();
      if (onEnableAudio) onEnableAudio();
    } catch (error) {
      console.warn("Audio playback blocked until user gesture is allowed", error);
    }
  };

  const handlePlayBoth = () => {
    if (videoRef.current) videoRef.current.play();

    if (audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          // ignore blocked autoplay; wait for explicit user click
        });
      }
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
        autoPlay
        muted
        playsInline
        loop={false}
        onPlay={handlePlayBoth}
        onEnded={handleEndOrSkip}
        onError={handleEndOrSkip}
        className="w-full h-full object-cover"
      >
        <source src="/assets/intro.mp4.mp4" type="video/mp4" />
        <source src="/assets/intro.mp4" type="video/mp4" />
      </video>

      <audio ref={audioRef} src="/assets/audio.mp3" preload="auto" />

      {!audioEnabled && (
        <button
          onClick={handleEnableAudio}
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
