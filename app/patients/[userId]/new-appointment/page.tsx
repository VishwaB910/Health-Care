"use client";

import { useRouter, useParams } from "next/navigation";
import React, { useState } from "react";
import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { AppointmentModal } from "@/components/AppointmentModal";
import SubmitButton from "@/components/SubmitButton";
import { ViewDetailsModal } from "@/components/ViewDetailsModal";
import { Patient } from "@/types/appwrite.types";
import { getPatientDetails } from "@/lib/actions/patient.actions"; // Adjust the path based on your project structure


export default function NewAppointmentPage() {
  const router = useRouter();
  const params = useParams();
  const userId = Array.isArray(params.userId) ? params.userId[0] : params.userId;
  const [isHistoryModalOpen, setHistoryModalOpen] = useState(false);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [patientDetails, setPatientDetails] = useState<Patient | null>(null);

  const handleViewHistory = () => {
    if (userId) {
      setHistoryModalOpen(true); // Trigger the modal for history
    } else {
      console.error("User ID is not defined");
    }
  };

  const handleViewDetails = async () => {
    if (userId) {
      setIsLoading(true);  // Set loading to true when the fetch begins
      try {
        // Fetch the patient details from your backend (Appwrite or wherever)
        const details = await getPatientDetails(userId); // You need to have this function
  
        setPatientDetails(details); // Set the fetched details
        setDetailsModalOpen(true);  // Open the modal
      } catch (error) {
        console.error("Error fetching patient details:", error);
      } finally {
        setIsLoading(false); // Stop loading
      }
    } else {
      console.error("User ID is not defined");
    }
  };
  

  return (
    <div>
      <AppointmentForm userId={userId} patientId="your-patient-id" type="create" />

      <SubmitButton isLoading={isLoading} onClick={handleViewHistory}>
        View History
      </SubmitButton>

      <SubmitButton isLoading={isLoading} onClick={handleViewDetails}>
        View Details
      </SubmitButton>

      {isHistoryModalOpen && (
        <AppointmentModal
          open={isHistoryModalOpen}
          onClose={() => setHistoryModalOpen(false)}
          patientId="your-patient-id"
          userId={userId}
          title="Appointment History"
          description="Past appointments and details"
        />
      )}

{isDetailsModalOpen && patientDetails && (
  <ViewDetailsModal
    open={isDetailsModalOpen}
    onClose={() => setDetailsModalOpen(false)}
    userId={userId}
  />
)}

    </div>
  );
}
