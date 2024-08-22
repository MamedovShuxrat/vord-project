import toast from "react-hot-toast";

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

export const handleFormButtonClick = (isFormValid) => {
    if (!isFormValid) {
        toast.error("Please fill in all required fields!");
    }
};
