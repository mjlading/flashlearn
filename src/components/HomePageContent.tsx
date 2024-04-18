"use client";
import { motion } from "framer-motion";
import AuthButton from "./AuthButton";

export default function HomePageContent({ dict }: { dict: any }) {
  return (
    <motion.div
      initial={{ opacity: 0.0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.3,
        duration: 0.8,
        ease: "easeInOut",
      }}
      className="relative flex flex-col gap-4 items-center justify-center px-4"
    >
      <h1 className="text-5xl font-bold text-gray-900 mb-6">
        {dict.home.title}
      </h1>
      <h3 className="text-xl text-gray-600 mb-12">{dict.home.slogan}</h3>
      <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        <AuthButton dict={dict} />
      </div>
    </motion.div>
  );
}
