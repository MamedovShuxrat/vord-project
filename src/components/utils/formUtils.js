export const resetForm = (setLocalFormData, setDbType, setDriver, onFormDataChange) => {
    setLocalFormData({
        user: "",
        password: "",
        dbName: "",
        description: "",
        host: "",
        port: "",
        url: "",
        dbType: "",
        driver: ""
    });
    setDbType("");
    setDriver("");
    onFormDataChange({});
};
