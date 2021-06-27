const jwt = require("jsonwebtoken");
import { Request, Response, NextFunction } from "express";
require("dotenv").config();

function verifyToken(req: Request | any, res: Response, next: NextFunction) {
  const token: string | string[] = req.headers["x-access-token"];
  if (!token)
    return res.status(403).send({ auth: false, message: "No token provided." });

  jwt.verify(token, process.env.jwtSecret, function (err: any, decoded: any) {
    if (err) {
      return res
        .status(500)
        .json({ auth: false, message: "Failed to authenticate token." });
    }
    // if everything good, save to request for use in other routes
    let credentials: any = decodedCredentials(decoded);
    req["credentials"] = credentials;

    next();
  });
}

function decodedCredentials(decoded: any) {
  const { _id, fullname, email, address, phoneNumbers, city, state } =
    decoded.credentials as any;
  return {
    _id,
    fullname,
    email,
    address,
    phoneNumbers,
    city,
    state,
  };
}

export default verifyToken;
