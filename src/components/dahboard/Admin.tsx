import { useQuery } from "@tanstack/react-query";
import { GetProfiles } from "../../services/profile-service";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import moment from "moment";

type User = {
  id: string;
  email: string;
  username: string;
  birthDate: string | null;
  picture: string | null;
  roles: string;
  isActive: boolean;
};

export default function Admin() {
  const profilesQuery = useQuery({ queryKey: ["profiles"], queryFn: GetProfiles });

  return (
    <>
      <h3 className="text-center text-2xl font-semibold mb-2 mt-4">PROFILES</h3>
      {profilesQuery.isLoading && (
        <>
          <Table
            selectionMode="single"
            defaultSelectedKeys={["2"]}
            aria-label="Example static collection table"
            className="max-w-4xl mx-auto px-4"
          >
            <TableHeader>
              <TableColumn>N0</TableColumn>
              <TableColumn>USERNAME</TableColumn>
              <TableColumn>EMAIL</TableColumn>
              <TableColumn>BIRTH DATE</TableColumn>
              <TableColumn>STATUS</TableColumn>
            </TableHeader>
            <TableBody emptyContent={<div>Loading...</div>}>{[]}</TableBody>
          </Table>
        </>
      )}

      {profilesQuery.isFetched && (
        <Table
          selectionMode="single"
          defaultSelectedKeys={["2"]}
          aria-label="Example static collection table"
          className="max-w-4xl mx-auto px-4"
        >
          <TableHeader>
            <TableColumn>N0</TableColumn>
            <TableColumn>USERNAME</TableColumn>
            <TableColumn>EMAIL</TableColumn>
            <TableColumn>BIRTH DATE</TableColumn>
            <TableColumn>STATUS</TableColumn>
          </TableHeader>
          {profilesQuery.data?.data?.data.length >= 1 ? (
            <TableBody isLoading={profilesQuery.isLoading} loadingContent={<div>loading.......</div>}>
              {profilesQuery.data?.data?.data.map((user: User, index: number) => (
                <TableRow key={user.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{moment(user.birthDate).format("L") || "N/A"}</TableCell>
                  <TableCell>{user.isActive ? "Active" : "Inactive"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <TableBody emptyContent={"No data to display"}>{[]}</TableBody>
          )}
        </Table>
      )}
    </>
  );
}
