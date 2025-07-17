// components/AppointmentModal.tsx

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Appointment } from "@/types/appwrite.types";
import { getPatientAppointments } from "@/lib/actions/appointment.actions";

interface AppointmentModalProps {
  patientId: string;
  userId: string;
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  onConfirm?: () => void; // Optional confirm action for scheduling or canceling
}

export const AppointmentModal = ({
  patientId,
  userId,
  open,
  onClose,
  title,
  description,
  onConfirm,
}: AppointmentModalProps) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    if (open && !onConfirm) { // Fetch history only if not for scheduling/canceling
      getPatientAppointments(userId)
        .then((data) => {
          if (data && !data.error) {
            setAppointments(data);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch appointment history:", error);
        });
    }
  }, [open, userId, onConfirm]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="shad-dialog sm:max-w-md">
        <DialogHeader className="mb-4 space-y-3">
          <DialogTitle className="capitalize">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {appointments.length > 0 && !onConfirm ? (
          appointments.map((appointment) => (
            <div key={appointment.$id} className="mb-2 p-2 border-b">
              <p>
                    <strong>Doctor:</strong> {appointment.primaryPhysician}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(appointment.$createdAt).toLocaleDateString()}
              </p>
              <p>
                    <strong>Reason:</strong> {appointment.reason}
                  </p>
              <p>
                <strong>Status:</strong> {appointment.status || "N/A"}
              </p>
            </div>
          ))
        ) : (
          <p>No past appointments found.</p>
        )}

        {onConfirm && (
          <Button onClick={onConfirm}>Confirm</Button> // Show confirm button only if onConfirm is provided
        )}
      </DialogContent>
    </Dialog>
  );
};
