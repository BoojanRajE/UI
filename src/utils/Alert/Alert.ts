import Swal, { SweetAlertOptions } from "sweetalert2";

const Alert = {
  config: {
    success: {
      title: "Success",
      message: "",
    },
    info: {
      title: "Info",
      message: "",
    },
    error: {
      title: "Failed",
      message: "",
    },
    warn: {
      title: "Warning",
      message: "",
    },
  },

  capitalizeWords: function (string: string) {
    return string.replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
  },

  success: function (
    this: any,
    {
      title = this.config.success.title,
      text = this.config.success.message,
      ...rest
    }
  ) {
    return Swal.fire({
      ...rest,
      title: title,
      text,
      icon: "success",
    });
  },

  info: function (
    this: any,
    { title = this.config.info.title, text = this.config.info.message, ...rest }
  ) {
    return Swal.fire({
      ...rest,
      title: title,
      text,
      icon: "info",
    });
  },

  error: function (
    this: any,
    {
      title = this.config.error.title,
      text = this.config.error.message,
      ...rest
    }
  ) {
    return Swal.fire({
      ...rest,
      title: title,
      text,
      icon: "error",
    });
  },

  warn: function (
    this: any,
    { title = this.config.warn.title, text = this.config.warn.message, ...rest }
  ) {
    return Swal.fire({
      ...rest,
      title: title,
      text,
      icon: "warning",
    });
  },

  confirm: function (this: any, callback: Function) {
    return Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        callback();
      }
    });
  },

  // custom
  add: function (
    this: any,
    {
      title = this.config.error.title,
      text = this.config.error.message,
      ...rest
    }
  ) {
    return Swal.fire({
      ...rest,
      title: `${this.capitalizeWords(title)} added successfully!`,
      text,
      icon: "success",
    });
  },
  update: function (
    this: any,
    {
      title = this.config.error.title,
      text = this.config.error.message,
      ...rest
    }
  ) {
    return Swal.fire({
      ...rest,
      title: `${this.capitalizeWords(title)} updated successfully!`,
      text,
      icon: "success",
    });
  },
  delete: function (
    this: any,
    {
      title = this.config.error.title,
      text = this.config.error.message,
      ...rest
    }
  ) {
    return Swal.fire({
      ...rest,
      title: `${this.capitalizeWords(title)} deleted successfully!`,
      text,
      icon: "success",
    });
  },

  already: function (
    this: any,
    { title = this.config.info.title, text = this.config.info.message, ...rest }
  ) {
    return Swal.fire({
      ...rest,
      title: `${this.capitalizeWords(title)} already exists!`,
      text,
      icon: "info",
    });
  },

  addError: function (
    this: any,
    {
      title = this.config.error.title,
      text = this.config.error.message,
      ...rest
    }
  ) {
    return Swal.fire({
      ...rest,
      title: `Unable to add ${this.capitalizeWords(title)}!`,
      text,
      icon: "error",
    });
  },
  updateError: function (
    this: any,
    {
      title = this.config.error.title,
      text = this.config.error.message,
      ...rest
    }
  ) {
    return Swal.fire({
      ...rest,
      title: `Unable to update ${this.capitalizeWords(title)}!`,
      text,
      icon: "error",
    });
  },
  deleteError: function (
    this: any,
    {
      title = this.config.error.title,
      text = this.config.error.message,
      ...rest
    }
  ) {
    return Swal.fire({
      ...rest,
      title: `Unable to delete ${this.capitalizeWords(title)}!`,
      text,
      icon: "error",
    });
  },
};

export default Alert;
