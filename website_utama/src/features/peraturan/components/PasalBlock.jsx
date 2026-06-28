import React from "react";

// chevron SVG extracted once, not repeated 11 times
const Chevron = () => (
  <span className="reg-chevron" aria-hidden="true">
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
);

const SubPasal = ({ sub }) => (
  <div className="sub-pasal">
    {sub.title && <div className="sub-pasal-title">{sub.title}</div>}
    <div className="sub-pasal-body">
      {sub.text && <p>{sub.text}</p>}
      {sub.list && (
        <ul style={sub.text ? { margin: "10px 0" } : undefined}>
          {sub.list.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      )}
      {sub.richList && (
        <ul>
          {sub.richList.map((item, i) => <li key={i}>{item.jsx}</li>)}
        </ul>
      )}
      {sub.sanksi && (
        <div className="sanksi-grid">
          {sub.sanksi.map((s, i) => (
            <div className="sanksi-item" key={i}>
              <span className={`sanksi-dot ${s.level}`} />
              {s.text}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

const PasalBlock = ({ pasal, isOpen, onToggle }) => (
  <div
    id={pasal.id}
    className={`reg-block fade-in visible ${isOpen ? "is-open" : ""}`}
    style={{ transitionDelay: "200ms" }}
  >
    <div
      className="reg-block-head"
      role="button"
      aria-expanded={isOpen ? "true" : "false"}
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
    >
      <div className="reg-block-head-left">
        <span className="reg-pasal-num">{pasal.num}</span>
        <div>
          <div className="reg-block-title">{pasal.title}</div>
          <div className="reg-block-sub">{pasal.subtitle}</div>
        </div>
      </div>
      <Chevron />
    </div>
    <div className="reg-block-body">
      <div className="reg-block-inner">
        {pasal.subPasals.map((sub, i) => (
          <SubPasal key={i} sub={sub} />
        ))}
      </div>
    </div>
  </div>
);

export default PasalBlock;
