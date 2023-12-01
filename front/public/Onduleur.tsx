// @ts-nocheck

import * as React from "react";

function Onduleur(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" {...props}>
      <path
        style={{
          fill: "hsl(237 53% 29%)",
          textIndent: 0,
          textAlign: "start",
          lineHeight: "normal",
          textTransform: "none",
          blockProgression: "tb",
          InkscapeFontSpecification: "Bitstream Vera Sans",
        }}
        d="M5 2C3.355 2 2 3.355 2 5v40c0 .673.214 1.31.594 1.813a1 1 0 00.594.593C3.69 47.786 4.327 48 5 48h40c1.645 0 3-1.355 3-3V5c0-.751-.286-1.44-.75-1.969A1 1 0 0047.219 3c-.015-.017-.016-.046-.032-.063a1 1 0 00-.062-.062c-.026-.026-.066-.037-.094-.063a1 1 0 00-.156-.124A2.965 2.965 0 0045 2H5zm0 2h39.594L4 44.594V5c0-.555.445-1 1-1zm41 1.406V45c0 .555-.445 1-1 1H5.406L46 5.406zm-33.031 5.625c-.207-.004-.398.015-.594.031a5.141 5.141 0 00-1.438.313c-1.73.677-2.718 2-2.718 2l1.562 1.25s.762-.927 1.906-1.375c1.145-.448 2.554-.572 4.594 1.469 2.46 2.46 5.05 2.583 6.782 1.906 1.73-.677 2.718-2 2.718-2l-1.562-1.25s-.762.927-1.907 1.375c-1.144.448-2.553.572-4.593-1.469-1.614-1.614-3.305-2.217-4.75-2.25zM26 33v2h16v-2H26zm0 4v2h6v-2h-6zm10 0v2h6v-2h-6z"
        overflow="visible"
        fontFamily="Bitstream Vera Sans"
      />
    </svg>
  );
}

export default Onduleur;
