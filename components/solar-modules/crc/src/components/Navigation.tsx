import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiMenu, FiX } from 'react-icons/fi';

// ============================================
// STYLED COMPONENTS
// ============================================

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(90deg, var(--primary) 0%, var(--primary-dark) 100%);
  box-shadow: var(--shadow-lg);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const Brand = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--dark);
  text-decoration: none;

  &:hover {
    text-decoration: none;
  }
`;

const NavLinks = styled.div<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    flex-direction: column;
    background: rgba(0, 26, 77, 0.95);
    gap: 0;
    max-height: ${props => (props.isOpen ? '300px' : '0')};
    overflow: hidden;
    transition: max-height 0.3s ease;
  }
`;

const NavLink = styled(Link)`
  color: var(--dark);
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 0.5rem 0;

  &:hover {
    color: rgba(0, 26, 77, 0.7);
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    color: white;
    display: block;
    padding: 1rem 2rem;
    width: 100%;

    &:hover {
      background: rgba(255, 184, 0, 0.1);
      color: var(--primary);
      text-decoration: none;
    }
  }
`;

const MenuToggle = styled.button`
  display: none;
  background: none;
  border: none;
  color: var(--dark);
  cursor: pointer;
  font-size: 1.5rem;

  @media (max-width: 768px) {
    display: flex;
  }
`;

// ============================================
// NAVIGATION COMPONENT
// ============================================

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <Nav>
      <Brand to="/">
        🚀 SolarGeniusPro
      </Brand>

      <NavLinks isOpen={isOpen}>
        <NavLink to="/" onClick={closeMenu}>
          Home
        </NavLink>
        <NavLink to="/dashboard" onClick={closeMenu}>
          Dashboard
        </NavLink>
        <NavLink to="/calculator" onClick={closeMenu}>
          Calculator
        </NavLink>
        <NavLink to="/calculator-3d" onClick={closeMenu}>
          3D Calculator
        </NavLink>
        <NavLink to="/designer" onClick={closeMenu}>
          Designer
        </NavLink>
        <NavLink to="/design-studio" onClick={closeMenu}>
          Design Studio
        </NavLink>
        <NavLink to="/analytics" onClick={closeMenu}>
          Analytics
        </NavLink>
        <NavLink to="/executive" onClick={closeMenu}>
          Executive
        </NavLink>
        <NavLink to="/settings" onClick={closeMenu}>
          Settings
        </NavLink>
      </NavLinks>

      <MenuToggle onClick={toggleMenu}>
        {isOpen ? <FiX /> : <FiMenu />}
      </MenuToggle>
    </Nav>
  );
};

export default Navigation;
