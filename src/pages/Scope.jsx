// src/pages/Scope.jsx
import React from 'react';
import { Brain, Cpu, Network, Lightbulb, Zap, Globe, Target, BookOpen, Shield, Layers, Users, Sparkles } from "lucide-react";
import SidebarLayout from '../layouts/SidebarLayout';

export default function Scope() {
  const keyInterests = [
    {
      title: "Evolutionary Design of Neural Architectures",
      icon: Brain,
      description: "Using genetic algorithms to optimize the parameters of neural networks."
    },
    {
      title: "Adaptive Smart Grids",
      icon: Zap,
      description: "Evolutionary optimization of energy distribution in smart grids, factoring in renewable sources, demand-response strategies, and storage solutions."
    },
    {
      title: "Smart Cities and Evolutionary Algorithms",
      icon: Globe,
      description: "Using evolutionary strategies to optimize traffic flow, waste management, energy usage, and more in urban environments."
    },
    {
      title: "Evolutionary Robotics",
      icon: Cpu,
      description: "Designing robots that can adapt and evolve their behavior based on their interactions with the environment."
    },
    {
      title: "Personalized Medicine",
      icon: Target,
      description: "Using genetic algorithms to tailor medical therapies to individual patients based on their unique genetic makeup and health history."
    },
    {
      title: "Evolutionary Game Theory in Economics and Social Systems",
      icon: Users,
      description: "Studying how strategies evolve in economic and social systems using game-theoretic models."
    },
    {
      title: "Swarm Intelligence and Smart Systems",
      icon: Network,
      description: "Leveraging concepts from swarm behavior in nature (e.g., birds, ants) to design distributed smart systems that can coordinate and optimize complex tasks."
    },
    {
      title: "Evolution of Cooperative and Competitive Behaviors in AI Agents",
      icon: Lightbulb,
      description: "Using evolutionary methods to study and enhance cooperation or competition among AI agents."
    },
    {
      title: "Self-healing Systems",
      icon: Layers,
      description: "Systems that can automatically detect faults or damage and repair themselves, inspired by biological systems, optimized using evolutionary techniques."
    },
    {
      title: "Evolving Encryption and Security Protocols",
      icon: Shield,
      description: "Leveraging evolutionary algorithms to develop robust and adaptive security mechanisms for digital systems."
    },
    {
      title: "Hyper-heuristics",
      icon: BookOpen,
      description: "Evolutionary algorithms that produce other algorithms. For instance, evolving sorting or search algorithms tailored to specific types of data or tasks."
    },
    {
      title: "Evolutionary Multi-objective Optimization",
      icon: Target,
      description: "Designing smart systems that simultaneously balance and optimize multiple objectives."
    },
    {
      title: "Interactive Evolution",
      icon: Users,
      description: "Systems where human preferences guide the evolutionary process, often used in design, art, and entertainment applications."
    },
    {
      title: "Transfer and Meta-Learning with Evolutionary Strategies",
      icon: Brain,
      description: "Using evolutionary methods to optimize models that can transfer knowledge between tasks or learn how to learn."
    },
    {
      title: "Evolutionary Dynamics of Social Networks",
      icon: Network,
      description: "Analyzing and optimizing the flow of information, influence, or behavior in social networks using evolutionary models."
    },
    {
      title: "Evolutionary Advancement in Emerging Technologies",
      icon: Sparkles,
      description: "Evolutionary advancement in Quantum Computing, Pervasive/Ubiquitous Computing, and Meta-verse."
    },
  ];

  return (
    <SidebarLayout
      title="Aim & Scope"
      subtitle="Transaction on Evolutionary Smart Systems"
      icon={Target}
    >
      {/* ONLY THE CONTENT - No more hero section here! */}
      <div className="space-y-12">
        {/* Mission Statement */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
          
          <div className="space-y-4 text-slate-700 leading-relaxed">
            <p>
              <span className="font-bold text-slate-900">Transaction on Evolutionary Smart Systems</span> is dedicated to the latest advancements in using evolutionary algorithms to design, optimize, and enhance smart systems. These systems, which can adapt and learn from their environment, can benefit from evolutionary approaches that mimic natural selection and genetic variation to find optimal or near-optimal solutions to complex problems.
            </p>
            
            <p>
              The journal mainly focuses on the cutting-edge intersection of evolutionary computation and smart system technologies. The journal aims to advance research and disseminate knowledge in areas like nature-inspired algorithms and sophisticated evolutionary methods and integrate these techniques within smart systems.
            </p>
            
            <p>
              The journal's scope encompasses a broad range of topics, from developing novel evolutionary algorithms to applying these methods in optimizing, adapting, and evolving smart systems. This would include exploring how evolutionary principles can enhance systems' intelligence, efficiency, and adaptability in various domains, such as robotics, artificial intelligence, and complex system engineering. The journal intends to serve as a platform for researchers and practitioners to exchange ideas, findings, and innovations in this dynamically evolving field.
            </p>
          </div>
        </div>

        {/* Key Areas of Interest */}
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Key Areas of Interest
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {keyInterests.map((area, index) => {
              const Icon = area.icon;
              return (
                <div 
                  key={index} 
                  className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-300 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:from-indigo-500 group-hover:to-blue-500 transition-all duration-300">
                      <Icon className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-indigo-700 transition-colors">
                        {area.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {area.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Research Focus */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-indigo-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Research Focus Areas</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              "Nature-Inspired Algorithms",
              "Evolutionary Computation",
              "Swarm Intelligence",
              "Neural Architecture Search",
              "Smart Grid Optimization",
              "Urban Computing",
              "Adaptive Robotics",
              "Computational Biology",
              "Evolutionary Economics",
              "Distributed Systems",
              "AI Agent Behavior",
              "Autonomous Systems",
              "Cybersecurity",
              "Algorithm Evolution",
              "Multi-objective Optimization",
              "Human-Computer Interaction",
              "Knowledge Transfer",
              "Social Network Analysis",
              "Quantum Computing",
              "Pervasive Computing",
              "Metaverse Technologies"
            ].map((topic, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2 p-3 bg-white rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-100"
              >
                <div className="w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0"></div>
                <span className="text-sm text-slate-700 font-medium">{topic}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-indigo-900 to-blue-900 rounded-2xl p-8 text-center text-white shadow-xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Contribute?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto text-lg">
            We welcome high-quality submissions that advance the field of evolutionary 
            computation and smart systems.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a 
              href="/submit" 
              className="px-8 py-3 bg-white text-indigo-900 font-semibold rounded-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Submit Your Paper
            </a>
            <a 
              href="/guidelines" 
              className="px-8 py-3 bg-indigo-800 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all border-2 border-white/30 hover:border-white/50"
            >
              Author Guidelines
            </a>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}