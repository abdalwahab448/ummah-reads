"use client";

import { motion } from "framer-motion";
import { BookOpen, Menu } from "lucide-react";

export default function Navbar() {
	return (
		<motion.header
			initial={{ y: -80, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.8 }}
			className="absolute top-0 left-0 z-50 w-full"
		>
			<div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">

				{/* Logo */}
				<motion.div
					whileHover={{ scale: 1.05 }}
					className="flex items-center gap-3"
				>
					<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-xl">
						<BookOpen size={24} />
					</div>

					<div>
						<h2 className="text-xl font-black text-emerald-900">
							أمتي تقرأ
						</h2>

						<p className="text-xs text-gray-500">
							اقرأ • تعلّم • تقدّم
						</p>
					</div>
				</motion.div>

				{/* Desktop Menu */}
				<nav className="hidden items-center gap-10 rounded-full border border-white/40 bg-white/60 px-8 py-3 shadow-2xl backdrop-blur-xl lg:flex">
					<a className="font-semibold text-gray-700 hover:text-emerald-700 transition">
						الرئيسية
					</a>

					<a className="font-semibold text-gray-700 hover:text-emerald-700 transition">
						الدورات
					</a>

					<a className="font-semibold text-gray-700 hover:text-emerald-700 transition">
						الكتب
					</a>

					<a className="font-semibold text-gray-700 hover:text-emerald-700 transition">
						من نحن
					</a>

					<a className="font-semibold text-gray-700 hover:text-emerald-700 transition">
						تواصل
					</a>
				</nav>

				{/* CTA */}
				<div className="flex items-center gap-3">

					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: .95 }}
						className="hidden rounded-full bg-emerald-700 px-7 py-3 font-bold text-white shadow-xl lg:block"
					>
						ابدأ الآن
					</motion.button>

					<button className="rounded-xl border bg-white/70 p-3 shadow-xl backdrop-blur lg:hidden">
						<Menu />
					</button>

				</div>

			</div>
		</motion.header>
	);
}

