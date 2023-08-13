const createTokenDriver = (driver) => {
    return { driverId: driver._id, email: driver.email, role: driver.role };
};

module.exports = createTokenDriver;
