"use client";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { newVerification } from "@/actions/new-verification";
import { BeatLoader } from "react-spinners";
import { FormSuccess } from "../form-success";
import { FormError } from "../form-error";

const VerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [suceess, setSuceess] = useState<string | undefined>();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (suceess || error) {
      return;
    }
    if (!token) {
      setError("Missing token");
      return;
    }
    newVerification(token)
      .then((res) => {
        setSuceess(res.success);
        setError(res.error);
      })
      .catch(() => {
        setError("Something went wrong");
      });
  }, [token, suceess, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);
  return (
    <CardWrapper
      headerLabel="Confirm your verification"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className="flex items-center w-full justify-center">
        {!suceess && !error && <BeatLoader />}
       
        <FormSuccess message={suceess} />
        {!suceess && <FormError message={error} />}
      </div>
    </CardWrapper>
  );
};

export default VerificationForm;
