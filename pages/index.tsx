import type { NextPage } from "next";
import type { User } from "@prisma/client";
import { useState } from "react";
import Head from "next/head";
import { useUsers } from "hooks/useUsers";
import Form from "components/Form";
import Users from "components/Users";

const initialValues = {
  name: "",
  email: "",
};

const Home: NextPage = () => {
  const [formData, setFormData] = useState(initialValues);
  const [actionMethod, setActionMethod] = useState<"save" | "update">("save");
  const { users, isLoading, mutate } = useUsers("/users");

  // Clear Form
  const handleClear = () => {
    setFormData(initialValues);
    setActionMethod("save");
  };

  // Edit User
  const handleEdit = (user: User) => {
    setFormData(user);
    setActionMethod("update");
  };

  // Save - Update User
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const method = actionMethod === "save" ? "POST" : "PUT";
    const response = await fetch("/api/users", {
      method,
      body: JSON.stringify(formData),
    });
    if (response.status < 300) {
      await response.json();
      mutate();
    }
    handleClear();
  };

  // Delete User
  const handleDelete = async (user: User) => {
    const response = await fetch("/api/users", {
      method: "DELETE",
      body: JSON.stringify(user),
    });
    if (response.status < 300) {
      await response.json();
      mutate();
    }
    handleClear();
  };

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Next.js with Prisma (SQLite)</h1>

        {isLoading ? (
          <div>
            <p>Loading...</p>
          </div>
        ) : (
          <Users users={users} onEdit={handleEdit} onDelete={handleDelete} />
        )}

        <Form
          formData={formData}
          setFormData={setFormData}
          onSave={handleSave}
          onClear={handleClear}
          actionMethod={actionMethod}
        />
      </main>
    </>
  );
};

export default Home;
