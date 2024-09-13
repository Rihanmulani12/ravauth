"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import {NewPasswordSchema} from "@/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardWrapper } from "./card-wrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { reset } from "@/actions/reset";
import { useSearchParams } from "next/navigation";
import { newPassword } from "@/actions/new-password";


export const NewPasswordForm = () => {

  const serchParams = useSearchParams()

  const token = serchParams.get("token")





  const [error , setError] = useState<string | undefined>("")
  const [success , setSuccess] = useState<string | undefined >("")

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    
    },
  });

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {

    setError("")
    setSuccess("")

    

    startTransition(() => {
      newPassword(values, token)
      .then((data) => {
        
        setError(data?.error)
        setSuccess(data?.success)
        
      })
    })
    
    
  };

  return (
    <CardWrapper
      headerLabel="Enter a new password"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
     
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            
          </div>
          
          <FormError message={error }/>
          <FormSuccess message={success}/>
          <Button type="submit"
          disabled={isPending}
           className="w-full">
            Reset Password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
