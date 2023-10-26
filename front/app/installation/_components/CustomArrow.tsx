import { Zap } from "lucide-react";
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
  const arrowHead1Ref = useRef<SVGForeignObjectElement | null>(null);
  const arrowHeight = 10;

  useEffect(() => {
    const startElement = startRef.current;
    const endElement = endRef.current;
    const arrowElement = arrowRef.current;
    const arrowHead1Element = arrowHead1Ref.current;

    if (startElement && endElement && arrowElement && arrowHead1Element) {
      const startRect = startElement.getBoundingClientRect();
      const endRect = endElement.getBoundingClientRect();

      console.log(startRect.left + startRect.width / 2);
      // Calculez le centre de l'élément de départ en tenant compte des marges
      const startCenterX = startRect.left + startRect.width / 2;
      const startCenterY = startRect.top + startRect.height / 2 - 100;

      // Calculez le centre de l'élément d'arrivée en tenant compte des marges
      const endCenterX = endRect.left + endRect.width / 2 + window.scrollX;
      const endCenterY =
        endRect.top + endRect.height / 2 + window.scrollY - 100;

      const arrowLength = Math.sqrt(
        Math.pow(endCenterX - startCenterX, 2) +
          Math.pow(endCenterY - startCenterY, 2)
      );

      arrowElement.setAttribute("width", `${arrowLength + 20}`);
      arrowElement.setAttribute("height", `${arrowHeight}`);
      arrowElement.style.fill = "#009DE0";
      arrowElement.style.position = "absolute";
      arrowElement.style.left = `${startCenterX}px`;
      arrowElement.style.top = `${startCenterY}px`;
      arrowElement.style.transformOrigin = `${arrowHeight}px 0`;

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
          line.setAttribute("y1", `${arrowElement.height.baseVal.value}`);
          line.setAttribute("x2", `${arrowLength}`);
          line.setAttribute("y2", `${arrowElement.height.baseVal.value}`);
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
            animateLine.setAttribute("dur", "1");
            animateLine.setAttribute("repeatCount", "indefinite");
            line.appendChild(animateLine);
          }
        } else {
          pathElement.setAttribute(
            "d",
            `M0,${arrowElement.height.baseVal.value} L${arrowLength},${
              arrowElement.height.baseVal.value / 2
            } L${arrowLength},${arrowElement.height.baseVal.value / 2 + 2} L0,${
              arrowElement.height.baseVal.value / 2 + 2
            }`
          );
        }
      }

      if (animated && !dashed) {
        arrowHead1Element.setAttribute("x", "0");

        const animateElement1 = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "animate"
        );
        animateElement1.setAttribute("attributeName", "x");
        animateElement1.setAttribute("from", "0");
        animateElement1.setAttribute("to", `${arrowLength}`);
        animateElement1.setAttribute("dur", "4s");
        animateElement1.setAttribute("repeatCount", "indefinite");
        arrowHead1Element.appendChild(animateElement1);
      }
    }
  }, [startRef, endRef]);

  return (
    <svg ref={arrowRef} xmlns="http://www.w3.org/2000/svg" width="0" height="0">
      {dashed && (
        <foreignObject
          ref={arrowHead1Ref}
          width={arrowHeight * 2}
          height={arrowHeight * 2}
          x="0"
          y="-5"
        >
          {/*@ts-ignore*/}
          <div xmlns="http://www.w3.org/1999/xhtml">
            <Zap
              width={arrowHeight * 2}
              height={arrowHeight * 2}
              stroke="#009DE0"
            />
          </div>
        </foreignObject>
      )}
      {!dashed && (
        <foreignObject
          ref={arrowHead1Ref}
          width={arrowHeight * 2}
          height={arrowHeight * 2}
          x="0"
          y="-5"
        >
          {/*@ts-ignore*/}
          <div xmlns="http://www.w3.org/1999/xhtml">
            <Zap
              width={arrowHeight * 2}
              height={arrowHeight * 2}
              stroke="#009DE0"
            />
          </div>
        </foreignObject>
      )}
      <path d="M0,0 L0,0 L0,0 L0,0" fill="#009DE0" />
    </svg>
  );
};

export default CustomArrow;
