import React from 'react';
import styled from 'styled-components';

// ============================================
// STYLED COMPONENTS
// ============================================

const FooterContainer = styled.footer`
  background: var(--dark);
  color: white;
  padding: 3rem 0;
  margin-top: 5rem;
  border-top: 2px solid var(--primary);
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FooterSection = styled.div`
  h4 {
    color: var(--primary);
    margin-bottom: 1rem;
  }

  ul {
    list-style: none;

    li {
      margin-bottom: 0.5rem;

      a {
        color: rgba(255, 255, 255, 0.7);
        text-decoration: none;
        transition: var(--transition);

        &:hover {
          color: var(--primary);
        }
      }
    }
  }

  p {
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.8;
  }
`;

const FooterBottom = styled.div`
  text-align: center;
  padding-top: 2rem;
  margin-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.6);
`;

// ============================================
// FOOTER COMPONENT
// ============================================

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h4>🚀 SolarGeniusPro</h4>
          <p>
            World's most advanced solar intelligence platform powered by 28 AI engines
            and cutting-edge technology.
          </p>
        </FooterSection>

        <FooterSection>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/calculator">Calculator</a></li>
            <li><a href="/designer">Designer</a></li>
          </ul>
        </FooterSection>

        <FooterSection>
          <h4>Features</h4>
          <ul>
            <li><a href="#features">28 AI Engines</a></li>
            <li><a href="#features">Real-time Analytics</a></li>
            <li><a href="#features">Smart Design</a></li>
            <li><a href="#features">Financial Modeling</a></li>
          </ul>
        </FooterSection>

        <FooterSection>
          <h4>Support</h4>
          <ul>
            <li><a href="#">Documentation</a></li>
            <li><a href="#">API Reference</a></li>
            <li><a href="#">Contact Support</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </FooterSection>
      </FooterContent>

      <FooterBottom>
        <p>&copy; {currentYear} SolarGeniusPro. All rights reserved. | Made with ⚡ for solar engineers</p>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer;
