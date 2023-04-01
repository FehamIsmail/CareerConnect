import React, { useEffect, useRef, useState } from "react";

type ExpandableDivProps = {
    candidate: React.ReactNode,
    candidateDetial: React.ReactNode
}

export default function ExpandableDiv(props: ExpandableDivProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState<number | undefined>(
    open ? undefined : 0
  );

  const handleFilterOpening = () => {
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

  return (
    <div>
      <div>
        <div onClick={handleFilterOpening}>
          {props.candidate}
        </div>
      </div>
      <div className={"transition-height duration-200 ease-in-out " + (!open ? "hidden" : "")} style={{ height }}>
        <div ref={ref}>
          {props.candidateDetial}
        </div>
      </div>
    </div>
  );
};