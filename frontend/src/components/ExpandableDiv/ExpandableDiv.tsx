import React, { useEffect, useRef, useState } from "react";

type ExpandableDivProps = {
  candidate: React.ReactNode;
  candidateDetial: React.ReactNode;
  cb: VoidFunction;
};

export default function ExpandableDiv(props: ExpandableDivProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState<number | undefined>(
    open ? undefined : 0
  );

  const handleFilterOpening = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setOpen(!open);
  };

  useEffect(() => {
    if (!height || !open || !ref.current) {
      return;
    }

    const observer = new ResizeObserver((card) => {
      setHeight(card[0].contentRect.height);
    });

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [height, open]);

  useEffect(() => {
    if (open && ref.current) {
      setHeight(ref.current.getBoundingClientRect().height);
    } else {
      setHeight(0);
    }
  }, [open]);

  const onChangeHandler = (e: React.FormEvent<HTMLInputElement>) => {
    e.stopPropagation();
    props.cb();
  };

  return (
    <div>
      <div className="flex items-center gap-x-[20px] pl-[25px]">
        <div className="form-control">
          <input
            type="checkbox"
            className="checkbox checkbox-primary"
            onChange={(e) => onChangeHandler(e)}
          />
        </div>
        <div className="w-full" onClick={(e) => handleFilterOpening(e)}>{props.candidate}</div>
      </div>
      <div
        className={
          "transition-height duration-200 ease-in-out " +
          (!open ? "hidden" : "")
        }
        style={{ height }}
      >
        <div ref={ref}>{props.candidateDetial}</div>
      </div>
    </div>
  );
}
