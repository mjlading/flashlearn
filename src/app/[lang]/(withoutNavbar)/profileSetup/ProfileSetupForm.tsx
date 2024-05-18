"use client";

import { api } from "@/app/api/trpc/client";
import { getDictionary } from "@/app/dictionaries/dictionaries";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { academicLevelMap } from "@/lib/academicLevel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function ProfileSetupForm({
  dict,
}: {
  dict: Awaited<ReturnType<typeof getDictionary>>; // fancy unwrap
}) {
  const formSchema = z.object({
    nickname: z
      .string()
      .min(2, {
        message: dict.profileSetupPage.nicknameMinimum,
      })
      .max(50, {
        message: dict.profileSetupPage.nicknameMaximum,
      }),
    academicLevel: z.enum(
      Object.keys(academicLevelMap) as [string, ...string[]]
    ),
  });
  const setNicknameMutation = api.user.setNickname.useMutation();
  const setAcademicLevelMutation = api.user.setAcademicLevel.useMutation();
  const session = useSession();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickname: "",
      academicLevel: "BACHELOR",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const response = await setNicknameMutation.mutateAsync(values.nickname);

    if (response === "NICKNAME_IN_USE") {
      toast.info(dict.profileSetupPage.nicknameTaken);
      return;
    }

    setAcademicLevelMutation.mutate({
      academicLevel: values.academicLevel,
    });

    // Manually update the session
    await session.update({
      nickname: values.nickname,
      preferencesSet: true,
      academicLevel: values.academicLevel,
    });

    toast.success(dict.profileSetupPage.updateSuccess);

    router.push(`/${dict.lang}/dashboard/decks?category=recent`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Nickname input */}
        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dict.profileSetupPage.nickname}</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 shadow-sm">
                    <AvatarImage
                      src={session.data?.user.image ?? ""}
                      alt="profil"
                    />
                    <AvatarFallback>{dict.profileSetupPage.me}</AvatarFallback>
                  </Avatar>
                  <Input
                    placeholder={dict.profileSetupPage.yourNickname}
                    {...field}
                  />
                </div>
              </FormControl>
              <FormDescription>
                {dict.profileSetupPage.yourPublicNickname}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Academic level select */}
        <div className="md:col-span-2">
          <FormField
            control={form.control}
            name="academicLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dict.profileSetupPage.academicLevel}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.keys(academicLevelMap).map(
                      (academicLevelOption) => (
                        <SelectItem
                          value={academicLevelOption}
                          key={academicLevelOption}
                        >
                          {academicLevelMap[academicLevelOption]}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={
            setNicknameMutation.isLoading || setNicknameMutation.isSuccess
          }
        >
          {setNicknameMutation.isLoading && (
            <LoadingSpinner className="mr-2" size={20} />
          )}
          {dict.profileSetupPage.save}
        </Button>
      </form>
    </Form>
  );
}
