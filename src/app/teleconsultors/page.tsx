import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TeleconsultorsList from "@/components/teleconsultors/teleConsultors";

export const metadata: Metadata = {
  title: "Teleconsultors Table and Full information",
  description:
    "This is the appointment page where users can find full information about their appointments and so",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="TeleConsultors" />

      <div className="flex flex-col gap-10">
        <TeleconsultorsList />
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
