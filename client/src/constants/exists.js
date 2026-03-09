const tokenExists = () => {
    const token = localStorage.getItem("jwttoken");
    if(token){
        return true;
    }
    return false;
}

export default tokenExists