import { createContext } from "react";
import classSchema from "@/schemas/class";

export const ClassContext = createContext({
  class: classSchema,
  isLoading: false,
  fetchClass: () => {},
});
