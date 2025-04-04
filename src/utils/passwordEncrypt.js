import bcrypt from "bcrypt";

const saltRounds = 10;
export const hashgenerator = async (myPassword) => {
  try {
    const hash = await bcrypt.hash(myPassword, saltRounds);
    return hash;
  } catch (error) {
    console.error(error);
  }
};

export const comparePassword = async (password, hash) => {
  try {
    const compare = await bcrypt.compare(password, hash);
    return compare;
  } catch (error) {
    console.error(error);
  }
};

export const createRoles = () => {
  return ['admin', 'user'];
}
