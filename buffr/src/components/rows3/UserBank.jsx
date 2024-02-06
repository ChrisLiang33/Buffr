import * as React from "react";

function MyComponent(props) {
  return (
    <>
      <div className="div">
        <div className="div-2">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/247bd62102ec3870b110d6548e3d82bbe83d401cbda68751c163dab72f7bd240?"
            className="img"
          />
          <div className="div-3">
            <div className="div-4">Nedbank</div>
            <div className="div-5">
              <div className="div-6">Savings Account</div>
              <div className="div-7">••823</div>
            </div>
          </div>
        </div>
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/ffbfe0ffafd8cb4673fe7f2d1de3505bdffbbe9d22d62533afa350328358ee78?"
          className="img-2"
        />
      </div>
      <style jsx>{`
        .div {
          align-self: stretch;
          border-radius: var(--Radius-Radius-Full, 999px);
          background-color: var(--surface-gray-0, #f8fafc);
          display: flex;
          gap: 20px;
          white-space: nowrap;
          padding: 8px 16px;
        }
        .div-2 {
          display: flex;
          justify-content: space-between;
          gap: 12px;
        }
        .img {
          aspect-ratio: 1;
          object-fit: auto;
          object-position: center;
          width: 48px;
        }
        .div-3 {
          justify-content: center;
          display: flex;
          flex-grow: 1;
          flex-basis: 0%;
          flex-direction: column;
          margin: auto 0;
        }
        .div-4 {
          color: var(--text-gray-80, #1e293b);
          font: 500 16px/150% SF Pro Text, -apple-system, Roboto, Helvetica,
            sans-serif;
        }
        .div-5 {
          display: flex;
          justify-content: space-between;
          gap: 8px;
          font-size: 14px;
          color: var(--text-gray-60, #475569);
          font-weight: 400;
          line-height: 143%;
        }
        .div-6 {
          font-family: SF Pro Text, sans-serif;
          flex-grow: 1;
        }
        .div-7 {
          font-family: SF Pro Text, sans-serif;
          flex-grow: 1;
          flex-basis: auto;
        }
        .img-2 {
          aspect-ratio: 1;
          object-fit: auto;
          object-position: center;
          width: 18px;
          margin: auto 0;
        }
      `}</style>
    </>
  );
}

export default MyComponent;
