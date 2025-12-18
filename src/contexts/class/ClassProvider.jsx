import dummyClassMeets from "@/dummy/class_meets.json";
import dummyClassMembers from "@/dummy/class_members.json";
import dummyClasses from "@/dummy/classes.json";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { ClassContext } from "./ClassContext";
import classSchema from "@/schema/class";

export function ClassProvider({ children }) {
  const test = useParams();
  const classId = "1";
  const [class_, setClass] = useState(classSchema);

  useEffect(() => {
    console.log(test);
    // TODO: fetch classes data here
    setClass({
      id_kelas: classId,
      ...dummyClasses[classId],
      ...dummyClassMembers,
      // @ts-ignore
      pertemuan: dummyClassMeets
    });
  }, [setClass, classId]);

  return <ClassContext value={class_}>{children}</ClassContext>;
}
