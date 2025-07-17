// components/table/columns.tsx

"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

import { Doctors } from "@/constants";
import { formatDateTime } from "@/lib/utils";
import { Appointment } from "@/types/appwrite.types";

import { AppointmentModal } from "../AppointmentModal";
import { StatusBadge } from "../StatusBadge";
import { Button } from "@/components/ui/button"; // Ensure the correct path to your Button component
import { scheduleAppointment, cancelAppointment } from "@/lib/actions/appointment.actions"; // Import the required actions

export const columns: ColumnDef<Appointment>[] = [
  {
    header: "#",
    cell: ({ row }) => {
      return <p className="text-14-medium">{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => {
      const appointment = row.original;
      const patientName = appointment.patient?.name || "Unknown Patient";
      return <p className="text-14-medium">{patientName}</p>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <div className="min-w-[115px]">
          <StatusBadge status={appointment.status} />
        </div>
      );
    },
  },
  {
    accessorKey: "schedule",
    header: "Appointment",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <p className="text-14-regular min-w-[100px]">
          {formatDateTime(appointment.schedule).dateTime}
        </p>
      );
    },
  },
  {
    accessorKey: "primaryPhysician",
    header: "Doctor",
    cell: ({ row }) => {
      const appointment = row.original;

      const doctor = Doctors.find(
        (doctor) => doctor.name === appointment.primaryPhysician
      );

      return (
        <div className="flex items-center gap-3">
          {doctor ? (
            <>
              <Image
                src={doctor.image}
                alt="doctor"
                width={100}
                height={100}
                className="size-8"
              />
              <p className="whitespace-nowrap">Dr. {doctor.name}</p>
            </>
          ) : (
            <p>Doctor not found</p>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row }) => {
      const appointment = row.original;
      const [isHistoryModalOpen, setHistoryModalOpen] = useState(false);
      const [isScheduleModalOpen, setScheduleModalOpen] = useState(false);
      const [isCancelModalOpen, setCancelModalOpen] = useState(false);

      const handleSchedule = async () => {
        try {
          // Function to schedule an appointment by fixing the timing
          await scheduleAppointment(appointment.$id);
          setScheduleModalOpen(false);
          // Optionally refresh data or update UI here
        } catch (error) {
          console.error("Error scheduling appointment:", error);
        }
      };

      const handleCancel = async () => {
        try {
          // Function to cancel the appointment
          await cancelAppointment(appointment.$id);
          setCancelModalOpen(false);
          // Optionally refresh data or update UI here
        } catch (error) {
          console.error("Error canceling appointment:", error);
        }
      };

      return (
        <div className="flex gap-2">
          {/* View History Button */}
          <Button onClick={() => setHistoryModalOpen(true)}>View History</Button>
          {/* Schedule Button */}
          <Button onClick={() => setScheduleModalOpen(true)}>Schedule</Button>
          {/* Cancel Button */}
          <Button onClick={() => setCancelModalOpen(true)}>Cancel</Button>

          {/* View History Modal */}
          <AppointmentModal
            patientId={appointment.patient?.$id}
            userId={appointment.userId}
            open={isHistoryModalOpen}
            onClose={() => setHistoryModalOpen(false)}
            title="Appointment History"
            description="View past appointments for this patient."
          />

          {/* Schedule Appointment Modal */}
          <AppointmentModal
            patientId={appointment.patient?.$id}
            userId={appointment.userId}
            open={isScheduleModalOpen}
            onClose={() => setScheduleModalOpen(false)}
            title="Schedule Appointment"
            description="Please confirm the details to schedule an appointment."
            onConfirm={handleSchedule}
          />

          {/* Cancel Appointment Modal */}
          <AppointmentModal
            patientId={appointment.patient?.$id}
            userId={appointment.userId}
            open={isCancelModalOpen}
            onClose={() => setCancelModalOpen(false)}
            title="Cancel Appointment"
            description="Are you sure you want to cancel the appointment?"
            onConfirm={handleCancel}
          />
        </div>
      );
    },
  },
];
