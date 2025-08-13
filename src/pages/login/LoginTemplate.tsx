import React, { useEffect, useState } from "react";
import { FetchLoginDetails } from "../../apis/loginsignup";
import { Outlet } from "react-router";
import CheckLogin from "../../components/protectedRoute/checkloggin";

function LoginTemplate() {
  const [loginConfiguration, setConfiguration] = useState<any>({});

  const getLoginConfiguration = async () => {
    try {
      const res = await FetchLoginDetails();
      setConfiguration(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLoginConfiguration();
  }, []);
  return (
    <div>
      <div className="login relative w-full min-h-screen flex justify-center items-center">
        {loginConfiguration?.cover_img && (
          <img
            src={loginConfiguration?.cover_img}
            alt="Login background"
            className="absolute inset-0 w-full h-full object-cover -z-10 opacity-75"
          />
        )}
        <div className="z-10">
          <div className="login justify-center flex items-center">
            <div className="flex flex-col w-96 rounded-md h-fit p-11 text-center gap-2 bg-white">
              <img
                src={loginConfiguration?.logo}
                alt="Logo"
                className="mx-auto mb-4"
                style={{ width: 120, height: 60, objectFit: "contain" }}
              />
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckLogin(LoginTemplate);
