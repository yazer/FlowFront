import clsx from "clsx";
import { ReactNode } from "react";

interface IconButtonProps {
    children: ReactNode;
    selected?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({
    children,
    selected = false,
}) => {
    return (
        <div
            className={clsx("flex items-center justify-center w-[38px] h-[38px] p-2 rounded-md cursor-pointer", {
                "bg-primary text-white p-[10px]": selected
            })}
        >
            {children}
        </div>
    )
}

export default IconButton;