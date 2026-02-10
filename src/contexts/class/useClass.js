import { useContext } from "react";
import { ClassContext } from "./ClassContext";

export const useClass = () => useContext(ClassContext);
