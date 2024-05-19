import { useUser } from "@/context/user-context";
import { startRegistration } from "@simplewebauthn/browser";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#__next");
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    height: "30vh",
    width: "30vw",
    display: "flex",
    alignItem: "center",
    justifyContent: "center",
  },
};

/* eslint-disable @next/next/no-img-element */
const RegisterPage = () => {
  const { setuser } = useUser();
  const [user, setUser] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [modalIsOpen, setIsOpen] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:5500/user/register", {
        email: user.email,
        password: user.password,
      });

      console.log("data 111 register >> ", data);

      setuser(data);
      setIsOpen(true);
    } catch (error) {
      console.log("register error", error);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <AskPassKeyModal
        modalIsOpen={modalIsOpen}
        closeModal={() => setIsOpen(false)}
      />
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          Register
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create an account
            </h1>
            <form
              onSubmit={handleRegister}
              className="space-y-4 md:space-y-6"
              action="#"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Confirm password
                </label>
                <input
                  type="confirmPassword"
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    aria-describedby="terms"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="terms"
                    className="font-light text-gray-500 dark:text-gray-300"
                  >
                    I accept the{" "}
                    <a
                      className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                      href="#"
                    >
                      Terms and Conditions
                    </a>
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Create an account
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;

const AskPassKeyModal = ({
  modalIsOpen,
  closeModal,
}: {
  modalIsOpen: boolean;
  closeModal: () => void;
}) => {
  const { user } = useUser();
  const router = useRouter();

  const handleRegisterPasskey = async () => {
    try {
      console.log("options >> ", (user as any).options);
      const options = (user as any).options;
      const authenticationResult = await startRegistration({
        ...options,
      });
      console.log("authenticationResult >> ", authenticationResult);

      const { data } = await axios.post(
        "http://localhost:5500/user/register-verify",
        {
          userId: (user as any).user.id,
          credential: authenticationResult,
        }
      );
      if (data.verified) {
        router.push("/login");
      }
    } catch (error) {}
  };

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <button
          type="submit"
          onClick={handleRegisterPasskey}
          className="w-[60%] h-[40px] my-auto text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Register Passkey
        </button>
        <button
          className="absolute top-0 right-0 p-2 m-2 text-lg font-bold cursor-pointer"
          onClick={closeModal}
        >
          X
        </button>
      </Modal>
    </div>
  );
};
