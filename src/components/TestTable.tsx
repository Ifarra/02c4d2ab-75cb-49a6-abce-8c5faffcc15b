"use client";
import { useEffect, useState } from "react";

interface User {
  id?: string;
  tempId?: string;
  first_name: string;
  last_name: string;
  position: string;
  phone: string;
  email: string;
}

interface ChangedFields {
  first_name: boolean;
  last_name: boolean;
  position: boolean;
  phone: boolean;
  email: boolean;
}

const Table = ({ data }: { data: User[] }) => {
  const [loading, setLoading] = useState(true);
  const [itemData, setItemData] = useState<User[]>(data);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof User;
    direction: "ascending" | "descending";
  }>({
    key: "first_name",
    direction: "ascending",
  });
  const [isSortingDisabled, setIsSortingDisabled] = useState(false);

  const [changedFields, setChangedFields] = useState<ChangedFields[]>(
    data.map(() => ({
      first_name: false,
      last_name: false,
      position: false,
      phone: false,
      email: false,
    }))
  );

  const handleChange = (index: number, column: keyof User, value: string) => {
    const updatedItems = [...itemData];
    updatedItems[index] = { ...updatedItems[index], [column]: value };
    setItemData(updatedItems);

    const updatedChangedFields = changedFields.map((item, i) =>
      i === index ? { ...item, [column]: true } : item
    );
    setChangedFields(updatedChangedFields);
    setIsSortingDisabled(true);
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  const requestSort = (key: keyof User) => {
    if (isSortingDisabled) return;

    const direction =
      sortConfig.key === key && sortConfig.direction === "ascending"
        ? "descending"
        : "ascending";

    setSortConfig({ key, direction });

    const sortedItems = [...itemData].sort((a, b) => {
      // @ts-expect-error: Object is possibly 'undefined'.
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      // @ts-expect-error: Object is possibly 'undefined'.
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });
    setItemData(sortedItems);
  };

  const submitAll = async () => {
    setLoading(true);
    const invalidEmails = itemData.filter((item) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return !re.test(item.email?.toLowerCase() || ""); // Use optional chaining and fallback
    });

    const duplicateEmails = itemData.filter(
      (item, index, self) =>
        self.findIndex((other) => other.email === item.email) !== index
    );

    if (invalidEmails.length > 0) {
      alert(
        `Invalid email format for: ${invalidEmails
          .map((item) => item.first_name)
          .join(", ")}`
      );
      setLoading(false);
      return;
    }

    if (duplicateEmails.length > 0) {
      alert(
        `Duplicate emails for: ${duplicateEmails
          .map((item) => item.first_name)
          .join(", ")}`
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/userUpdateAll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) throw new Error("Failed to update all items");

      setChangedFields(
        data.map(() => ({
          first_name: false,
          last_name: false,
          position: false,
          phone: false,
          email: false,
        }))
      );

      const result = await response.json();
      alert(result.message);
      setLoading(false);
      setIsSortingDisabled(false);
    } catch (error) {
      console.error("Error updating documents:", error);
      setLoading(false);
    }
  };

  const addNewRow = () => {
    const tempId = Date.now().toString();
    setItemData([
      {
        id: "",
        tempId,
        first_name: "",
        last_name: "",
        position: "",
        phone: "",
        email: "",
      },
      ...itemData,
    ]);
  };

  return (
    <div className="py-8 w-full">
      <div className="flex gap-2 px-4">
        <button
          className="btn btn-main btn-outline btn-primary"
          onClick={submitAll}
        >
          Save All
        </button>
        <button
          className="btn btn-main btn-outline btn-primary"
          onClick={addNewRow}
        >
          Add New Row
        </button>
      </div>
      <table className="table table-md w-full">
        <thead>
          <tr>
            {["first_name", "last_name", "position", "phone", "email"].map(
              (key) => (
                <th
                  key={key}
                  onClick={() => requestSort(key as keyof User)}
                  style={{
                    cursor: isSortingDisabled ? "not-allowed" : "pointer",
                  }}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}{" "}
                  {sortConfig.key === key
                    ? sortConfig.direction === "ascending"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {itemData.map((item, index) => (
            <tr key={item.id || item.tempId} className="hover">
              {["first_name", "last_name", "position", "phone", "email"].map(
                (key) => (
                  <td key={key}>
                    <input
                      type={key === "email" ? "email" : "text"}
                      value={item[key as keyof User]}
                      className="border-none outline-none bg-transparent w-full"
                      onChange={(e) =>
                        handleChange(index, key as keyof User, e.target.value)
                      }
                      style={{
                        color: changedFields[index]?.[
                          key as keyof ChangedFields
                        ]
                          ? "red"
                          : "white",
                      }}
                    />
                  </td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {isSortingDisabled && (
        <div className="alert">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          You cannot sort the table while editing. Please save your changes to
          enable sorting.
        </div>
      )}

      <div className="flex justify-center fixed bottom-7 left-0 right-0">
        {loading && <span className="loading loading-infinity loading-lg" />}
      </div>
    </div>
  );
};

export default Table;
