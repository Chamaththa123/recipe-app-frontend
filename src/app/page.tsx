import { redirect } from "next/navigation";

const HomePage = () => {
  redirect("/guest/login");
  return null;
};

export default HomePage;
