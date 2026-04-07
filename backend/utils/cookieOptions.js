const accessCookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    maxAge: 20 * 1000,
};

const refreshCookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

module.exports = {
    accessCookieOptions,
    refreshCookieOptions
}