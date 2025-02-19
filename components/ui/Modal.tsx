"use client";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import cn from "@/utils/cn";
import React, { ReactNode, useState, type ComponentProps, createContext, Ref, RefObject } from "react";

const ModalVisualContext = createContext<[boolean, (isOpen: boolean) => void]>([false, () => { }]);

export function Modal({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return <ModalVisualContext value={[isOpen, setIsOpen]}>{children}</ModalVisualContext>;
}

export function ModalHeader({ ...props }: ComponentProps<"div">) {
  return <div {...props} className={cn("font-semibold text-lg", props.className)} />;
}

export function ModalBody({ ...props }: ComponentProps<"div">) {
  return <div {...props} className={cn("z-[1000]", props.className)} />;
}

export function ModalCloseButton({
  children,
  className,
  ref
}: {
  children: ReactNode;
  className?: string;
  ref: RefObject<HTMLButtonElement>
}) {
  const [, setIsOpen] = React.useContext(ModalVisualContext);

  const clickHandler = () => {
    setIsOpen(false);
  };
  return (
    <button ref={ref} onClick={clickHandler} className={cn("w-fit absolute top-4 right-4", className)}>
      {children}
    </button>
  );
}

export function ToggleButton({ ...props }: ComponentProps<"button">) {
  const [isOpen, setIsOpen] = React.useContext(ModalVisualContext);
  return (
    <button
      {...props}
      onClick={() => {
        setIsOpen(!isOpen);
      }}
    />
  );
}

export function ModalContent({ ...props }: ComponentProps<"div">) {
  const [isOpen, setIsOpen] = React.useContext(ModalVisualContext);
  const ref = useOnClickOutside(() => {
    setIsOpen(false);
  });

  return isOpen ? (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div
        {...props}
        ref={ref as Ref<HTMLDivElement | null>}
        className="z-[1000] bg-white dark:bg-black relative border-grayish border rounded-md max-w-[500px] w-full max-h-[250px] h-full p-4 text-center"
      />
    </div>
  ) : null;
}
