import { pb } from "@/lib/pb";

export const fetchClasses = async () => {
  return await pb.collection("classes").getFullList();
};

export const fetchTeachers = async () => {
  return await pb.collection("teachers").getFullList();
};

export const fetchTeacherItem = async (el: any) => {
  return await pb.collection("teachers").getOne(el);
};

export const fetchDates = async () => {
  return await pb.collection("calendar").getFullList();
};
