import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

interface NavButtonProps {
  to: string;
  active?: boolean;
  children: React.ReactNode;
}

export const NavButton: React.FC<NavButtonProps> = ({ to, active, children }) => {
  return (
    <StyledWrapper $active={active}>
      <Link to={to} className="link-wrapper">
        <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
          <filter width="3000%" x="-1000%" height="3000%" y="-1000%" id="unopaq">
            <feColorMatrix
              values="1 0 0 0 0 
                      0 1 0 0 0 
                      0 0 1 0 0 
                      0 0 0 3 0"
            />
          </filter>
        </svg>
        <button className="button" type="button">
          <div className="a l" />
          <div className="a r" />
          <div className="a t" />
          <div className="a b" />
          <div className="text">{children}</div>
        </button>
      </Link>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div<{ $active?: boolean }>`
  display: inline-block;

  .link-wrapper {
    text-decoration: none;
    display: block;
    position: relative;
  }

  .button {
    position: relative;
    cursor: pointer;
    border: none;
    min-width: 90px;
    width: max-content;
    padding: 0 16px;
    height: 38px;
    background: ${(props) => (props.$active ? '#061626' : '#080d14')};
    color: ${(props) => (props.$active ? '#38bdf8' : '#e0f2fe')};
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.02em;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    transition: background 0.3s, color 0.3s;
  }

  .text {
    position: relative;
    z-index: 1;
    pointer-events: none;
  }

  .button::before {
    content: "";
    position: absolute;
    inset: 0;
    opacity: ${(props) => (props.$active ? 0.4 : 0)};
    background: radial-gradient(
        circle at 50% 50%,
        #0000 0,
        #0000 20%,
        #061626aa 50%
      ),
      radial-gradient(ellipse 100% 100%, #00d4ff, #00d4ff00);
    background-size:
      3px 3px,
      auto auto;
    transition: 0.3s;
  }

  .button:hover::before {
    opacity: 0.45;
  }

  .button:hover {
    color: #7dd3fc;
  }

  .a {
    pointer-events: none;
    position: absolute;
    --w: 2px;
    --t: -40px;
    --s: calc(var(--t) * -1);
    --e: calc(100% + var(--t));
    --g: rgba(0, 212, 255, 0), rgba(0, 212, 255, 0.25) var(--s),
      rgba(0, 212, 255, 0.85) var(--s), #00d4ff, rgba(0, 212, 255, 0.85) var(--e),
      rgba(0, 212, 255, 0.25) var(--e), rgba(0, 212, 255, 0);
  }

  .a::before {
    content: "";
    position: absolute;
    inset: 0;
    background: inherit;
    filter: blur(4px) url(#unopaq);
    z-index: -2;
  }

  .a::after {
    content: "";
    position: absolute;
    inset: 0;
    background: inherit;
    filter: blur(10px) url(#unopaq);
    opacity: ${(props) => (props.$active ? 1 : 0)};
    z-index: -2;
    transition: 0.3s;
  }

  .button:hover .a::after {
    opacity: 1;
  }

  .l {
    left: -2px;
  }

  .r {
    right: -2px;
  }

  .l,
  .r {
    background: linear-gradient(var(--g));
    top: var(--t);
    bottom: var(--t);
    width: var(--w);
  }

  .t {
    top: -2px;
  }

  .b {
    bottom: -2px;
  }

  .t,
  .b {
    background: linear-gradient(90deg, var(--g));
    left: var(--t);
    right: var(--t);
    height: var(--w);
  }

`;

export default NavButton;
