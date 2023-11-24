import React, { useEffect, useRef, useState, RefObject } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CustomArrowProps {
  startRef: RefObject<HTMLDivElement>;
  endRef: RefObject<HTMLDivElement>;
  dashed?: boolean;
  animated?: boolean;
  dataHover?: any;
}

const CustomArrow: React.FC<CustomArrowProps> = ({
  startRef,
  endRef,
  dashed,
  animated,
  dataHover,
}) => {
  const arrowRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const arrowHeight = 1;
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const startElement = startRef.current;
    const endElement = endRef.current;
    const arrowElement = arrowRef.current;
    const tooltipElement = tooltipRef.current;

    if (startElement && endElement && arrowElement && tooltipElement) {
      const startRect = startElement.getBoundingClientRect();
      const endRect = endElement.getBoundingClientRect();

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
      arrowElement.style.zIndex = "0";
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
      if (dataHover) {
        tooltipElement.style.position = "absolute";
        tooltipElement.style.width = `${arrowLength}px`;
        tooltipElement.style.height = `${arrowHeight + 20}px`;
        tooltipElement.style.left = `${startCenterX + 10}px`;
        tooltipElement.style.top = `${startCenterY}px`;
        tooltipElement.style.transformOrigin = `${arrowHeight}px 0`;
        tooltipElement.style.transform = `rotate(${angle}rad)`;
        tooltipElement.style.backgroundColor = "transparent";
      }

      setSvgDimensions({
        width: arrowLength + 20,
        height: arrowHeight + 20,
      });
    }
  }, [startRef, endRef, dataHover]);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <svg
            ref={arrowRef}
            xmlns="http://www.w3.org/2000/svg"
            width={svgDimensions.width}
            height={svgDimensions.height}
          >
            <path d="M0,0 L0,0 L0,0 L0,0" fill="#009DE0" />
          </svg>
          <TooltipTrigger
            // @ts-ignore
            ref={tooltipRef}
            className="rounded-full"
          ></TooltipTrigger>
          <TooltipContent className="z-20 absolute top-1/2 left-1/2">
            <div className="flex w-full h-full min-w-[80px] min-h-[40px] text-center items-center justify-center">
              {dataHover} kW
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
};

export default CustomArrow;
