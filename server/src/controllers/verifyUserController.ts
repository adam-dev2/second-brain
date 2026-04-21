import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const verifyUserController = async (req: Request, res: Response) => {
  try {
    const cookieToken = req.cookies?.token;
    const headerToken = req.headers.authorization?.split(' ')[1];
    console.log(req.headers.authorization);
<<<<<<< HEAD
    console.log(req.cookies);
    
    if (!cookieToken && !headerToken) {
      return res.status(403).json({ message: "Token Not Found" });
=======
    console.log(req);

    if (!cookieToken && !headerToken) {
      return res.status(403).json({ message: "Token Not Found" ,Cookies:req.cookies});
>>>>>>> 8ab5abf (parrot work)
    }

    const decoded = jwt.verify(cookieToken, process.env.JWT_SECRET!);
    return res.status(200).json({
      message: "User Verified",
      user: {
        id: req.user?.id!,
        username: req.user?.username
    }
    });

  } catch (err) {
    return res.status(403).json({ message: "Invalid Token" });
  }
};
