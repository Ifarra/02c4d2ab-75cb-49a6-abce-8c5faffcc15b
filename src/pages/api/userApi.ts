/**
 * @swagger
 * tags:
 *   name: UserApi
 *   description: API for managing User
 */

/**
 * @swagger
 * /api/userApi/:
 *   get:
 *     summary: Get all user list
 *     tags: [UserApi]
 *     responses:
 *       200:
 *         description: A list of items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                     id:
 *                       type: string
 *                       description: The ID of the user
 *                     first_name:
 *                       type: string
 *                       description: The first name of the user
 *                     last_name:
 *                       type: string
 *                       description: The last name of the user
 *                     position:
 *                       type: string
 *                       description: The job position of the user
 *                     phone:
 *                       type: string
 *                       description: The phone number of the user
 *                     email:
 *                       type: string
 *                       description: The email address of the user
 *       500:
 *         description: Failed to fetch user
 */

/**
 * @swagger
 * /api/userApi/:
 *   post:
 *     summary: Create a new user
 *     tags: [UserApi]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: The first name of the user
 *               last_name:
 *                 type: string
 *                 description: The last name of the user
 *               position:
 *                 type: string
 *                 description: The job position of the user
 *               phone:
 *                 type: string
 *                 description: The phone number of the user
 *               email:
 *                 type: string
 *                 description: The email address of the user
 *     responses:
 *       201:
 *         description: Item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   first_name:
 *                     type: string
 *                     description: The first name of the user
 *                   last_name:
 *                     type: string
 *                     description: The last name of the user
 *                   position:
 *                     type: string
 *                     description: The job position of the user
 *                   phone:
 *                     type: string
 *                     description: The phone number of the user
 *                   email:
 *                     type: string
 *                     description: The email address of the user
 *       500:
 *         description: Failed to create user
 */

/**
 * @swagger
 * /api/userApi?id={id}:
 *   put:
 *     summary: Update an existing user
 *     tags: [UserApi]
 *     parameters:
 *       - name: id
 *         in: query
 *         required: true
 *         description: The unique identifier for the user
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: First name of the user
 *               last_name:
 *                 type: string
 *                 description: Last name of the user
 *               position:
 *                 type: string
 *                 description: Job position of the user
 *               phone:
 *                 type: string
 *                 description: Phone number of the user
 *               email:
 *                 type: string
 *                 description: Email of the user
 *
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 first_name:
 *                   type: string
 *                   description: First name of the user
 *                 last_name:
 *                   type: string
 *                   description: Last name of the user
 *                 position:
 *                   type: string
 *                   description: Job position of the user
 *                 phone:
 *                   type: string
 *                   description: Phone number of the user
 *                 email:
 *                   type: string
 *                   description: Email of the user
 *       500:
 *         description: Failed to update user
 */

/**
 * @swagger
 * /api/userApi?id={id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [UserApi]
 *     parameters:
 *       - name: id
 *         in: query
 *         required: true
 *         description: The unique identifier for the user
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       500:
 *         description: Failed to delete user
 */

import { NextApiRequest, NextApiResponse } from "next";
import { firestore } from "@/firebase";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

// Define the interface for a User item
interface User {
  id?: string; // Optional since it will be generated by Firestore
  first_name: string;
  last_name: string;
  position: string;
  phone: string;
  email: string;
}

const itemsCollection = collection(firestore, "user");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return await getItems(req, res);
    case "POST":
      return await createItem(req, res);
    case "PUT":
      return await updateItem(req, res);
    case "DELETE":
      return await deleteItem(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

const getItems = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const snapshot = await getDocs(itemsCollection);
    const items: User[] = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as User)
    );
    res.status(200).json(items);
  } catch (error) {
    console.error("Failed to fetch items:", error);
    res.status(500).json({ error: "Failed to fetch items" });
  }
};

const createItem = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const newItem: User = req.body; // Ensure the body matches the User interface
    const docRef = await addDoc(itemsCollection, newItem);
    res.status(201).json({ id: docRef.id, ...newItem });
  } catch (error) {
    console.error("Failed to create item:", error);
    res.status(500).json({ error: "Failed to create item" });
  }
};

const updateItem = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  try {
    const itemRef = doc(firestore, "user", id as string);
    await updateDoc(itemRef, req.body);
    res.status(200).json({ id, ...req.body });
  } catch (error) {
    console.error("Failed to update item:", error);
    res.status(500).json({ error: "Failed to update item" });
  }
};

const deleteItem = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  try {
    const itemRef = doc(firestore, "user", id as string);
    await deleteDoc(itemRef);
    res.status(204).end();
  } catch (error) {
    console.error("Failed to delete item:", error);
    res.status(500).json({ error: "Failed to delete item" });
  }
};
