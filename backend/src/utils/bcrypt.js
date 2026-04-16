import bcrypt from "bcrypt";

//====password  hash krne k liye =========
export const  hashPassword = async (password) =>{
return await bcrypt.hash(password,10)
};

//=====password compare krne k liye ======

export const comparePassword = async (password , hashPassword) =>{
    return await bcrypt.compare(password,hashPassword)
}

