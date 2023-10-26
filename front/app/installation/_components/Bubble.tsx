import React, { useState } from "react";

interface BubbleProps {
  name: string;
  value: number | undefined;
  IRVEs?: Array<{
    name: string;
    value: number | undefined;
    icon: any;
  }>;
  icon: any;
}

const Bubble: React.ForwardRefRenderFunction<HTMLDivElement, BubbleProps> = (
  { name, value, IRVEs, icon },
  ref
) => {
  const [childrensDisplayed, setChildrensDisplayed] = useState(false);
  const showChildrens = () => {
    setChildrensDisplayed((prev) => !prev);
  };

  return (
    <div className="menu relative p-6  bg-primary items-center justify-center flex">
      <div
        onClick={showChildrens}
        ref={ref}
        className={`toggle flex-col shadow-md shadow-secondary text-primary transition-all duration-1000 bg-white flex items-center w-[75px] h-[75px] justify-center z-20 rounded-full cursor-pointer text-xl ${
          childrensDisplayed ? "rotate-[360deg]" : ""
        }`}
      >
        {icon}
        {name !== "IRVE" ? <span className="text-sm">{value} kW</span> : ""}
      </div>
      {name === "IRVE" ? (
        <>
          {IRVEs?.map((irve, i, arr) => {
            const rotate = (360 / arr.length) * i;
            const inverseRotate = (360 / -arr.length) * i;
            const rotateText = rotate + "deg";
            const inverseRotateText = inverseRotate + "deg";
            const transition = 300 * i;
            return (
              <li
                style={
                  childrensDisplayed
                    ? {
                        transform: `rotate(${rotateText})`,
                        transitionDelay: `${transition}ms`,
                      }
                    : {}
                }
                className={`absolute rotate-0 -ml-[65px] left-0 list-none origin-[125px] bg-white flex items-center justify-center w-[75px] h-[75px] rounded-full transition-all duration-1000 ${
                  childrensDisplayed ? `opacity-1 z-20` : "opacity-0 z-0"
                } ${irve.value !== 0 ? "animate-animateShadow" : ""} `}
                key={irve.name}
              >
                <span
                  className="flex flex-col  text-primary items-center justify-center text-center"
                  style={{
                    transform: `rotate(${inverseRotateText})`,
                  }}
                >
                  {irve.icon}
                  {irve.value} kW
                </span>
              </li>
            );
          })}
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default React.forwardRef(Bubble);
