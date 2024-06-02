import React, { useEffect, useState } from 'react';
import Homepage from '@/components/Dashboard/dashboard';
import DefaultLayout from '@/components/Layouts/DefaultLayout';


export default async function Dashboard() {


  return (
    <DefaultLayout>
      <Homepage />
    </DefaultLayout>
  );
};
