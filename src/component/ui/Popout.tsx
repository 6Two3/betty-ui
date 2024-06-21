import { Button } from "@headlessui/react";
import clsx from "clsx";
import { FC, useEffect, useRef, useState } from "react";

export const Popout: FC<{
  children?: React.ReactNode;
  className?: string;
  buttonClassName?: string;
}> = ({ children, className, buttonClassName }) => {
  const [open, setOpen] = useState(false);
  const node = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      /* const ref = drop.current;
      if (ref) {
        const box = ref.getBoundingClientRect();
        if (
          box.bottom >
          (window.innerHeight ||
            document.documentElement.clientHeight)
        ) {
          setTop(true);
        }
      } */
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleClickOutside = (e: any) => {
    const ref = node.current;
    if (ref) {
      if (ref.contains(e.target)) {
        return;
      }
    }
    e.stopPropagation();
    e.stopImmediatePropagation();
    setOpen(false);
    return false;
  };

  return (
    <div
      ref={node}
      className={clsx({
        popout: true,
        "popout--open": open,
        [`${className}`]: className,
      })}
    >
      <Button
        onClick={() => setOpen(true)}
        className={clsx({
          "md-button--grey md-button--small": !buttonClassName,
          [`${buttonClassName}`]: buttonClassName,
        })}
      >
        {!open ? "Open" : "Close"}
      </Button>
      {children}
    </div>
  );
};
