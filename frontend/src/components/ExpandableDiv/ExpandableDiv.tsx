import React, { useEffect, useRef, useState } from "react";

type ExpandableDivProps = {
  candidate: React.ReactNode;
  candidateDetail: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  cb?: () => void;
};

export default function ExpandableDiv(props: ExpandableDivProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState<number | undefined>(
    open ? undefined : 0
  );
  const candidateDetailProps = React.Children.only(
      props.candidateDetail
  ).props;

  console.log(candidateDetailProps)

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
    if (props.cb) props.cb();
  };

  return (
    <div>
      <div className={props.cb ? "flex items-center gap-x-[20px] pl-[25px]" : "flex items-center gap-x-[20px]"}>
        {props.cb && <div className={`form-control`}>
          <input
            type="checkbox"
            className={`${(candidateDetailProps.applicant.status === 'REJECTED' || candidateDetailProps.applicant.status === 'OFFER')
                        && 'bg-gray-200 border-gray-800'} checkbox checkbox-primary`}
            onChange={(e) => onChangeHandler(e)}
            disabled={candidateDetailProps.applicant.status === 'REJECTED' || candidateDetailProps.applicant.status === 'OFFER'}
          />
        </div>}
        <div className="w-full" onClick={(e) => handleFilterOpening(e)}>{props.candidate}</div>
      </div>
      <div
        className={
          "transition-height duration-200 ease-in-out " +
          (!open ? "hidden" : "")
        }
        style={{ height }}
      >
        <div ref={ref}>{props.candidateDetail}</div>
      </div>
    </div>
  );
}
