import { atom } from "recoil";

export interface IForm {
  username?: string;
  email: string;
  password: string;
}

export const SignupFormAtom = atom<IForm>({
  key: "Signup",
  default: { username: "", email: "", password: "" },
});
