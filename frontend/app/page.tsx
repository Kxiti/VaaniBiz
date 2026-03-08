"use client";

import { motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import {
  FaMicrophone,
  FaBrain,
  FaChartLine,
  FaRoad,
  FaLightbulb,
  FaUsers,
  FaGlobe,
  FaRocket,
} from "react-icons/fa";

export default function Home() {
  const howItWorks = [
    {
      icon: <FaMicrophone className="text-3xl" />,
      title: "Speak or Type",
      description:
        "Tell us your business idea using voice or text in your language",
    },
    {
      icon: <FaBrain className="text-3xl" />,
      title: "AI Understanding",
      description:
        "Our AI understands your business and asks clarifying questions",
    },
    {
      icon: <FaChartLine className="text-3xl" />,
      title: "Get Insights",
      description: "Receive market analysis, costs, and risk assessment",
    },
    {
      icon: <FaRoad className="text-3xl" />,
      title: "Startup Roadmap",
      description: "Get a step-by-step action plan to start your business",
    },
    {
      icon: <FaLightbulb className="text-3xl" />,
      title: "Find Opportunities",
      description: "Discover local events and seasonal opportunities",
    },
  ];

  const exampleIdeas = [
    "I want to start a tea stall near my college",
    "मैं अपने गांव में छोटी किराना दुकान खोलना चाहता हूं",
    "நான் ஒரு சிறிய உணவகம் தொடங்க விரும்புகிறேன்",
    "मला एक छोटे कपड्याचे दुकान सुरू करायचे आहे",
  ];

  const features = [
    {
      icon: <FaGlobe className="text-3xl" />,
      title: "8 Indian Languages",
      description: "Speak in Hindi, Tamil, Marathi, and more",
    },
    {
      icon: <FaUsers className="text-3xl" />,
      title: "Made for Everyone",
      description: "Simple interface for first-time entrepreneurs",
    },
    {
      icon: <FaRocket className="text-3xl" />,
      title: "AI-Powered",
      description: "Advanced AI creates personalized business plans",
    },
  ];

  return (
    <main className="min-h-screen">
      <HeroSection />

      {/* How It Works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-dark mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              From idea to action plan in 5 simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-6">
            {howItWorks.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 text-white">
                  {step.icon}
                </div>
                <h3 className="font-bold text-dark mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Example Ideas */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-dark mb-4">
              Example Business Ideas
            </h2>
            <p className="text-xl text-gray-600">
              Try speaking or typing ideas like these
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {exampleIdeas.map((idea, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 card-shadow hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <FaMicrophone className="text-primary text-xl mt-1 flex-shrink-0" />
                  <p className="text-gray-700 leading-relaxed">{idea}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-dark mb-4">
              Why VaaniBiz AI?
            </h2>
            <p className="text-xl text-gray-600">
              Built for Tier 2/3 India entrepreneurs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 bg-gray-50 rounded-2xl hover:shadow-xl transition-shadow"
              >
                <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 text-white">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-dark mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 gradient-hero">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center text-white"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your Business?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of entrepreneurs building their dreams
          </p>
          <a
            href="/idea"
            className="inline-block px-10 py-4 bg-white text-primary rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
          >
            Start Now - It's Free
          </a>
        </motion.div>
      </section>
    </main>
  );
}
