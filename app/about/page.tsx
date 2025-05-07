"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import AnimatedButton from "@/components/AnimatedButton";
import {
  FiUsers,
  FiStar,
  FiAward,
  FiBookOpen,
  FiChevronRight,
  FiMail,
} from "react-icons/fi";
import Link from "next/link";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

// Define team members data
const teamMembers = [
  {
    name: "Florence Adejumo",
    role: "Class Rep",
    image:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Marvellous Adebayo",
    role: "Developer",
    image: "/images/marvellous.jpg",
  },
  {
    name: "Micheal Odewale",
    role: "Designer",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Temitope Adesuyan",
    role: "UI?UX Centralist",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Olajumoke Akinrole",
    role: "Committee Member",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
  },
];

// Define stats data
const stats = [
  {
    label: "Students",
    value: 165,
    icon: <FiUsers className="w-6 h-6 text-primary" />,
  },
  {
    label: "Years Active",
    value: 25,
    icon: <FiBookOpen className="w-6 h-6 text-secondary" />,
  },
  {
    label: "Events",
    value: 120,
    icon: <FiStar className="w-6 h-6 text-lincssa-gold" />,
  },
  {
    label: "Awards",
    value: 300,
    icon: <FiAward className="w-6 h-6 text-green-500" />,
  },
];

export default function AboutPage() {
  // For animations based on scroll
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [statsRef, statsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Navbar />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="min-h-[60vh] flex items-center relative overflow-hidden pt-24"
      >
        <div className="container mx-auto px-4 py-12 md:py-16 z-10">
          <motion.div
            initial="hidden"
            animate={heroInView ? "show" : "hidden"}
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h1
              variants={item}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-lincssa-blue mb-6"
            >
              About <span className="text-primary">LINCSSA</span>
            </motion.h1>

            <motion.p
              variants={item}
              className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8"
            >
              The Linguistics and Communication Studies Students Association
              (LINCSSA) is dedicated to fostering academic excellence,
              professional development, and community among students in the
              department.
            </motion.p>

            <motion.div variants={item}>
              <AnimatedButton
                variant="primary"
                size="lg"
                icon={<FiChevronRight />}
                iconPosition="right"
              >
                Join LINCSSA Today
              </AnimatedButton>
            </motion.div>
          </motion.div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-1/3 right-10 w-32 h-32 md:w-64 md:h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-10 w-32 h-32 md:w-48 md:h-48 bg-secondary/10 rounded-full blur-3xl" />
      </section>

      {/* Our Mission */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                    alt="LINCSSA Students"
                    className="w-full h-auto"
                  />
                </div>
                <div className="absolute -bottom-8 -right-8 w-full h-full bg-primary/20 rounded-2xl -z-10 transform rotate-3" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-display font-bold text-gray-900 mb-6">
                  Our Mission & Vision
                </h2>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-primary mb-2">
                    Mission
                  </h3>
                  <p className="text-gray-700">
                    To create a vibrant community of linguistics and
                    communication studies students, providing resources and
                    opportunities for academic growth, professional development,
                    and social engagement.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-secondary mb-2">
                    Vision
                  </h3>
                  <p className="text-gray-700">
                    To be the premier student association that prepares
                    linguistics and communication studies students to become
                    innovative leaders and impactful communicators in a global
                    society.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-lincssa-blue mb-2">
                    Core Values
                  </h3>
                  <ul className="text-gray-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>
                        Excellence in academic and professional pursuits
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>
                        Diversity, inclusion, and respect for all perspectives
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>
                        Leadership development and service to the community
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>
                        Innovation in language and communication research
                      </span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section
        ref={statsRef}
        className="py-16 bg-gradient-to-br from-lincssa-blue to-primary text-white"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-2">
              LINCSSA By The Numbers
            </h2>
            <div className="w-16 h-1 bg-lincssa-gold mx-auto"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={
                  statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center"
              >
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold mb-1">
                  <CountUp
                    end={stat.value}
                    duration={2.5}
                    enableScrollSpy
                    scrollSpyOnce
                  />
                  +
                </h3>
                <p className="text-white/80">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
              Our Leadership Team
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Meet the dedicated individuals who work tirelessly to make LINCSSA
              a vibrant and supportive community for all linguistics and
              communication studies students.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-gray-50 rounded-xl overflow-hidden shadow-sm"
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-lg font-bold text-gray-900">
                    {member.name}
                  </h3>
                  <p className="text-sm text-primary">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
                Join the LINCSSA Community
              </h2>
              <p className="text-gray-600 mb-8">
                Be part of our vibrant community and access events, resources,
                and opportunities designed to enhance your academic and
                professional journey.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <AnimatedButton variant="primary" icon={<FiUsers />}>
                    Register Now
                  </AnimatedButton>
                </Link>

                <AnimatedButton variant="outline" icon={<FiMail />}>
                  Contact Us
                </AnimatedButton>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
