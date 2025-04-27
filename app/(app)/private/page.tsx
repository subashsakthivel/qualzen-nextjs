import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import React from "react";

const Private = async () => {
  const session = await getServerSession(authOptions);
  return (
    <div>
      <h1> Hi {session?.user.name} </h1>
    </div>
  );
};

export default Private;
