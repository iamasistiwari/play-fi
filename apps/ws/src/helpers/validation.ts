import dotenv from "dotenv";
import jwt, { JwtPayload } from "jsonwebtoken";
dotenv.config();

export const verifyUser = async (token: string): Promise<string | null> => {
    const key = process.env.NEXTAUTH_SECRET!;
    try {
        const decoded = jwt.verify(token, key) as JwtPayload
        if(decoded && decoded.id){
            return decoded.id
        }
        return null
    } catch (error) {
        return null
    }
};
