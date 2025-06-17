import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhooks = async (req, res) => {
  try {
    console.log("Clerk webhook hit");

    const payload = JSON.stringify(req.body);
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    let event;
    try {
      const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
      event = wh.verify(payload, headers);
    } catch (err) {
      console.error("Signature verification failed:", err.message);
      return res.status(400).json({ success: false, error: "Invalid webhook signature" });
    }

    const { data, type } = event;
    console.log("Event Type:", type);

    switch (type) {
      case "user.created": {
        const emailObj = data.email_addresses.find(
          e => e.id === data.primary_email_address_id
        );

        const newUser = {
          _id: data.id,
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          email: emailObj?.email_address || "unknown@noemail.com",
          imageUrl: data.image_url || "",
        };

        await User.create(newUser);
        break;
      }

      case "user.updated": {
        const emailObj = data.email_addresses.find(
          e => e.id === data.primary_email_address_id
        );

        const updatedUser = {
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          email: emailObj?.email_address || "unknown@noemail.com",
          imageUrl: data.image_url || "",
        };

        await User.findByIdAndUpdate(data.id, updatedUser);
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        break;
      }

      default:
        console.log("⚠️ Unhandled event:", type);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error.message);
    res.status(400).json({ success: false, error: error.message });
  }
};
