import { Link } from "react-router-dom";
export function Signup() {
  return (
    <div className="justify-center flex items-center h-screen">
      <div className="flex flex-col w-fit border-gray-500 border rounded-md h-fit p-11 text-center ">
        <h2 className="font-bold mb-6 text-3xl">Sign up</h2>
        <div className="grid grid-cols-2 gap-5">
          <input
            type="text"
            name="adminName"
            placeholder="Admin Name"
            className="border border-gray-400 rounded-md px-2 py-2 my-2"
          />
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            className="border border-gray-400 rounded-md px-2 py-2 my-2"
          />
          <input
            type="text"
            name="email"
            placeholder="Email"
            className="border border-gray-400 rounded-md px-2 py-2 my-2"
          />
          <input
            type="text"
            name="contactNumber"
            placeholder="Contact Number"
            className="border border-gray-400 rounded-md px-2 py-2 my-2"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border border-gray-400 rounded-md px-2 py-2 my-2"
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            className="border border-gray-400 rounded-md px-2 py-2 my-2"
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            className="border border-gray-400 rounded-md px-2 py-2 my-2"
          />
        </div>

        <div className="flex justify-center pt-5">
          <Link to={"/"}>
            <button className=" bg-blue-700 text-white px-12 rounded-md py-2 ">
              Signup
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
