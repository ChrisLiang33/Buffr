import * as React from "react";

function MyComponent(props) {
  return (
    <>
      <div className="div">Add Account</div>
      <style jsx>{`
        .div {
          justify-content: center;
          align-items: center;
          border-radius: var(--Radius-Radius-Full, 999px);
          background-color: var(--button-base-bg-default, #020617);
          max-width: 361px;
          color: var(--button-base-text-static, #fff);
          white-space: nowrap;
          padding: 12px 60px;
          font: 500 16px/150% SF Pro Text, -apple-system, Roboto, Helvetica,
            sans-serif;
        }
      `}</style>
    </>
  );
}
export default MyComponent;
