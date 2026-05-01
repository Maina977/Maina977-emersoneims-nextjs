import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const Container = styled.div`
  background: #0A0E27;
  min-height: 100vh;
  padding: 2rem;
  @media (max-width: 768px) { padding: 1rem; }
`;

const Title = styled.h1`
  color: #00D9FF;
  margin-bottom: 0.5rem;
  font-size: clamp(1.5rem, 5vw, 2.5rem);
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 2rem;
  font-size: 1rem;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const CategoryCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(0, 217, 255, 0.1), rgba(0, 217, 255, 0.05));
  border: 2px solid rgba(0, 217, 255, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    border-color: #00D9FF;
    box-shadow: 0 0 20px rgba(0, 217, 255, 0.3);
    transform: translateY(-4px);
  }
`;

const CategoryTitle = styled.h2`
  color: #00D9FF;
  margin: 0 0 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FeatureCount = styled.span`
  background: rgba(0, 217, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  color: #00FF88;
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FeatureItem = styled(motion.li)`
  padding: 0.5rem 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  &::before {
    content: "✓";
    color: #00FF88;
    font-weight: bold;
  }
`;

const StatsSection = styled.div`
  background: rgba(42, 48, 80, 0.8);
  border: 1px solid rgba(0, 217, 255, 0.3);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

const StatBox = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 900;
  color: #00D9FF;
  line-height: 1;
`;

const StatLabel = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  text-transform: uppercase;
  margin-top: 0.5rem;
`;

export default function FeaturesPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const features = {
    "🧮 Financial Calculators": [
      "System Cost Calculator",
      "ROI Analysis Tool",
      "Payback Period Calculator",
      "Government Subsidy Estimator",
      "Monthly Savings Calculator",
      "Annual Revenue Projector",
      "Financing Options Analyzer",
      "Tax Incentive Calculator",
      "Cost per Watt Optimizer",
      "Break-even Analysis",
      "Loan Payment Calculator",
      "Price Comparison Tool",
    ],
    "⚡ System Design Calculators": [
      "Solar Array Sizing",
      "Panel Count Calculator",
      "Inverter Sizing Tool",
      "Battery Capacity Calculator",
      "Voltage Drop Calculator",
      "Wire Gauge Selector",
      "Load Analysis Tool",
      "Consumption Estimator",
      "System Efficiency Calculator",
      "Peak Sun Hours Estimator",
      "Shading Analysis",
      "Roof Space Calculator",
    ],
    "🌍 Environmental Impact": [
      "Carbon Offset Calculator",
      "CO₂ Emission Reduction",
      "Environmental Impact Report",
      "Tree Equivalent Calculation",
      "Water Savings Estimator",
      "Sustainability Score",
      "Green Certification Check",
      "ESG Metrics Generator",
      "Climate Action Impact",
      "Energy Independence Track",
    ],
    "📊 Analytics & Monitoring": [
      "Real-time Production Monitor",
      "Daily Energy Charts",
      "Monthly Trend Analysis",
      "Seasonal Performance Report",
      "Annual Production Forecast",
      "Efficiency Tracking",
      "Performance Alerts",
      "Historical Data Archive",
      "Predictive Analytics",
      "Performance Benchmarking",
      "Degradation Modeling",
      "Weather Impact Analysis",
    ],
    "🏗️ Technical Analysis": [
      "3D System Visualization",
      "Roof Assessment Tool",
      "Shade Analysis Engine",
      "Structural Load Calculator",
      "Weather Data Integration",
      "Solar Irradiance Mapping",
      "Temperature Effects Analysis",
      "Humidity Impact Modeling",
      "Wind Load Calculation",
      "Snow Load Estimator",
      "System Configuration Optimizer",
      "Performance Ratio Calculator",
    ],
    "🔧 Maintenance & Support": [
      "Maintenance Schedule Generator",
      "Parts Inventory Tracker",
      "Service Request Manager",
      "Warranty Management System",
      "Troubleshooting Guide",
      "Performance Diagnostics",
      "System Health Report",
      "Predictive Maintenance Alerts",
      "Parts Replacement Scheduler",
      "Service History Archive",
    ],
    "🌐 Grid Integration": [
      "Net Metering Calculator",
      "Grid Feed-in Analyzer",
      "Peak Shaving Optimizer",
      "Time-of-Use Rate Analyzer",
      "Grid Compliance Checker",
      "Export Limit Calculator",
      "Demand Response Modeler",
      "Power Quality Analyzer",
      "Grid Stability Monitor",
      "Load Balancing Tool",
    ],
    "📱 Mobile & Remote": [
      "Mobile App Access",
      "Real-time Notifications",
      "Remote System Control",
      "Push Alerts",
      "SMS Monitoring",
      "Offline Mode Support",
      "Data Sync Cloud",
      "Multi-device Access",
    ],
    "🔐 Security & Compliance": [
      "Data Encryption",
      "User Access Control",
      "Audit Trail Logging",
      "Compliance Reporting",
      "GDPR Compliance",
      "ISO Certification Support",
      "Security Audit Tools",
      "Backup & Recovery System",
    ],
    "🎯 Reporting & Documents": [
      "System Design Report",
      "Quotation Generator",
      "Installation Blueprint",
      "Warranty Certificate",
      "Performance Report",
      "Financial Summary",
      "Compliance Documentation",
      "Customer Presentation",
      "PDF Export",
      "Multi-language Support",
    ],
  };

  const totalFeatures = Object.values(features).reduce((sum, cat) => sum + cat.length, 0);

  return (
    <Container>
      <Title>☀️ SolarGeniusPro Feature Suite</Title>
      <Subtitle>
        Comprehensive solar management platform with 100+ features for complete system optimization
      </Subtitle>

      <StatsSection>
        <StatBox>
          <StatNumber>{totalFeatures}+</StatNumber>
          <StatLabel>Total Features</StatLabel>
        </StatBox>
        <StatBox>
          <StatNumber>{Object.keys(features).length}</StatNumber>
          <StatLabel>Categories</StatLabel>
        </StatBox>
        <StatBox>
          <StatNumber>24/7</StatNumber>
          <StatLabel>Support</StatLabel>
        </StatBox>
        <StatBox>
          <StatNumber>∞</StatNumber>
          <StatLabel>Scalable</StatLabel>
        </StatBox>
      </StatsSection>

      <CategoryGrid>
        {Object.entries(features).map(([category, items], idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <CategoryCard
              onClick={() =>
                setSelectedCategory(selectedCategory === category ? null : category)
              }
            >
              <CategoryTitle>
                {category.split(" ")[0]}{" "}
                <FeatureCount>{items.length} features</FeatureCount>
              </CategoryTitle>
              <FeaturesList>
                {items.slice(0, 5).map((feature, i) => (
                  <FeatureItem
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {feature}
                  </FeatureItem>
                ))}
                {items.length > 5 && (
                  <FeatureItem style={{ color: "#00D9FF", fontWeight: 700 }}>
                    ... and {items.length - 5} more
                  </FeatureItem>
                )}
              </FeaturesList>
            </CategoryCard>
          </motion.div>
        ))}
      </CategoryGrid>

      {selectedCategory && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: "rgba(42, 48, 80, 0.8)",
            border: "1px solid rgba(0, 217, 255, 0.3)",
            borderRadius: "12px",
            padding: "2rem",
            marginTop: "2rem",
          }}
        >
          <h2 style={{ color: "#00D9FF", margin: "0 0 1rem" }}>
            {selectedCategory}
          </h2>
          <FeaturesList>
            {features[selectedCategory].map((feature, i) => (
              <FeatureItem
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
              >
                {feature}
              </FeatureItem>
            ))}
          </FeaturesList>
        </motion.div>
      )}
    </Container>
  );
}
