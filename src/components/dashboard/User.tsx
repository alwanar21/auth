import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

export default function User() {
  const navigate = useNavigate();
  return (
    <div className="container mx-auto px-3 sm:px-0">
      <div className="">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Excepturi iure cupiditate culpa dolorum vero tempora.
        Corrupti non asperiores soluta ad, eveniet enim ullam cumque voluptatibus nesciunt dolorum earum pariatur
        doloremque.
      </div>
      <div className="flex flex-row gap-3 mt-2">
        <Button size="sm" variant="flat" color="primary" onClick={() => navigate("profile/edit")}>
          Edit profile
        </Button>
        <Button size="sm" color="primary" className="text-white" onClick={() => navigate("profile/password/edit")}>
          Change password
        </Button>
      </div>
    </div>
  );
}
