import { ReactNode } from "react";
import "../styles/container.css";

type Props = {
    children: ReactNode;
}

export const ContainerS = ({ children }: Props) => {
    return (
        <div className="container">
            {children}
        </div>
    );
}
