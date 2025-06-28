import bcrypt from "bcrypt";

const saltRounds = 10;
export const hashgenerator = async (myPassword) => {
  try {
    if (!myPassword) throw Error("Params is not valid");
    const hash = await bcrypt.hash(myPassword, saltRounds);
    return hash;
  } catch (error) {
    throw error;
  }
};

export const comparePassword = async (password, hash) => {
  try {
    if (!password || !hash) throw Error("Params is not valid")
    const compare = await bcrypt.compare(password, hash);
    return compare;
  } catch (error) {
    throw error;
  }
};

export const createRoles = () => {
  return ["admin", "user"];
};
