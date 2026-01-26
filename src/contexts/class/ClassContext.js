import { createContext } from "react";
import classSchema from "@/schema/class";

export const ClassContext = createContext({
  class: classSchema,
  fetchClass: () => {},
});
