const CsvParser = require("json2csv").Parser;
const fs = require("fs");
const sendDriverDataEmail = require("./sendDriverDataEmail");

const generateCsvFile = async (driverData) => {
    const drivers = [];
    const admin = "oauride@gmail.com";

    driverData.forEach((driver) => {
        const {
            _id,
            firstName,
            lastName,
            isVerified,
            backViewCarPhoto,
            driverInspection,
            driverInsurance,
            driverLicense,
            driverPhoto,
            frontViewCarPhoto,
            intCarPhoto,
            driverLicenseNo,
            vehicleYear,
            city,
        } = driver;
        drivers.push({
            _id,
            firstName,
            lastName,
            isVerified,
            backViewCarPhoto,
            driverInspection,
            driverInsurance,
            driverLicense,
            driverPhoto,
            frontViewCarPhoto,
            intCarPhoto,
            driverLicenseNo,
            vehicleYear,
            city,
        });
    });
    const csvFields = [
        "Id",
        "First Name",
        "Last Name",
        "isVerified",
        "backViewCarPhoto",
        "driverInspection",
        "driverInsurance",
        "driverLicense",
        "driverPhoto",
        "frontViewCarPhoto",
        "intCarPhoto",
        "Driver License No",
        "Vehicle Year",
        "City",
    ];

    const csvParser = new CsvParser({ csvFields });
    const csvData = csvParser.parse(drivers);
    fs.writeFileSync("drivers.csv", csvData, (err) => {
        if (err) {
            console.log(err);
        }
    });

    pathToAttachment = "drivers.csv";
    attachment = fs.readFileSync(pathToAttachment).toString("base64");

    await sendDriverDataEmail(admin, attachment);
    fs.unlinkSync(pathToAttachment);
};

module.exports = generateCsvFile;
