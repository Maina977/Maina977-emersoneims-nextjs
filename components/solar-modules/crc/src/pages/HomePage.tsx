import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiArrowRight, FiZap, FiTrendingUp, FiTarget, FiBarChart2, FiActivity } from 'react-icons/fi';

// ============================================
// MODERN SCI-FI STYLED COMPONENTS
// ============================================

const HomeContainer = styled.div`
  background: #0A0E27;
  color: white;
  overflow: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 50%, rgba(0, 217, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(255, 0, 110, 0.1) 0%, transparent 50%);
    pointer-events: none;
    z-index: 1;
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
`;

const HeroSection = styled(motion.section)`
  padding: 8rem 2rem 6rem;
  max-width: 1400px;
  margin: 0 auto;
  text-align: center;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 4rem 1rem 2rem;
    min-height: 60vh;
  }
`;

const HeroTitle = styled(motion.h1)`
  font-size: 4.5rem;
  font-weight: 900;
  margin: 0 0 1.5rem;
  background: linear-gradient(135deg, #00D9FF 0%, #FF006E 50%, #FFBE0B 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 3s infinite;
  background-size: 200% 100%;
  letter-spacing: -0.02em;
  
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.85);
  margin: 0 0 3rem;
  max-width: 700px;
  line-height: 1.6;
  text-shadow: 0 0 20px rgba(0, 217, 255, 0.3);
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const HeroButtons = styled(motion.div)`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2.5rem;
  background: linear-gradient(135deg, #00D9FF 0%, #0099CC 100%);
  color: white;
  text-decoration: none;
  font-weight: 700;
  border-radius: 12px;
  font-size: 1.1rem;
  border: 2px solid #00D9FF;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 0 20px rgba(0, 217, 255, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 0 40px rgba(0, 217, 255, 0.8), inset 0 0 30px rgba(255, 255, 255, 0.2);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-2px) scale(1.02);
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2.5rem;
  background: rgba(42, 48, 80, 0.6);
  color: #00D9FF;
  text-decoration: none;
  font-weight: 700;
  border-radius: 12px;
  font-size: 1.1rem;
  border: 2px solid #00D9FF;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  backdrop-filter: blur(10px);
  box-shadow: 0 0 20px rgba(0, 217, 255, 0.3);
  
  &:hover {
    transform: translateY(-4px);
    background: rgba(42, 48, 80, 0.9);
    box-shadow: 0 0 30px rgba(0, 217, 255, 0.6);
    border-color: #FF006E;
    color: #FF006E;
  }
  
  &:active {
    transform: translateY(-2px);
  }
`;

const FeatureScan = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  height: 4px;
  background: linear-gradient(90deg, transparent, #00D9FF, transparent);
  animation: scanDown 4s infinite;
  
  @keyframes scanDown {
    0% { top: 0; opacity: 1; }
    100% { top: 100%; opacity: 0; }
  }
`;

const FeaturesSection = styled(motion.section)`
  padding: 6rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.8rem;
  font-weight: 900;
  margin-bottom: 1rem;
  text-align: center;
  background: linear-gradient(135deg, #00D9FF 0%, #FF006E 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionDesc = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  max-width: 600px;
  margin: 0 auto 3rem;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const FeatureCard = styled(motion.div)`
  background: rgba(42, 48, 80, 0.6);
  border: 1px solid rgba(0, 217, 255, 0.3);
  border-radius: 16px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(0, 217, 255, 0.2), rgba(255, 0, 110, 0.2));
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    border-color: #00D9FF;
    background: rgba(42, 48, 80, 0.9);
    transform: translateY(-8px);
    box-shadow: 0 0 30px rgba(0, 217, 255, 0.4);
    
    &::before {
      opacity: 1;
    }
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, rgba(0, 217, 255, 0.3), rgba(255, 0, 110, 0.3));
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #00D9FF;
  margin-bottom: 1rem;
  border: 1px solid rgba(0, 217, 255, 0.5);
`;

const FeatureTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: white;
`;

const FeatureText = styled.p`
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
`;

const StatsSection = styled(motion.section)`
  padding: 6rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
  background: rgba(42, 48, 80, 0.3);
  border-top: 1px solid rgba(0, 217, 255, 0.2);
  border-bottom: 1px solid rgba(0, 217, 255, 0.2);
  
  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const StatCard = styled(motion.div)`
  text-align: center;
  padding: 2rem;
  background: rgba(10, 14, 39, 0.8);
  border: 1px solid rgba(0, 217, 255, 0.3);
  border-radius: 12px;
  
  &:hover {
    border-color: #00D9FF;
    background: rgba(10, 14, 39, 0.95);
  }
