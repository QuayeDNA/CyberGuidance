import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaSpinner } from "react-icons/fa";
import PropTypes from "prop-types";

const otpSchema = yup.object().shape({
  otp: yup.string().required("OTP is required").length(6, "OTP must be 6 digits"),
});

function OtpVerificationForm({ onSubmit, isLoading }) {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(otpSchema),
    defaultValues: { otp: "" }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="otp" className="block text-gray-700 font-semibold mb-2">
          Enter OTP
        </label>
        <Controller
          name="otp"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              id="otp"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.otp ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter 6-digit OTP"
            />
          )}
        />
        {errors.otp && (
          <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>
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
            Verifying...
          </>
        ) : (
          "Verify OTP"
        )}
      </button>
    </form>
  );
}

OtpVerificationForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    };

export default OtpVerificationForm;