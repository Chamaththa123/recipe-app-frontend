import { redirect } from "next/navigation";

const HomePage = () => {
  redirect("/auth");
  return null;
};

export default HomePage;
