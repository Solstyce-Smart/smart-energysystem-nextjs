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
    <div className="menu relative w-[300px] h-[300px] bg-primary items-center justify-center flex">
      <div
        onClick={showChildrens}
        ref={ref}
        className={`toggle flex-col shadow-md shadow-secondary text-primary transition-all duration-1000 absolute w-[100px] h-[100px] bg-white flex items-center justify-center z-20 rounded-full cursor-pointer text-xl ${
          childrensDisplayed ? "rotate-[360deg]" : ""
        }`}
      >
        {icon}
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
                className={`absolute shadow-md shadow-secondary rotate-0  left-0 list-none origin-[150px] bg-white flex items-center justify-center w-[75px] h-[75px] rounded-full transition-all duration-1000 ${
                  childrensDisplayed ? `opacity-1 z-20` : "opacity-0 z-0"
                } `}
                key={irve.name}
              >
                <span
                  className=" flex flex-col  text-primary items-center justify-center text-center"
                  style={{
                    transform: `rotate(${inverseRotateText})`,
                  }}
                >
                  {irve.icon}
                  {irve.value}
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
