import classApi from "@/apis/class.api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { ClassContext } from "./ClassContext";

export function ClassProvider({ children }) {
  const { id: classId } = useParams();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["class", classId],
    queryFn: () => classApi.getById(classId),
    enabled: !!classId,
  });

  const class_ = data?.data?.kelas;

  const contextValue = {
    class: class_,
    isLoading,
    isError,
    error,
    fetchClass: refetch,
  };

  return <ClassContext value={contextValue}>{children}</ClassContext>;
}
