import { useState } from "react";

type Status = "New" | "In Progress" | "Repaired" | "Scrap";

interface Request {
  id: number;
  subject: string;
  equipment: string;
  team: string;
  technician: string;
  dueDate: string;
  status: Status;
}

const initialRequests: Request[] = [
  {
    id: 1,
    subject: "Leaking Oil",
    equipment: "CNC Machine A1",
    team: "Mechanics",
    technician: "Rahul",
    dueDate: "2025-01-10",
    status: "New",
  },
  {
    id: 2,
    subject: "Printer Not Working",
    equipment: "Printer 01",
    team: "IT Support",
    technician: "Anita",
    dueDate: "2025-01-05",
    status: "In Progress",
  },
  {
    id: 3,
    subject: "Routine Checkup",
    equipment: "Generator X",
    team: "Electricians",
    technician: "Suresh",
    dueDate: "2024-12-20",
    status: "Repaired",
  },
];

const columns: Status[] = ["New", "In Progress", "Repaired", "Scrap"];

export default function App() {
  const [requests] = useState<Request[]>(initialRequests);

  const isOverdue = (date: string) => {
    return new Date(date) < new Date();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        GearGuard – Maintenance Board
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {columns.map((status) => (
          <div key={status} className="bg-gray-200 rounded-lg p-3">
            <h2 className="font-semibold text-gray-700 mb-3">{status}</h2>

            <div className="space-y-3">
              {requests
                .filter((req) => req.status === status)
                .map((req) => (
                  <div
                    key={req.id}
                    className={`bg-white rounded-md p-3 border-l-4 ${
                      isOverdue(req.dueDate)
                        ? "border-red-500"
                        : "border-green-500"
                    }`}
                  >
                    <h3 className="font-semibold text-gray-800">
                      {req.subject}
                    </h3>

                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Equipment:</span>{" "}
                      {req.equipment}
                    </p>

                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Team:</span> {req.team}
                    </p>

                    <div className="flex justify-between items-center mt-3">
                      <span className="text-xs text-gray-500">
                        Due: {req.dueDate}
                      </span>

                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm">
                          {req.technician[0]}
                        </div>
                        <span className="text-sm">
                          {req.technician}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
