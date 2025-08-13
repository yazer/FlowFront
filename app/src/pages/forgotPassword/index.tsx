import React, { useEffect, useRef } from "react";
import { FormattedMessage } from "react-intl";
import { Button } from "../../components/Button/Button";
import InputField from "../../components/FormElements/newcompnents/InputField";
import useTranslation from "../../hooks/useTranslation";

export default function Index() {
  const [step, setStep] = React.useState(1);

  switch (step) {
    case 1:
      return <StepOne setStep={setStep} />;
    case 2:
      return <StepTwo setStep={setStep} />;
    case 3:
      return <StepThree />;
    default:
      return <StepOne setStep={setStep} />;
  }
}

function StepOne({
  setStep,
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { translate } = useTranslation();

  function handleSubmit() {
    setStep(2);
  }

  return (
    <>
      <h3 className="text-2xl font-bold leading-7  text-gray-900  sm:text-3xl sm:tracking-tight">
        <FormattedMessage
          id="forgotPassword.title"
          defaultMessage="Forgot Password"
        />
      </h3>

      <h5 className="text-sm text-gray-400  sm:text-sm sm:tracking-tight">
        <FormattedMessage
          id="forgotPassword.description"
          defaultMessage="Forgot Password"
        />
      </h5>

      <div className="flex gap-2 justify-start text-left mt-4">
        <InputField
          name="email"
          label={<FormattedMessage id="email" defaultMessage="Email" />}
          type="email"
          placeholder={translate("forgotPassword.emailPlaceholder")}
        />
      </div>
      <Button className="mt-4 w-full" type="submit" onClick={handleSubmit}>
        <FormattedMessage id="forgotPassword.cta.one" />
      </Button>
    </>
  );
}

/**
 * OTP Input Component
 * This component will handle the OTP input for the second step of the forgot password flow.
 */
function StepTwo({
  setStep,
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [otpinput, setOtpInput] = React.useState(Array(4).fill(""));
  const [activeIndex, setActiveIndex] = React.useState(0);

  function handleSubmit() {
    setStep(3);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-2xl font-bold leading-7 text-gray-900  sm:text-3xl sm:tracking-tight">
        <FormattedMessage
          id="forgotPassword.otpTitle"
          defaultMessage="Enter OTP"
        />
      </h3>
      <div className="flex gap-2">
        {/* OTP input fields will go here */}
        {otpinput.map((value, index) => (
          <OTPItem
            focused={index === activeIndex}
            value={otpinput}
            key={index}
            index={index}
            setValue={setOtpInput}
            setActiveIndex={setActiveIndex}
          />
        ))}
      </div>

      <Button size="large" onClick={handleSubmit}>
        <FormattedMessage id="forgotPassword.cta.two" />
      </Button>
    </div>
  );
}

function OTPItem({
  focused,
  value,
  index,
  setValue,
  setActiveIndex,
}: {
  focused?: boolean;
  value: string[];
  setValue: React.Dispatch<React.SetStateAction<String[]>>;
  index: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focused && ref.current) {
      ref.current?.focus();
    }
  }, [focused]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;
    if (isNaN(Number(newValue))) {
      return;
    }
    const newOtpInput = [...value];
    newOtpInput[index] = newValue.slice(-1);
    setValue(newOtpInput);
    setActiveIndex((prevIndex) => prevIndex + 1);
  }

  return (
    <input
      ref={ref}
      type="text"
      onChange={handleInputChange}
      onFocus={() => setActiveIndex(index)}
      value={value[index]}
      className="w-12 h-12 border border-gray-300 rounded text-center text-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-500"
      style={{ margin: "0 4px" }}
    />
  );
}

/** Step 3
 *  Setting up New password
 */

function StepThree() {
  return (
    <div className="flex flex-col text-left gap-4">
      <InputField label={"New password"} type="password" />
      <InputField label={"Confirm Password"} type="password" />

      <Button>
        <FormattedMessage id="cta.submit" defaultMessage="Submit" />
      </Button>
    </div>
  );
}
