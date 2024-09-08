/**
 * @swagger
 * /api/userUpdateAll:
 *   post:
 *     summary: Create and update users in bulk
 *     tags: [UserApi]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             example:
 *               [{
 *                 "id": "1725779613112",
 *                 "tempId": "1725779613112",
 *                 "last_name": "Kanaeru",
 *                 "position": "CEO",
 *                 "first_name": "Kobo",
 *                 "phone": "(+62) 444444444",
 *                 "email": "kobokanaeru@gmail.com"
 *               },
 *               {
 *                 "id": "Wx2dtN9ppOrXaJuLXTxY",
 *                 "email": "moonahoshinovaUwU@gmail.com",
 *                 "position": "CTO",
 *                 "last_name": "Hoshinova test",
 *                 "phone": "(+62) 444444444",
 *                 "first_name": "Moona "
 *               }
 *               ]
 *     responses:
 *       200:
 *         description: Users successfully created and updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       500:
 *         description: Failed to update documents
 */

import { firestore } from "@/firebase";
import { doc, writeBatch } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

interface User {
  id?: string;
  tempId: string;
  first_name: string;
  last_name: string;
  position: string;
  phone: string;
  email: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const items: User[] = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res
      .status(400)
      .json({ error: "Invalid input: Expected an array of users." });
  }

  const batch = writeBatch(firestore);

  items.forEach((item) => {
    const itemRef = doc(firestore, "user", item.id || item.tempId);
    const userData = { ...item, id: item.id || item.tempId };

    if (item.id) {
      batch.update(itemRef, userData);
    } else {
      batch.set(itemRef, userData);
    }
  });

  try {
    await batch.commit();
    return res
      .status(200)
      .json({ message: "All documents successfully updated!" });
  } catch (error) {
    console.error("Error updating documents: ", error);
    return res.status(500).json({ error: "Failed to update documents" });
  }
}
