import { useEffect } from "react";
import { ValidatorForm } from "react-material-ui-form-validator";

export default function useValidators(password = null, passwordConfirm = null) {
  useEffect(() => {
    if (!ValidatorForm.hasValidationRule("noSpace")) {
      ValidatorForm.addValidationRule("noSpace", (value) => {
        for (const item of value) {
          if (item === " ") return false;
        }
        return true;
      });
    }

    if (!ValidatorForm.hasValidationRule("isPasswordMatch")) {
      ValidatorForm.addValidationRule("isPasswordMatch", (value) => {
        if (value !== passwordConfirm) {
          return false;
        }
        return true;
      });
    }

    if (!ValidatorForm.hasValidationRule("isPasswordMatchConfirm")) {
      ValidatorForm.addValidationRule("isPasswordMatchConfirm", (value) => {
        if (value !== password) {
          return false;
        }
        return true;
      });
    }

    return function cleanPasswordMatchRule() {
      if (ValidatorForm.hasValidationRule("noSpace")) {
        ValidatorForm.removeValidationRule("noSpace");
      }
      if (ValidatorForm.hasValidationRule("isPasswordMatchConfirm")) {
        ValidatorForm.removeValidationRule("isPasswordMatchConfirm");
      }
      if (ValidatorForm.hasValidationRule("isPasswordMatch")) {
        ValidatorForm.removeValidationRule("isPasswordMatch");
      }
    };
  }, [password, passwordConfirm]);
}
