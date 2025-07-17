// components/ViewDetailsModal.tsx

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
import { getPatientDetails } from "@/lib/actions/patient.actions";
import { Patient } from "@/types/appwrite.types";

interface ViewDetailsModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}

export const ViewDetailsModal = ({
  open,
  onClose,
  userId,
}: ViewDetailsModalProps) => {
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    if (open) {
      const fetchPatientDetails = async () => {
        try {
          const details = await getPatientDetails(userId);
          setPatient(details);
        } catch (error) {
          console.error("Failed to fetch patient details:", error);
        }
      };

      fetchPatientDetails();
    }
  }, [open, userId]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="shad-dialog sm:max-w-md">
        <DialogHeader className="mb-4 space-y-3">
          <DialogTitle>Patient Details</DialogTitle>
          <DialogDescription>Here are the details of the selected patient.</DialogDescription>
        </DialogHeader>

        {patient ? (
          <div className="space-y-2">
            <p><strong>Name:</strong> {patient.name}</p>
            <p><strong>Email:</strong> {patient.email}</p>
            <p><strong>Phone:</strong> {patient.phone}</p>
            <p><strong>Birth Date:</strong> {new Date(patient.birthDate).toLocaleDateString()}</p>
            <p><strong>Gender:</strong> {patient.gender}</p>
            <p><strong>Address:</strong> {patient.address}</p>
            <p><strong>Occupation:</strong> {patient.occupation}</p>
            <p><strong>Emergency Contact Name:</strong> {patient.emergencyContactName}</p>
            <p><strong>Emergency Contact Number:</strong> {patient.emergencyContactNumber}</p>
            <p><strong>Primary Physician:</strong> {patient.primaryPhysician}</p>
            <p><strong>Insurance Provider:</strong> {patient.insuranceProvider}</p>
            <p><strong>Insurance Policy Number:</strong> {patient.insurancePolicyNumber}</p>
            <p><strong>Allergies:</strong> {patient.allergies || "N/A"}</p>
            <p><strong>Current Medication:</strong> {patient.currentMedication || "N/A"}</p>
            <p><strong>Family Medical History:</strong> {patient.familyMedicalHistory || "N/A"}</p>
            <p><strong>Past Medical History:</strong> {patient.pastMedicalHistory || "N/A"}</p>
            <p><strong>Identification Type:</strong> {patient.identificationType || "N/A"}</p>
            <p><strong>Identification Number:</strong> {patient.identificationNumber || "N/A"}</p>
          </div>
        ) : (
          <p>Loading patient details...</p>
        )}

        <Button onClick={onClose}>Close</Button>
      </DialogContent>
    </Dialog>
  );
};
