"use client";

import Link from "next/link";

import HeroScene3D from "./HeroScene3D";
import HeroOverlay from "./HeroOverlay";
import SceneTransition from "./SceneTransition";
import ScrollScene from "./ScrollScene";

export default function HeroCinematic() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#F7F3EA]">
      <ScrollScene />
      <SceneTransition />
      <HeroOverlay />

      <div
        className="
mx-auto
flex
min-h-screen
max-w-7xl
flex-col
items-center
justify-center
gap-10
px-6
lg:flex-row
lg:justify-between
lg:px-10
"
      >
        <div className="relative z-10 max-w-xl">
          <span className="inline-block rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
            منصة تعليمية
          </span>

          <h1
            className="
text-5xl
font-black
leading-tight
text-[#18392B]
sm:text-6xl
lg:text-7xl
"
          >
            أمتي تقرأ
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-xl">
            اقرأ، تعلّم، وارتقِ بمهاراتك من خلال تجربة تعليمية حديثة بتصميم أنيق وسلس.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/signup" className="rounded-full bg-emerald-700 px-8 py-4 font-bold text-white">
              ابدأ الآن
            </Link>

            <a href="#book" className="rounded-full border border-emerald-700 px-8 py-4 font-bold text-emerald-700">
              استكشف
            </a>
          </div>
        </div>

        <div className="relative h-[500px] w-full lg:min-h-[640px] lg:flex-1">
          <HeroScene3D />
        </div>
      </div>
    </section>
  );
}
