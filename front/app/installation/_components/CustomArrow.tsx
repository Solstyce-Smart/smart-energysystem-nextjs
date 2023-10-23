import React, { useEffect, useRef, RefObject } from "react";

interface CustomArrowProps {
  startRef: RefObject<HTMLDivElement>;
  endRef: RefObject<HTMLDivElement>;
  dashed?: boolean;
  animated?: boolean;
}

const CustomArrow: React.FC<CustomArrowProps> = ({
  startRef,
  endRef,
  dashed,
  animated,
}) => {
  const arrowRef = useRef<SVGSVGElement>(null);
  const arrowHead1Ref = useRef<SVGTextElement | null>(null);

  useEffect(() => {
    const startElement = startRef.current;
    const endElement = endRef.current;
    const arrowElement = arrowRef.current;
    const arrowHead1Element = arrowHead1Ref.current;

    if (startElement && endElement && arrowElement && arrowHead1Element) {
      const startRect = startElement.getBoundingClientRect();
      const endRect = endElement.getBoundingClientRect();

      const startStyle = getComputedStyle(startElement);
      const endStyle = getComputedStyle(endElement);

      const startMarginLeft = parseFloat(startStyle.marginLeft || "0");
      const startMarginTop = parseFloat(startStyle.marginTop || "0");

      const endMarginLeft = parseFloat(endStyle.marginLeft || "0");
      const endMarginTop = parseFloat(endStyle.marginTop || "0");

      // Calculez le centre de l'élément de départ en tenant compte des marges
      const startCenterX =
        startRect.left + startRect.width / 2 + startMarginLeft + 1;
      const startCenterY =
        startRect.top + startRect.height / 2 + startMarginTop - 100;

      // Calculez le centre de l'élément d'arrivée en tenant compte des marges
      const endCenterX = endRect.left + endRect.width / 2 + endMarginLeft + 7;
      const endCenterY = endRect.top + endRect.height / 2 + endMarginTop - 100;

      const arrowLength = Math.sqrt(
        Math.pow(endCenterX - startCenterX, 2) +
          Math.pow(endCenterY - startCenterY, 2)
      );

      arrowElement.setAttribute("width", `${arrowLength}` + 20);
      arrowElement.setAttribute("height", "20"); // Hauteur de la ligne
      arrowElement.style.fill = "#009DE0";
      arrowElement.style.position = "absolute";
      arrowElement.style.left = `${startCenterX + 10}px`;
      arrowElement.style.top = `${startCenterY}px`;
      arrowElement.style.transformOrigin = "0 0";

      const angle = Math.atan2(
        endCenterY - startCenterY,
        endCenterX - startCenterX
      );

      arrowElement.style.transform = `rotate(${angle}rad)`;

      const pathElement = arrowElement.querySelector("path");
      if (pathElement) {
        if (dashed) {
          const line = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
          );
          line.setAttribute("x1", "0");
          line.setAttribute("y1", `${arrowElement.height.baseVal.value / 2}`);
          line.setAttribute("x2", `${arrowLength}`);
          line.setAttribute("y2", `${arrowElement.height.baseVal.value / 2}`);
          line.setAttribute("stroke", "grey");
          line.setAttribute("stroke-width", "2");
          line.setAttribute("stroke-dasharray", "7,7");
          pathElement.replaceWith(line);
          const animateLine = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "animate"
          );
          if (animated) {
            animateLine.setAttribute("attributeName", "stroke-dashoffset");
            line.setAttribute("stroke", "#009DE0");
            animateLine.setAttribute("from", "14");
            animateLine.setAttribute("to", "-15"); // Réduisez-la pour faire avancer le trait pointillé
            animateLine.setAttribute("dur", ".5");
            animateLine.setAttribute("repeatCount", "indefinite");
            line.appendChild(animateLine);
          }
        } else {
          pathElement.setAttribute(
            "d",
            `M0,${arrowElement.height.baseVal.value / 2} L${arrowLength},${
              arrowElement.height.baseVal.value / 2
            } L${arrowLength},${arrowElement.height.baseVal.value / 2 + 2} L0,${
              arrowElement.height.baseVal.value / 2 + 2
            }`
          );
        }
      }

      if (animated) {
        arrowHead1Element.setAttribute("x", "0");

        const animateElement1 = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "animate"
        );
        animateElement1.setAttribute("attributeName", "x");
        animateElement1.setAttribute("from", "0");
        animateElement1.setAttribute("to", `${arrowLength - 8}`);
        animateElement1.setAttribute("dur", "2s");
        animateElement1.setAttribute("repeatCount", "indefinite");
        arrowHead1Element.appendChild(animateElement1);
      }
    }
  }, [startRef, endRef]);

  return (
    <svg ref={arrowRef} xmlns="http://www.w3.org/2000/svg" width="0" height="0">
      <text
        ref={arrowHead1Ref}
        y="19"
        fontSize="30"
        fontWeight="bold"
        fill="#009DE0"
        style={{ textShadow: "0 0 10px #009DE0" }}
      >
        →
      </text>
      <path d="M0,0 L0,0 L0,0 L0,0" fill="#009DE0" />
    </svg>
  );
};

export default CustomArrow;
