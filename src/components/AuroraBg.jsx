import React from "react";

// Decorative animated background: drifting color blobs + subtle grid.
export default function AuroraBg() {
  return (
    <div className="au-aurora" aria-hidden="true">
      <div className="au-aurora-blob au-aurora-blob-1" />
      <div className="au-aurora-blob au-aurora-blob-2" />
      <div className="au-aurora-blob au-aurora-blob-3" />
      <svg className="au-aurora-grid" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="au-grid-pattern" width="42" height="42" patternUnits="userSpaceOnUse">
            <path d="M 42 0 L 0 0 0 42" fill="none" stroke="rgba(11,18,32,0.06)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#au-grid-pattern)" />
      </svg>
    </div>
  );
}