`;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: 900;
  background: linear-gradient(135deg, #00D9FF 0%, #FF006E 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const CTASection = styled(motion.section)`
  padding: 6rem 2rem;
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
`;

const CTABox = styled.div`
  background: linear-gradient(135deg, rgba(0, 217, 255, 0.15), rgba(255, 0, 110, 0.15));
  border: 2px solid rgba(0, 217, 255, 0.4);
  border-radius: 20px;
  padding: 3rem 2rem;
  backdrop-filter: blur(10px);
`;

const CTATitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 1rem;
  color: white;
`;

const CTAText = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
`;

// ============================================
// COMPONENT
// ============================================

const ModernHomePage: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const features = [
    {
      icon: <FiZap />,
      title: 'Advanced Solar Calculator',
      desc: 'AI-powered calculations with 34+ calculation engines for precise energy estimates',
    },
    {
      icon: <FiTarget />,
      title: '3D Design Studio',
      desc: 'Real-time 3D visualization with drag-drop placement and shading analysis',
    },
    {
      icon: <FiBarChart2 />,
      title: 'Financial Analytics',
      desc: 'ROI, payback analysis, financing options, and savings projections',
    },
    {
      icon: <FiTrendingUp />,
      title: 'Investment Modeling',
      desc: 'Advanced financial scenarios and long-term performance tracking',
    },
    {
      icon: <FiActivity />,
      title: 'System Monitoring',
      desc: 'Real-time monitoring dashboard with predictive maintenance',
    },
    {
      icon: <FiArrowRight />,
      title: 'Smart Recommendations',
      desc: 'AI-driven insights for optimal system design and deployment',
    },
  ];
  
  const stats = [
    { number: '34+', label: 'Calculation Engines' },
    { number: '98', label: 'Features Verified' },
    { number: '360°', label: 'Analysis Depth' },
    { number: '99.9%', label: 'Accuracy' },
  ];

  return (
    <HomeContainer>
      <Content>
        {/* Hero Section */}
        <HeroSection
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <FeatureScan />
          
          <HeroTitle variants={itemVariants}>
            SolarGenius Pro
          </HeroTitle>
          
          <HeroSubtitle variants={itemVariants}>
            Enterprise-Grade Solar Design & Analysis Platform
            <br />
            AI-Powered • Real-Time • Professional
          </HeroSubtitle>
          
          <HeroButtons variants={itemVariants}>
            <PrimaryButton to="/dashboard">
              <FiZap size={20} />
              Launch Dashboard
            </PrimaryButton>
            <SecondaryButton to="/calculator">
              <FiBarChart2 size={20} />
              Try Calculator
            </SecondaryButton>
          </HeroButtons>
        </HeroSection>

        {/* Features Section */}
        <FeaturesSection
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <SectionTitle variants={itemVariants}>
            Powerful Features
          </SectionTitle>
          
          <SectionDesc>
            Everything you need to design, analyze, and deploy solar energy systems at scale
          </SectionDesc>
          
          <FeatureGrid>
            {features.map((feature, idx) => (
              <FeatureCard
                key={idx}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureText>{feature.desc}</FeatureText>
              </FeatureCard>
            ))}
          </FeatureGrid>
        </FeaturesSection>

        {/* Stats Section */}
        <StatsSection
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <SectionTitle variants={itemVariants}>
            By The Numbers
          </SectionTitle>
          
          <StatsGrid>
            {stats.map((stat, idx) => (
              <StatCard
                key={idx}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <StatNumber>{stat.number}</StatNumber>
                <StatLabel>{stat.label}</StatLabel>
              </StatCard>
            ))}
          </StatsGrid>
        </StatsSection>

        {/* CTA Section */}
        <CTASection
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <CTABox>
            <CTATitle>Ready to Transform Solar Design?</CTATitle>
            <CTAText>
              Join thousands of solar professionals using SolarGenius Pro for advanced analysis and design
            </CTAText>
            <PrimaryButton to="/dashboard">
              <FiArrowRight size={20} />
              Get Started Now
            </PrimaryButton>
          </CTABox>
        </CTASection>
      </Content>
    </HomeContainer>
  );
};

export default ModernHomePage;
