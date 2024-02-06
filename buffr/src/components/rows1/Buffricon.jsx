import * as React from "react";

function MyComponent(props) {
  return (
    <img
      loading="lazy"
      srcSet="..."
      className="w-full shadow-md aspect-square max-w-[104px]"
      src="img/icon.svg"
    />
  );
}

export default MyComponent;
