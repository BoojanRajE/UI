const API_PATH = {
    production: {
        API_ROOT: process.env.REACT_APP_PROD_API_ROOT
    },

    development: {
        API_ROOT: process.env.REACT_APP_DEV_API_ROOT
    }
};

export default API_PATH;
