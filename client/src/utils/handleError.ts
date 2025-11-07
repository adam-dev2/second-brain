import { toast } from "react-hot-toast";
import axios from "axios";

export const handleError = (err: unknown, fallbackMessage = "Something went wrong") => {
  if (axios.isAxiosError(err)) {
    const message =
      err.response?.data?.message || err.response?.data?.error || err.message || fallbackMessage;

    console.error("[API Error]:", message, err.response || err);
    toast.error(message);
  } else {
    console.error("[Unexpected Error]:", err);
    toast.error(fallbackMessage);
  }
};
