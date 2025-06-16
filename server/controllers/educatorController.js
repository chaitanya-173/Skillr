import { clerkClient } from '@clerk/express';
import User from '../models/User.js';

export const updateRoleToEducator = async (req, res) => {
  try {
    const userId = req.auth.userId;

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: 'educator',
      }
    });

    const clerkUser = await clerkClient.users.getUser(userId);
    const { firstName, lastName, emailAddresses, imageUrl, id } = clerkUser;

    const email = emailAddresses[0]?.emailAddress || '';
    const fullName = `${firstName} ${lastName}`;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        _id: id,
        name: fullName,
        email,
        imageUrl,
        role: 'educator',
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, message: 'Role updated & user saved to DB', user: updatedUser });

  } catch (error) {
    console.error('updateRoleToEducator error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};