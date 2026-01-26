import classApi from "@/api/class.api";
import dummyClassMeets from "@/dummy/class_meets.json";
import dummyClassMembers from "@/dummy/class_members.json";
import dummyClasses from "@/dummy/classes.json";
import classSchema from "@/schema/class";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { ClassContext } from "./ClassContext";

export function ClassProvider({ children }) {
  const { id: classId } = useParams();
  const [class_, setClass] = useState(classSchema);
  const [error, setError] = useState(null);

  const fetchClass = async () => {
    try {
      const response = await classApi.getById(classId);
      setClass(response.data.kelas);
    } catch (err) {
      if (import.meta.env.VITE_ENV == "development") console.error(err);

      if (err instanceof AxiosError) {
        if (err.status == 404) setError("Kelas tidak ditemukan");
        if (err.status) setError(err.response.data?.message);
        else setError("Terjadi kesalahaan pada server. Mohon coba lagi nanti.");
      }
    }
  };

  useEffect(() => {
    fetchClass();
  }, [classId]);

  const contextValue = {
    class: class_,
    fetchClass,
  };

  return <ClassContext value={contextValue}>{children}</ClassContext>;
}
