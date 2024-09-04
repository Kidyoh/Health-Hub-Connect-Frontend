import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableOne from "@/components/Tables/TableOne";
import AppointmentTable from "@/components/Tables/Appointment";
import TableTwo from "@/components/Tables/TableTwo";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Appointment Table and Full information",
  description:
    "This is the appointment page where users can find full information about their appointments and so",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Appointment" />

      <div className="flex flex-col gap-10">
        <AppointmentTable />
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
