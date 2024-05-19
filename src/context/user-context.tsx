"use client";
import { useRouter } from "next/navigation";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface InterfaceUserContext {
  user: Object;
  setuser: Function;
}

const UserContext = createContext({} as InterfaceUserContext);

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setuser] = useState({});
  const [isIserLogin, setIsIserLogin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setuser(JSON.parse(user));
      setIsIserLogin(true);
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <UserContext.Provider
      value={{
        user,
        setuser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within an UserProvider");
  }
  return context;
};

export { UserProvider, useUser };
