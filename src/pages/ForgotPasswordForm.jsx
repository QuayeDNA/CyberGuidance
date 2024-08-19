import { useState } from 'react';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaSpinner } from "react-icons/fa";
import PropTypes from "prop-types";

const forgotPasswordSchema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Email is required"),
});

function ForgotPasswordForm({ onSubmit, isLoading, onBackToLogin }) {
  const [successMessage, setSuccessMessage] = useState("");
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: { email: "" }
  });

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
      setSuccessMessage("OTP has been sent to your email. Please check your inbox and spam folder.");
    } catch (error) {
      // If there's an error, it will be handled by the parent component
      setSuccessMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}
      <div>
        <label htmlFor="forgotPasswordEmail" className="block text-gray-700 font-semibold mb-2">
          Email
        </label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="email"
              id="forgotPasswordEmail"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your email"
            />
          )}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <FaSpinner className="animate-spin mr-2" />
            Sending...
          </>
        ) : (
          "Send Reset Instructions"
        )}
      </button>
      <p className="text-center text-gray-600 mt-4">
        <button
          onClick={onBackToLogin}
          className="text-blue-600 hover:underline focus:outline-none"
          type="button"
        >
          Back to Login
        </button>
      </p>
    </form>
  );
}

ForgotPasswordForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onBackToLogin: PropTypes.func.isRequired,
};

export default ForgotPasswordForm;