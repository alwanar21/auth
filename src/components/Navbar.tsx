import {
  Button,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Navbar as Nav,
  Avatar,
  PopoverTrigger,
  PopoverContent,
  Popover,
  Modal,
  ModalContent,
  useDisclosure,
  ModalHeader,
  ModalFooter,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/auth-store";
import Cookies from "js-cookie";
import { useQueryClient } from "@tanstack/react-query";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const navigate = useNavigate();

  function getInitials(name: string) {
    if (!name) return "";
    const words = name.split(" ");
    const initials = words.map((word) => word.charAt(0).toUpperCase()).join("");
    return initials;
  }

  const LogOut = () => {
    Cookies.remove("isAuthenticated");
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    queryClient.invalidateQueries({ queryKey: ["profile"] });
    logout();
    navigate("/");
  };
  return (
    <>
      <Nav maxWidth="full">
        <NavbarBrand>
          <p className="font-bold text-inherit">Auth App</p>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem>
            <div className="flex flex-row gap-2 justify-center items-center">
              <div className="flex flex-col text-right ">
                <h5 className="text-medium font-semibold ">{user?.username}</h5>
                <p className="text-[10px] text-primary-500">{user?.email}</p>
              </div>
              <Popover placement="bottom" showArrow={false}>
                <PopoverTrigger>
                  <Avatar
                    src={user?.picture}
                    showFallback
                    name={getInitials(user?.username as string) || ""}
                    className="text-xl cursor-pointer"
                  />
                </PopoverTrigger>
                <PopoverContent>
                  <div className="px-1 py-2">
                    <Button color="danger" variant="flat" size="sm" className="w-full mt-2" onClick={onOpen}>
                      Logout
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </NavbarItem>
        </NavbarContent>
      </Nav>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Are you sure you want to log out?</ModalHeader>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="danger" onPress={LogOut}>
                  Yes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
