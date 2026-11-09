export const isLoggedin = () => {
    return !!localStorage.getItem("token");
};

export  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
};

