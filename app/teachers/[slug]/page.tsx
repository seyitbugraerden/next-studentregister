"use client";
import React, { useEffect, useState } from "react";
import AddNewTeacher from "../components/addNewTeacher";
import Link from "next/link";
import DeleteStage from "../components/deleteStage";
import { ring2 } from "ldrs";
import { usePathname } from "next/navigation";

const Page: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const path = usePathname();
  const pathId = path.split("/").pop();

  useEffect(() => {
    if (!pathId) return; // Ensure pathId is defined

    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_TECH_URL}/${pathId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
        setIsOpen(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    ring2.register();
  }, [pathId]); // Add pathId as a dependency

  const handleRemoveTeacher = async (idx: number) => {
    if (!data || !data.teachers) return;

    // Create a new array excluding the item at index idx
    const updatedList = data.teachers.filter(
      (_, index) => index !== idx
    );

    // Update the state
    setData((prevData: any) => ({
      ...prevData,
      teachers: updatedList,
    }));

    try {
      // Make the PATCH request to update the server
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_TECH_URL}/${pathId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            teachers: updatedList,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Update successful:', result);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  return (
    <div className="max-w-[50vw] mx-auto h-screen flex flex-col gap-4 justify-center items-center">
      {isOpen ? (
        <div
          className="absolute top-[50%] left-[50%] w-screen h-[95dvh] flex justify-center items-center bg-black/50"
          style={{ transform: "translate(-50%, -50%)" }}
        >
          <l-ring-2
            size="40"
            stroke="5"
            stroke-length="0.25"
            bg-opacity="0.1"
            speed="0.8"
            color="white"
          ></l-ring-2>
        </div>
      ) : (
        <div className="mx-auto max-w-lg text-center">
          <h2 className="text-3xl font-bold sm:text-4xl text-white">
            {data?.stage || 'Stage not found'}
          </h2>
          {data?.teachers && data.teachers.length > 0 ? (
            data.teachers.map((item: any, idx: number) => (
              <div
                key={idx}
                className="rounded-xl border border-gray-800 py-4 px-2 shadow-xl transition hover:border-cyan-500/50 hover:shadow-cyan-500/50 cursor-pointer relative flex flex-row items-center gap-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-10 text-cyan-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                  />
                </svg>
                <svg
                  onClick={() => handleRemoveTeacher(idx)}
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute right-2 top-2 z-[99] cursor-pointer"
                  aria-label="Remove teacher"
                >
                  <path
                    d="M19.07 4.93a1 1 0 011.414 0l.707.707a1 1 0 010 1.414l-8.072 8.072L11.03 14.51l-1.6-1.6 8.072-8.072a1 1 0 011.414 0l.707.707a1 1 0 010 1.414L11.03 13.515l-1.6-1.6 8.072-8.072z"
                    fill="white"
                    stroke="#00BCD4"
                    strokeWidth="2"
                  />
                </svg>
                <h2 className="text-sm font-bold text-white">
                  {item.name} {item.lastname}
                </h2>
              </div>
            ))
          ) : (
            <p className="my-5 text-white">Öğretmen bulunmamaktadır.</p>
          )}

          <Link href={`/teachers/${pathId}/add`}>
            <AddNewTeacher />
          </Link>
          <DeleteStage />
        </div>
      )}
    </div>
  );
};

export default Page;
